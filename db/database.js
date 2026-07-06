const Database = require('better-sqlite3');
const bcrypt   = require('bcryptjs');
const path     = require('path');

const db = new Database(path.join(__dirname, 'nativa_sur.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── TABLAS ──
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    rol        TEXT    NOT NULL DEFAULT 'cliente',
    creado_en  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS productos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    descripcion TEXT,
    precio      INTEGER NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    categoria   TEXT    NOT NULL DEFAULT 'general',
    emoji       TEXT    DEFAULT '🥜',
    imagen      TEXT,
    activo      INTEGER NOT NULL DEFAULT 1,
    creado_en   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id   INTEGER REFERENCES usuarios(id),
    nombre       TEXT NOT NULL,
    email        TEXT NOT NULL,
    telefono     TEXT,
    direccion    TEXT,
    ciudad       TEXT,
    region       TEXT,
    total        INTEGER NOT NULL,
    estado       TEXT NOT NULL DEFAULT 'pendiente',
    metodo_pago  TEXT NOT NULL DEFAULT 'webpay',
    flow_token   TEXT,
    creado_en    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pedido_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id   INTEGER NOT NULL REFERENCES pedidos(id),
    producto_id INTEGER REFERENCES productos(id),
    nombre      TEXT    NOT NULL,
    precio      INTEGER NOT NULL,
    cantidad    INTEGER NOT NULL
  );
`);

// ── SEED: admin por defecto ──
const adminExiste = db.prepare("SELECT id FROM usuarios WHERE email = ?").get('ignaciocabezascontreras@gmail.com');
if (!adminExiste) {
  const hash = bcrypt.hashSync('NativaSur2025!', 10);
  db.prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'admin')")
    .run('Ignacio Cabezas', 'ignaciocabezascontreras@gmail.com', hash);
  console.log('✅ Admin creado: ignaciocabezascontreras@gmail.com / NativaSur2025!');
}

// ── SEED: productos por defecto ──
const productosExisten = db.prepare("SELECT COUNT(*) as c FROM productos").get();
if (productosExisten.c === 0) {
  const ins = db.prepare("INSERT INTO productos (nombre, descripcion, precio, stock, categoria, emoji) VALUES (?,?,?,?,?,?)");
  const prods = [
    ['Almendras Premium',    'Almendras naturales sin sal, importadas de California. 500g.',              4990, 50, 'nueces',   '🥜'],
    ['Nueces de Castilla',   'Nueces enteras de primera selección. Excelentes para repostería. 500g.',   5990, 40, 'nueces',   '🌰'],
    ['Marañón Tostado',      'Marañón tostado y ligeramente salado. Snack irresistible. 400g.',          6490, 30, 'nueces',   '🥜'],
    ['Pistachos Naturales',  'Pistachos con cáscara, naturales sin aditivos. 400g.',                     7990, 25, 'nueces',   '💚'],
    ['Semillas de Chía',     'Semillas de chía orgánicas, ricas en omega-3 y fibra. 500g.',              2990, 60, 'semillas', '🌱'],
    ['Semillas de Girasol',  'Pipas de girasol peladas, naturales y nutritivas. 500g.',                  1990, 80, 'semillas', '🌻'],
    ['Semillas de Zapallo',  'Semillas de zapallo (pepitas), fuente de zinc y proteínas. 400g.',         3490, 45, 'semillas', '🎃'],
    ['Mix Energético',       'Mezcla de almendras, nueces, maní y pasas. Ideal para deporte. 500g.',    5490, 35, 'mix',      '⚡'],
    ['Mix Deluxe',           'Almendras, macadamia, pistachos y arándanos deshidratados. 400g.',         7490, 20, 'mix',      '✨'],
    ['Arándanos Deshidrat.', 'Arándanos deshidratados sin azúcar añadida. Antioxidantes naturales. 300g.', 4490, 40, 'frutas', '🫐'],
    ['Mango Deshidratado',   'Mango deshidratado natural, dulce y aromático. 300g.',                     3990, 35, 'frutas',  '🥭'],
    ['Pasas Sultaninas',     'Pasas rubias importadas, jugosas y naturalmente dulces. 500g.',             2490, 70, 'frutas',  '🍇'],
  ];
  prods.forEach(p => ins.run(...p));
  console.log('✅ Productos de ejemplo creados');
}

module.exports = db;
