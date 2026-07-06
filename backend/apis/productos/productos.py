from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional
from db.database import get_conn
from utils.auth.session import verify_session, solo_admin

router = APIRouter(prefix="/productos", tags=["productos"])

class ProductoBody(BaseModel):
    nombre:      str
    descripcion: Optional[str] = ""
    precio:      int
    stock:       Optional[int] = 0
    categoria:   Optional[str] = "general"
    emoji:       Optional[str] = "🥜"
    imagen:      Optional[str] = None

class ProductoUpdate(BaseModel):
    nombre:      Optional[str] = None
    descripcion: Optional[str] = None
    precio:      Optional[int] = None
    stock:       Optional[int] = None
    categoria:   Optional[str] = None
    emoji:       Optional[str] = None
    imagen:      Optional[str] = None
    activo:      Optional[int] = None

@router.get("")
def listar_productos(categoria: Optional[str] = Query(None)):
    conn = get_conn()
    if categoria:
        rows = conn.execute(
            "SELECT * FROM productos WHERE activo=1 AND categoria=? ORDER BY nombre", (categoria,)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM productos WHERE activo=1 ORDER BY nombre"
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/admin/todos")
def listar_todos(user: dict = Depends(solo_admin)):
    conn = get_conn()
    rows = conn.execute("SELECT * FROM productos ORDER BY activo DESC, nombre").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{producto_id}")
def obtener_producto(producto_id: int):
    conn = get_conn()
    row = conn.execute("SELECT * FROM productos WHERE id=? AND activo=1", (producto_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return dict(row)

@router.post("", status_code=201)
def crear_producto(body: ProductoBody, user: dict = Depends(solo_admin)):
    conn = get_conn()
    cur = conn.execute(
        "INSERT INTO productos (nombre,descripcion,precio,stock,categoria,emoji,imagen) VALUES (?,?,?,?,?,?,?)",
        (body.nombre, body.descripcion, body.precio, body.stock, body.categoria, body.emoji, body.imagen),
    )
    conn.commit()
    nuevo = dict(conn.execute("SELECT * FROM productos WHERE id=?", (cur.lastrowid,)).fetchone())
    conn.close()
    return nuevo

@router.put("/{producto_id}")
def actualizar_producto(producto_id: int, body: ProductoUpdate, user: dict = Depends(solo_admin)):
    conn = get_conn()
    existe = conn.execute("SELECT id FROM productos WHERE id=?", (producto_id,)).fetchone()
    if not existe:
        conn.close()
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    campos = {k: v for k, v in body.model_dump().items() if v is not None}
    if campos:
        sets = ", ".join(f"{k}=?" for k in campos)
        conn.execute(f"UPDATE productos SET {sets} WHERE id=?", (*campos.values(), producto_id))
        conn.commit()
    updated = dict(conn.execute("SELECT * FROM productos WHERE id=?", (producto_id,)).fetchone())
    conn.close()
    return updated

@router.delete("/{producto_id}")
def eliminar_producto(producto_id: int, user: dict = Depends(solo_admin)):
    conn = get_conn()
    conn.execute("UPDATE productos SET activo=0 WHERE id=?", (producto_id,))
    conn.commit()
    conn.close()
    return {"ok": True}
