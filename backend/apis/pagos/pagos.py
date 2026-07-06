import os, hashlib, hmac, time, httpx
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional
from db.database import get_conn

router = APIRouter(prefix="/pagos", tags=["pagos"])

FLOW_API_KEY    = os.getenv("FLOW_API_KEY", "")
FLOW_SECRET_KEY = os.getenv("FLOW_SECRET_KEY", "")
FLOW_URL        = os.getenv("FLOW_URL", "https://www.flow.cl/api")
PUBLIC_URL      = os.getenv("PUBLIC_URL", "http://localhost:8000")
FRONTEND_URL    = os.getenv("FRONTEND_URL", "http://localhost:3000")


def _sign(params: dict) -> str:
    keys = sorted(params.keys())
    msg  = "".join(f"{k}{params[k]}" for k in keys)
    return hmac.new(FLOW_SECRET_KEY.encode(), msg.encode(), hashlib.sha256).hexdigest()


def _post_flow(endpoint: str, params: dict) -> dict:
    params["apiKey"] = FLOW_API_KEY
    params["s"]      = _sign(params)
    resp = httpx.post(f"{FLOW_URL}/{endpoint}", data=params, timeout=15)
    resp.raise_for_status()
    return resp.json()


def _get_flow(endpoint: str, params: dict) -> dict:
    params["apiKey"] = FLOW_API_KEY
    params["s"]      = _sign(params)
    resp = httpx.get(f"{FLOW_URL}/{endpoint}", params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()


# ── Modelos ──────────────────────────────────────────────────────────────────

class ItemPago(BaseModel):
    nombre:   str
    precio:   int
    cantidad: int

class IniciarPagoBody(BaseModel):
    pedido_id: int
    email:     str
    items:     List[ItemPago]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/iniciar")
def iniciar_pago(body: IniciarPagoBody):
    """Crea una orden de pago en Flow y devuelve la URL de redirección."""
    if not FLOW_API_KEY or not FLOW_SECRET_KEY:
        raise HTTPException(
            status_code=503,
            detail="Flow no configurado. Agrega FLOW_API_KEY y FLOW_SECRET_KEY en .env"
        )

    total       = sum(i.precio * i.cantidad for i in body.items)
    commerce_id = f"NS-{body.pedido_id}-{int(time.time())}"

    params = {
        "commerceOrder": commerce_id,
        "subject":       "Pedido Nativa Sur",
        "currency":      "CLP",
        "amount":        str(total),
        "email":         body.email,
        "urlConfirmation": f"{PUBLIC_URL}/api/pagos/confirmar",
        "urlReturn":       f"{FRONTEND_URL}/#pago-ok",
    }

    try:
        data = _post_flow("payment/create", params)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Error al contactar Flow: {e}")

    # Guardar token Flow en el pedido
    conn = get_conn()
    conn.execute(
        "UPDATE pedidos SET flow_token=?, flow_commerce_id=? WHERE id=?",
        (data.get("token"), commerce_id, body.pedido_id),
    )
    conn.commit()
    conn.close()

    url_pago = f"{data['url']}?token={data['token']}"
    return {"url": url_pago, "token": data.get("token"), "commerce_id": commerce_id}


@router.post("/confirmar")
async def confirmar_pago(request: Request):
    """Flow llama a este endpoint cuando el pago es procesado (POST con token en el body)."""
    form  = await request.form()
    token = form.get("token") or request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token ausente")

    try:
        data = _get_flow("payment/getStatus", {"token": token})
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Error al verificar pago: {e}")

    # status 2 = pagado en Flow
    estado_nuevo = "pagado" if data.get("status") == 2 else "pendiente"

    conn = get_conn()
    conn.execute(
        "UPDATE pedidos SET estado=?, flow_status=? WHERE flow_token=?",
        (estado_nuevo, data.get("status"), token),
    )
    conn.commit()
    conn.close()

    return {"ok": True, "flow_status": data.get("status"), "estado": estado_nuevo}


@router.get("/estado/{pedido_id}")
def estado_pago(pedido_id: int):
    """Consulta el estado de pago de un pedido directamente en Flow."""
    conn   = get_conn()
    pedido = conn.execute("SELECT flow_token FROM pedidos WHERE id=?", (pedido_id,)).fetchone()
    conn.close()

    if not pedido or not pedido["flow_token"]:
        raise HTTPException(status_code=404, detail="Pedido sin token Flow")

    try:
        data = _get_flow("payment/getStatus", {"token": pedido["flow_token"]})
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Error Flow: {e}")

    return data
