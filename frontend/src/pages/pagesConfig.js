// Auto-discovery de páginas via pageMetadata (patrón Vanellix)
const modules = import.meta.glob('./**/*.jsx', { eager: true })

const pages = Object.values(modules)
  .filter(m => m.pageMetadata)
  .map(m => ({ component: m.default, ...m.pageMetadata }))
  .sort((a, b) => (a.order || 99) - (b.order || 99))

export default pages
