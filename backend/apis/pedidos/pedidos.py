from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from db.database import get_conn
from utils.auth.session import verify_session, solo_admin

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

ESTADOS_VALIDOS = ["pendiente", "pagado", "preparando", "enviado", "entregado", "cancelado"]

class ItemBody(BaseModel):
    id:       Optional[int] = None
    nombre:   str
    precio:   int
    cantidad: int

class PedidoBody(BaseModel):
    nombre:      str
    email:       str
    telefono:    Optional[str] = ""
    direccion:   Optional[str] = ""
    ciudad:      Optional[str] = ""
    region:      Optional[str] = ""
    items:       List[ItemBody]
    metodo_pago: Optional[str] = "webpay"

class EstadoBody(BaseModel):
    estado: str

@router.post("", status_code=201)
def crear_pedido(body: PedidoBody):
    if not body.items:
        raise HTTPException(status_code=400, detail="El pedido debe tener al menos un producto")
    total = sum(i.precio * i.cantidad for i in body.items)
    conn  = get_conn()
    cur   = conn.execute(
        "INSERT INTO pedidos (nombre,email,telefono,direccion,ciudad,region,total,metodo_pago) VALUES (?,?,?,?,?,?,?,?)",
        (body.nombre, body.email, body.telefono, body.direccion, body.ciudad, body.region, total, body.metodo_pago),
    )
    pid = cur.lastrowid
    conn.executemany(
        "INSERT INTO pedido_items (pedido_id,producto_id,nombre,precio,cantidad) VALUES (?,?,?,?,?)",
        [(pid, i.id, i.nombre, i.precio, i.cantidad) for i in body.items],
    )
    conn.commit()
    conn.close()
    return {"id": pid, "total": total, "estado": "pendiente", "mensaje": "Pedido creado correctamente"}

@router.get("")
def listar_pedidos(estado: Optional[str] = Query(None), user: dict = Depends(solo_admin)):
    conn = get_conn()
    if estado:
        pedidos = conn.execute("SELECT * FROM pedidos WHERE estado=? ORDER BY creado_en DESC", (estado,)).fetchall()
    else:
        pedidos = conn.execute("SELECT * FROM pedidos ORDER BY creado_en DESC").fetchall()
    get_items = lambda pid: [dict(r) for r in conn.execute("SELECT * FROM pedido_items WHERE pedido_id=?", (pid,)).fetchall()]
    result = [{ **dict(p), "items": get_items(p["id"]) } for p in pedidos]
    conn.close()
    return result

@router.get("/mios")
def mis_pedidos(user: dict = Depends(verify_session)):
    conn    = get_conn()
    pedidos = conn.execute("SELECT * FROM pedidos WHERE cliente_id=? ORDER BY creado_en DESC", (user["id"],)).fetchall()
    get_items = lambda pid: [dict(r) for r in conn.execute("SELECT * FROM pedido_items WHERE pedido_id=?", (pid,)).fetchall()]
    result = [{ **dict(p), "items": get_items(p["id"]) } for p in pedidos]
    conn.close()
    return result

@router.get("/{pedido_id}")
def obtener_pedido(pedido_id: int, user: dict = Depends(verify_session)):
    conn   = get_conn()
    pedido = conn.execute("SELECT * FROM pedidos WHERE id=?", (pedido_id,)).fetchone()
    if not pedido:
        conn.close()
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    if user["rol"] != "admin" and pedido["cliente_id"] != user["id"]:
        conn.close()
        raise HTTPException(status_code=403, detail="Sin acceso a este pedido")
    items  = [dict(r) for r in conn.execute("SELECT * FROM pedido_items WHERE pedido_id=?", (pedido_id,)).fetchall()]
    conn.close()
    return {**dict(pedido), "items": items}

@router.patch("/{pedido_id}/estado")
def cambiar_estado(pedido_id: int, body: EstadoBody, user: dict = Depends(solo_admin)):
    if body.estado not in ESTADOS_VALIDOS:
        raise HTTPException(status_code=400, detail=f"Estado inválido. Válidos: {ESTADOS_VALIDOS}")
    conn = get_conn()
    conn.execute("UPDATE pedidos SET estado=? WHERE id=?", (body.estado, pedido_id))
    conn.commit()
    conn.close()
    return {"ok": True, "estado": body.estado}
