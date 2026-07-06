const express = require('express');
const db      = require('../db/database');
const { authMiddleware, soloAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/productos — público
router.get('/', (req, res) => {
  const { categoria } = req.query;
  const sql = categoria
    ? 'SELECT * FROM productos WHERE activo = 1 AND categoria = ? ORDER BY nombre'
    : 'SELECT * FROM productos WHERE activo = 1 ORDER BY nombre';
  const rows = categoria
    ? db.prepare(sql).all(categoria)
    : db.prepare(sql).all();
  res.json(rows);
});

// GET /api/productos/:id — público
router.get('/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM productos WHERE id = ? AND activo = 1').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(p);
});

// POST /api/productos — solo admin
router.post('/', authMiddleware, soloAdmin, (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, emoji, imagen } = req.body;
  if (!nombre || !precio) return res.status(400).json({ error: 'Nombre y precio son requeridos' });

  const info = db.prepare(
    'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, emoji, imagen) VALUES (?,?,?,?,?,?,?)'
  ).run(nombre, descripcion || '', precio, stock || 0, categoria || 'general', emoji || '🥜', imagen || null);

  const nuevo = db.prepare('SELECT * FROM productos WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(nuevo);
});

// PUT /api/productos/:id — solo admin
router.put('/:id', authMiddleware, soloAdmin, (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, emoji, imagen, activo } = req.body;
  const existe = db.prepare('SELECT id FROM productos WHERE id = ?').get(req.params.id);
  if (!existe) return res.status(404).json({ error: 'Producto no encontrado' });

  db.prepare(`
    UPDATE productos SET
      nombre      = COALESCE(?, nombre),
      descripcion = COALESCE(?, descripcion),
      precio      = COALESCE(?, precio),
      stock       = COALESCE(?, stock),
      categoria   = COALESCE(?, categoria),
      emoji       = COALESCE(?, emoji),
      imagen      = COALESCE(?, imagen),
      activo      = COALESCE(?, activo)
    WHERE id = ?
  `).run(nombre, descripcion, precio, stock, categoria, emoji, imagen, activo, req.params.id);

  res.json(db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id));
});

// DELETE /api/productos/:id — solo admin (soft delete)
router.delete('/:id', authMiddleware, soloAdmin, (req, res) => {
  db.prepare('UPDATE productos SET activo = 0 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/productos/admin/todos — solo admin (incluye inactivos)
router.get('/admin/todos', authMiddleware, soloAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM productos ORDER BY activo DESC, nombre').all());
});

module.exports = router;
