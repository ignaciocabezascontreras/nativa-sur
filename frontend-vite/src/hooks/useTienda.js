import { useState, useCallback, useEffect } from 'react';
import { PRODUCTOS, TRADUCCIONES, WA_NUMBER } from '../utils/tiendaData';

export default function useTienda() {
  const [lang, setLangState] = useState('ES');
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('nativa-theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [filtro, setFiltro] = useState('todos');
  const [carrito, setCarrito] = useState({});
  const [carritoOpen, setCarritoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const t = TRADUCCIONES[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('nativa-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = useCallback(() => setDark(d => !d), []);
  const setLang = useCallback((l) => setLangState(l), []);
  const toggleMenu = useCallback(() => setMenuOpen(o => !o), []);
  const toggleCarrito = useCallback(() => setCarritoOpen(o => !o), []);

  const productosFiltrados = filtro === 'todos'
    ? PRODUCTOS
    : PRODUCTOS.filter(p => p.categoria === filtro);

  const agregar = useCallback((id) => {
    setCarrito(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }, []);

  const quitar = useCallback((id) => {
    setCarrito(c => {
      const next = { ...c };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id]--;
      return next;
    });
  }, []);

  const eliminar = useCallback((id) => {
    setCarrito(c => { const next = { ...c }; delete next[id]; return next; });
  }, []);

  const totalItems = Object.values(carrito).reduce((a, b) => a + b, 0);
  const totalPrecio = Object.entries(carrito).reduce((acc, [id, qty]) => {
    const p = PRODUCTOS.find(p => p.id === Number(id));
    return acc + (p ? p.precio * qty : 0);
  }, 0);

  const itemsCarrito = Object.entries(carrito)
    .map(([id, qty]) => ({ ...PRODUCTOS.find(p => p.id === Number(id)), qty }))
    .filter(Boolean);

  const [pagoLoading, setPagoLoading] = useState(false);

  const pedirWhatsApp = useCallback(() => {
    const lineas = itemsCarrito.map(i => `• ${i.nombre} x${i.qty} — $${(i.precio*i.qty).toLocaleString('es-CL')}`).join('\n');
    const msg = `Hola Nativa Sur 🌿, quiero hacer un pedido:\n\n${lineas}\n\n*Total: $${totalPrecio.toLocaleString('es-CL')}*`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [itemsCarrito, totalPrecio]);

  const pagarFlow = useCallback(async () => {
    if (itemsCarrito.length === 0) return;
    setPagoLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/pagos/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: Date.now(),
          email: 'cliente@nativasur.cl',
          items: itemsCarrito.map(i => ({ nombre: i.nombre, precio: i.precio, cantidad: i.qty })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al iniciar el pago. Intenta nuevamente.');
      }
    } catch {
      alert('No se pudo conectar con el servidor de pagos.');
    } finally {
      setPagoLoading(false);
    }
  }, [itemsCarrito]);

  return {
    lang, setLang, dark, toggleTheme, t,
    filtro, setFiltro, productosFiltrados,
    carrito, agregar, quitar, eliminar,
    totalItems, totalPrecio, itemsCarrito,
    carritoOpen, toggleCarrito,
    menuOpen, toggleMenu,
    pedirWhatsApp, pagarFlow, pagoLoading,
  };
}
