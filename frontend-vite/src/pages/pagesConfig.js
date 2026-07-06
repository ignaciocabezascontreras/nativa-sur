// Auto-discovery de páginas via pageMetadata (patrón Vanellix)
// Cada página exporta pageMetadata y queda registrada aquí automáticamente.
// No necesitas agregar nada manualmente — solo exporta pageMetadata en tu .jsx.
const modules = import.meta.glob('./**/*.jsx', { eager: true })

const pages = Object.values(modules)
  .filter(m => m.pageMetadata)
  .map(m => ({ component: m.default, ...m.pageMetadata }))
  .sort((a, b) => (a.order || 99) - (b.order || 99))

export default pages
