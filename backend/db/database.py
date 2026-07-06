import sqlite3, os, hashlib, binascii, pathlib

DB_PATH = pathlib.Path(__file__).parent / "nativa_sur.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

def init_db():
    conn = get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre    TEXT NOT NULL,
            email     TEXT NOT NULL UNIQUE,
            password  TEXT NOT NULL,
            rol       TEXT NOT NULL DEFAULT 'cliente',
            creado_en TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS productos (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre      TEXT NOT NULL,
            descripcion TEXT,
            precio      INTEGER NOT NULL,
            stock       INTEGER NOT NULL DEFAULT 0,
            categoria   TEXT NOT NULL DEFAULT 'general',
            emoji       TEXT DEFAULT '🥜',
            imagen      TEXT,
            activo      INTEGER NOT NULL DEFAULT 1,
            creado_en   TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS pedidos (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id  INTEGER REFERENCES usuarios(id),
            nombre      TEXT NOT NULL,
            email       TEXT NOT NULL,
            telefono    TEXT,
            direccion   TEXT,
            ciudad      TEXT,
            region      TEXT,
            total       INTEGER NOT NULL,
            estado      TEXT NOT NULL DEFAULT 'pendiente',
            metodo_pago        TEXT NOT NULL DEFAULT 'webpay',
            flow_token         TEXT,
            flow_commerce_id   TEXT,
            flow_status        INTEGER,
            creado_en          TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS pedido_items (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id   INTEGER NOT NULL REFERENCES pedidos(id),
            producto_id INTEGER REFERENCES productos(id),
            nombre      TEXT NOT NULL,
            precio      INTEGER NOT NULL,
            cantidad    INTEGER NOT NULL
        );
    """)
    _seed(conn)
    conn.commit()
    conn.close()

def _hash_pw(password: str) -> str:
    salt = os.urandom(16)
    dk   = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 260000)
    return salt.hex() + ":" + binascii.hexlify(dk).decode()

def _verify_pw(password: str, stored: str) -> bool:
    salt_hex, dk_hex = stored.split(":")
    salt = bytes.fromhex(salt_hex)
    dk   = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 260000)
    return binascii.hexlify(dk).decode() == dk_hex

def _seed(conn):
    admin_email = os.getenv("ADMIN_EMAIL", "ignaciocabezascontreras@gmail.com")
    admin = conn.execute("SELECT id FROM usuarios WHERE email = ?", (admin_email,)).fetchone()
    if not admin:
        conn.execute(
            "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?)",
            (
                os.getenv("ADMIN_NAME", "Admin"),
                admin_email,
                _hash_pw(os.getenv("ADMIN_PASSWORD", "cambiar_esta_clave")),
                "admin",
            ),
        )

    count = conn.execute("SELECT COUNT(*) FROM productos").fetchone()[0]
    if count == 0:
        prods = [
            ("Almendras Premium",    "Almendras naturales sin sal, California. 500g.",       4990, 50, "nueces",   "🥜"),
            ("Nueces de Castilla",   "Nueces enteras de primera selección. 500g.",           5990, 40, "nueces",   "🌰"),
            ("Marañón Tostado",      "Marañón tostado y ligeramente salado. 400g.",          6490, 30, "nueces",   "🥜"),
            ("Pistachos Naturales",  "Pistachos con cáscara, sin aditivos. 400g.",           7990, 25, "nueces",   "💚"),
            ("Semillas de Chía",     "Chía orgánica, rica en omega-3 y fibra. 500g.",        2990, 60, "semillas", "🌱"),
            ("Semillas de Girasol",  "Pipas de girasol peladas y naturales. 500g.",          1990, 80, "semillas", "🌻"),
            ("Semillas de Zapallo",  "Pepitas de zapallo, fuente de zinc. 400g.",            3490, 45, "semillas", "🎃"),
            ("Mix Energético",       "Almendras, nueces, maní y pasas. 500g.",               5490, 35, "mix",      "⚡"),
            ("Mix Deluxe",           "Almendras, macadamia, pistachos y arándanos. 400g.",   7490, 20, "mix",      "✨"),
            ("Arándanos Deshidrat.", "Arándanos sin azúcar añadida. 300g.",                  4490, 40, "frutas",   "🫐"),
            ("Mango Deshidratado",   "Mango natural deshidratado. 300g.",                    3990, 35, "frutas",   "🥭"),
            ("Pasas Sultaninas",     "Pasas rubias importadas. 500g.",                        2490, 70, "frutas",   "🍇"),
        ]
        conn.executemany(
            "INSERT INTO productos (nombre,descripcion,precio,stock,categoria,emoji) VALUES (?,?,?,?,?,?)",
            prods,
        )
