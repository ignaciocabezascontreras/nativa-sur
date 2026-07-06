import os, hashlib, binascii
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET  = os.getenv("JWT_SECRET", "nativasur_jwt_secret_2025_seguro")
ALG     = "HS256"
EXPIRES = 8  # horas

bearer = HTTPBearer()

def create_token(data: dict) -> str:
    payload = {**data, "exp": datetime.utcnow() + timedelta(hours=EXPIRES)}
    return jwt.encode(payload, SECRET, algorithm=ALG)

def verify_session(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> dict:
    try:
        return jwt.decode(credentials.credentials, SECRET, algorithms=[ALG])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")

def solo_admin(user: dict = Depends(verify_session)) -> dict:
    if user.get("rol") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo administradores")
    return user

def hash_pw(password: str) -> str:
    salt = os.urandom(16)
    dk   = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 260000)
    return salt.hex() + ":" + binascii.hexlify(dk).decode()

def verify_pw(password: str, stored: str) -> bool:
    try:
        salt_hex, dk_hex = stored.split(":")
        salt = bytes.fromhex(salt_hex)
        dk   = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 260000)
        return binascii.hexlify(dk).decode() == dk_hex
    except Exception:
        return False
