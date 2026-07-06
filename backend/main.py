import importlib, pkgutil, pathlib, sys, os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nativa Sur API", version="1.0.0")

_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auto-discovery de routers (patrón Vanellix) ──
apis_path = pathlib.Path(__file__).parent / "apis"
sys.path.insert(0, str(pathlib.Path(__file__).parent))

for pkg in pkgutil.walk_packages([str(apis_path)], prefix="apis."):
    if pkg.name.count(".") == 2:
        mod = importlib.import_module(pkg.name)
        if hasattr(mod, "router"):
            app.include_router(mod.router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok", "marca": "Nativa Sur"}
