const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'nativasur_secret_2025';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' });

  const token = jwt.sign(
    { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, rol: user.rol, nombre: user.nombre });
});

// POST /api/auth/registro (clientes)
router.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });
  if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existe) return res.status(409).json({ error: 'Este email ya está registrado' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'cliente')").run(nombre, email, hash);

  const token = jwt.sign({ id: info.lastInsertRowid, nombre, email, rol: 'cliente' }, SECRET, { expiresIn: '8h' });
  res.status(201).json({ token, rol: 'cliente', nombre });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?').get(req.user.id);
  res.json(user);
});

module.exports = router;
