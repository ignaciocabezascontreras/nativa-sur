from fastapi import APIRouter, Depends, Query, HTTPException
from utils.auth.session import verify_session
from utils.web3mongo import db
from bson import ObjectId
from bson.errors import InvalidId

router = APIRouter()
COL_REVISION   = db.revisiones_narrativas
COL_REFERENCIAS = db.referencias_vancouver


# ── Helpers ────────────────────────────────────────────────────────────────

def _oid(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=400, detail="ID inválido")

def _serial(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ── 1. Listar revisiones ────────────────────────────────────────────────────

@router.get("/revision/lista")
async def get_revisiones(user: dict = Depends(verify_session)):
    result = list(COL_REVISION.find({}, {"titulo": 1, "estado": 1, "fecha": 1}))
    return {"count": len(result), "revisiones": [_serial(r) for r in result]}


# ── 2. Obtener revisión completa ────────────────────────────────────────────

@router.get("/revision/{revision_id}")
async def get_revision(revision_id: str, user: dict = Depends(verify_session)):
    doc = COL_REVISION.find_one({"_id": _oid(revision_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Revisión no encontrada")
    return {"revision": _serial(doc)}


# ── 3. Crear revisión nueva ─────────────────────────────────────────────────

@router.post("/revision/nueva")
async def crear_revision(payload: dict, user: dict = Depends(verify_session)):
    doc = {
        "titulo":        payload.get("titulo", ""),
        "titulo_en":     payload.get("titulo_en", ""),
        "objetivo":      payload.get("objetivo", ""),
        "metodos":       payload.get("metodos", ""),
        "resultados":    payload.get("resultados", ""),
        "conclusiones":  payload.get("conclusiones", ""),
        "keywords":      payload.get("keywords", []),
        "estado":        "en_progreso",
        "seccion_activa": "objetivo",
        "fecha":         payload.get("fecha", ""),
    }
    inserted = COL_REVISION.insert_one(doc)
    return {"id": str(inserted.inserted_id), "mensaje": "Revisión creada"}


# ── 4. Actualizar sección ───────────────────────────────────────────────────

SECCIONES_VALIDAS = {"objetivo", "metodos", "resultados", "conclusiones", "titulo", "titulo_en"}

@router.put("/revision/{revision_id}/seccion")
async def actualizar_seccion(
    revision_id: str,
    seccion:   str = Query(...),
    contenido: str = Query(...),
    user: dict = Depends(verify_session),
):
    if seccion not in SECCIONES_VALIDAS:
        raise HTTPException(status_code=400, detail=f"Sección inválida: {seccion}")
    resultado = COL_REVISION.update_one(
        {"_id": _oid(revision_id)},
        {"$set": {seccion: contenido}},
    )
    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Revisión no encontrada")
    return {"mensaje": f"Sección '{seccion}' actualizada"}


# ── 5. Listar referencias Vancouver de una revisión ─────────────────────────

@router.get("/revision/{revision_id}/referencias")
async def get_referencias(revision_id: str, user: dict = Depends(verify_session)):
    refs = list(COL_REFERENCIAS.find(
        {"revision_id": revision_id},
        {"_id": 1, "numero": 1, "autores": 1, "titulo": 1, "revista": 1,
         "anio": 1, "volumen": 1, "numero_revista": 1, "paginas": 1, "doi": 1, "cita_vancouver": 1}
    ).sort("numero", 1))
    return {"count": len(refs), "referencias": [_serial(r) for r in refs]}


# ── 6. Agregar referencia en formato Vancouver ──────────────────────────────

@router.post("/revision/{revision_id}/referencias")
async def agregar_referencia(
    revision_id: str,
    payload: dict,
    user: dict = Depends(verify_session),
):
    # Verificar que la revisión existe
    if not COL_REVISION.find_one({"_id": _oid(revision_id)}):
        raise HTTPException(status_code=404, detail="Revisión no encontrada")

    # Calcular número correlativo
    ultimo = COL_REFERENCIAS.find_one(
        {"revision_id": revision_id},
        sort=[("numero", -1)]
    )
    numero = (ultimo["numero"] + 1) if ultimo else 1

    # Construir cita Vancouver automática
    autores   = payload.get("autores", "")     # "Apellido A, Apellido B"
    titulo    = payload.get("titulo", "")
    revista   = payload.get("revista", "")     # abreviatura
    anio      = payload.get("anio", "")
    volumen   = payload.get("volumen", "")
    num_rev   = payload.get("numero_revista", "")
    paginas   = payload.get("paginas", "")     # "123-130"
    doi       = payload.get("doi", "")

    cita = f"{autores}. {titulo}. {revista}. {anio};{volumen}({num_rev}):{paginas}."
    if doi:
        cita += f" doi:{doi}"

    ref = {
        "revision_id":     revision_id,
        "numero":          numero,
        "autores":         autores,
        "titulo":          titulo,
        "revista":         revista,
        "anio":            anio,
        "volumen":         volumen,
        "numero_revista":  num_rev,
        "paginas":         paginas,
        "doi":             doi,
        "cita_vancouver":  cita,
    }
    inserted = COL_REFERENCIAS.insert_one(ref)
    return {"id": str(inserted.inserted_id), "numero": numero, "cita_vancouver": cita}


# ── 7. Eliminar referencia ──────────────────────────────────────────────────

@router.delete("/revision/{revision_id}/referencias/{ref_id}")
async def eliminar_referencia(
    revision_id: str,
    ref_id: str,
    user: dict = Depends(verify_session),
):
    resultado = COL_REFERENCIAS.delete_one({"_id": _oid(ref_id), "revision_id": revision_id})
    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Referencia no encontrada")
    # Re-numerar
    refs = list(COL_REFERENCIAS.find({"revision_id": revision_id}).sort("numero", 1))
    for i, r in enumerate(refs, start=1):
        COL_REFERENCIAS.update_one({"_id": r["_id"]}, {"$set": {"numero": i}})
    return {"mensaje": "Referencia eliminada y lista renumerada"}