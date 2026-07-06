const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Token requerido' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'nativasur_secret_2025');
    next();
  } catch {
    res.status(401).json({ error: 'Token expirado o inválido' });
  }
}

function soloAdmin(req, res, next) {
  if (req.user?.rol !== 'admin') return res.status(403).json({ error: 'Acceso solo para administradores' });
  next();
}

module.exports = { authMiddleware, soloAdmin };
