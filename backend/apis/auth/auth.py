from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from db.database import get_conn
from utils.auth.session import create_token, verify_session, hash_pw, verify_pw

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginBody(BaseModel):
    email: str
    password: str

class RegistroBody(BaseModel):
    nombre: str
    email: str
    password: str

@router.post("/login")
def login(body: LoginBody):
    conn = get_conn()
    user = conn.execute("SELECT * FROM usuarios WHERE email = ?", (body.email,)).fetchone()
    conn.close()
    if not user or not verify_pw(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = create_token({"id": user["id"], "nombre": user["nombre"],
                          "email": user["email"], "rol": user["rol"]})
    return {"token": token, "rol": user["rol"], "nombre": user["nombre"]}

@router.post("/registro", status_code=201)
def registro(body: RegistroBody):
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres")
    conn = get_conn()
    existe = conn.execute("SELECT id FROM usuarios WHERE email = ?", (body.email,)).fetchone()
    if existe:
        conn.close()
        raise HTTPException(status_code=409, detail="Email ya registrado")
    hashed = hash_pw(body.password)
    cur = conn.execute(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,'cliente')",
        (body.nombre, body.email, hashed),
    )
    conn.commit()
    uid = cur.lastrowid
    conn.close()
    token = create_token({"id": uid, "nombre": body.nombre, "email": body.email, "rol": "cliente"})
    return {"token": token, "rol": "cliente", "nombre": body.nombre}

@router.get("/me")
def me(user: dict = Depends(verify_session)):
    conn = get_conn()
    row = conn.execute(
        "SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?", (user["id"],)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return dict(row)
