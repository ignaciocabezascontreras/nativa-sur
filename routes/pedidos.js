const express = require('express');
const db      = require('../db/database');
const { authMiddleware, soloAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/pedidos — crear pedido (público o autenticado)
router.post('/', (req, res) => {
  const { nombre, email, telefono, direccion, ciudad, region, items, metodo_pago } = req.body;

  if (!nombre || !email || !items || items.length === 0)
    return res.status(400).json({ error: 'Faltan datos del pedido' });

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const cliente_id = req.user?.id || null;

  const pedido = db.prepare(`
    INSERT INTO pedidos (cliente_id, nombre, email, telefono, direccion, ciudad, region, total, metodo_pago)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(cliente_id, nombre, email, telefono || '', direccion || '', ciudad || '', region || '', total, metodo_pago || 'webpay');

  const insItem = db.prepare(
    'INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio, cantidad) VALUES (?,?,?,?,?)'
  );
  items.forEach(i => insItem.run(pedido.lastInsertRowid, i.id || null, i.nombre, i.precio, i.cantidad));

  res.status(201).json({
    id:    pedido.lastInsertRowid,
    total,
    estado: 'pendiente',
    mensaje: 'Pedido creado correctamente'
  });
});

// GET /api/pedidos/mios — pedidos del cliente autenticado
router.get('/mios', authMiddleware, (req, res) => {
  const pedidos = db.prepare('SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY creado_en DESC').all(req.user.id);
  const getItems = db.prepare('SELECT * FROM pedido_items WHERE pedido_id = ?');
  res.json(pedidos.map(p => ({ ...p, items: getItems.all(p.id) })));
});

// GET /api/pedidos — todos (solo admin)
router.get('/', authMiddleware, soloAdmin, (req, res) => {
  const { estado } = req.query;
  const sql = estado
    ? 'SELECT * FROM pedidos WHERE estado = ? ORDER BY creado_en DESC'
    : 'SELECT * FROM pedidos ORDER BY creado_en DESC';
  const pedidos = estado ? db.prepare(sql).all(estado) : db.prepare(sql).all();
  const getItems = db.prepare('SELECT * FROM pedido_items WHERE pedido_id = ?');
  res.json(pedidos.map(p => ({ ...p, items: getItems.all(p.id) })));
});

// GET /api/pedidos/:id — detalle (admin o dueño)
router.get('/:id', authMiddleware, (req, res) => {
  const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id);
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
  if (req.user.rol !== 'admin' && pedido.cliente_id !== req.user.id)
    return res.status(403).json({ error: 'Sin acceso a este pedido' });

  const items = db.prepare('SELECT * FROM pedido_items WHERE pedido_id = ?').all(pedido.id);
  res.json({ ...pedido, items });
});

// PATCH /api/pedidos/:id/estado — cambiar estado (solo admin)
router.patch('/:id/estado', authMiddleware, soloAdmin, (req, res) => {
  const { estado } = req.body;
  const estados = ['pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado'];
  if (!estados.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });

  db.prepare('UPDATE pedidos SET estado = ? WHERE id = ?').run(estado, req.params.id);
  res.json({ ok: true, estado });
});

module.exports = router;
