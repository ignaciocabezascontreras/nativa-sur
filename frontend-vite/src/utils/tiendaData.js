export const PRODUCTOS = [
  { id:1,  nombre:'Almendras Premium',   fruto:'almendra', precio:4990, categoria:'nueces',   foto:'/fotos/Imagen Almendras.png',               desc:'Almendras naturales sin sal, importadas de California. 500g.' },
  { id:2,  nombre:'Nueces de Castilla',  fruto:'nuez',     precio:5990, categoria:'nueces',   foto:'/fotos/Imagen de nueces.png',               desc:'Nueces enteras de primera selección. Excelentes para repostería. 500g.' },
  { id:3,  nombre:'Marañón / Cajú',      fruto:'maranon',  precio:6490, categoria:'nueces',   foto:'/fotos/Castaña de Cajú.png',                desc:'Marañón tostado y ligeramente salado. Snack irresistible. 400g.' },
  { id:4,  nombre:'Pistachos Naturales', fruto:'pistacho', precio:7990, categoria:'nueces',   foto:'/fotos/Imagen pistacho.jpg',                desc:'Pistachos con cáscara, naturales sin aditivos. 400g.' },
  { id:5,  nombre:'Maní Natural',        fruto:'mani',     precio:1990, categoria:'nueces',   foto:'/fotos/Maní.png',                           desc:'Maní tostado sin sal, fuente de proteínas y grasas saludables. 500g.' },
  { id:6,  nombre:'Semillas de Chía',    fruto:'chia',     precio:2990, categoria:'semillas', foto:'/fotos/Chía.png',                           desc:'Semillas de chía orgánicas, ricas en omega-3 y fibra. 400g.' },
  { id:7,  nombre:'Semillas de Girasol', fruto:'girasol',  precio:1990, categoria:'semillas', foto:'/fotos/Imagen Semillas de maravilla.png',   desc:'Pipas de girasol peladas, naturales y nutritivas. 400g.' },
  { id:8,  nombre:'Semillas de Zapallo', fruto:'zapallo',  precio:3490, categoria:'semillas', foto:'/fotos/Imagen Semillas de Zapallo.png',     desc:'Semillas de zapallo (pepitas), fuente de zinc y proteínas. 400g.' },
  { id:9,  nombre:'Mix Energético',      fruto:'mix',      precio:5490, categoria:'mix',      foto:'/fotos/Mix Energético.png',                 desc:'Mezcla de almendras, nueces, maní y pasas. Ideal para deporte. 500g.' },
  { id:10, nombre:'Mix Deluxe',          fruto:'mix',      precio:7490, categoria:'mix',      foto:'/fotos/Mix Deluxe.png',                     desc:'Almendras, macadamia, pistachos y arándanos deshidratados. 500g.' },
  { id:11, nombre:'Arándanos Deshidrat.',fruto:'arandano', precio:4490, categoria:'frutas',   foto:'/fotos/Cranberries.png',                    desc:'Arándanos deshidratados sin azúcar añadida. 300g.' },
  { id:12, nombre:'Coco Laminado',       fruto:'coco',     precio:3990, categoria:'frutas',   foto:'/fotos/Coco Laminado.png',                  desc:'Coco laminado natural, crujiente y sin azúcar añadida. 300g.' },
  { id:13, nombre:'Pasas Rubias',        fruto:'pasa',     precio:2490, categoria:'frutas',   foto:'/fotos/Pasas Rubias.png',                   desc:'Pasas rubias importadas, jugosas y naturalmente dulces. 500g.' },
  { id:14, nombre:'Pasas Morenas',       fruto:'pasa',     precio:2490, categoria:'frutas',   foto:'/fotos/Pasas Morenas.png',                  desc:'Pasas morenas naturales, intensas en sabor y ricas en hierro. 500g.' },
  { id:15, nombre:'Dátiles Medjool',     fruto:'datil',    precio:8990, categoria:'frutas',   foto:'/fotos/Dátiles.png',                        desc:'Dátiles Medjool premium, naturalmente dulces y energizantes. 400g.' },
];

export const CATEGORIAS = [
  { id:'todos',    label:{ ES:'Todos',       EN:'All',       PT:'Todos'    } },
  { id:'nueces',   label:{ ES:'Nueces',      EN:'Nuts',      PT:'Nozes'    } },
  { id:'semillas', label:{ ES:'Semillas',    EN:'Seeds',     PT:'Sementes' } },
  { id:'mix',      label:{ ES:'Mix',         EN:'Mix',       PT:'Mix'      } },
  { id:'frutas',   label:{ ES:'Frutas secas',EN:'Dried Fruit',PT:'Frutas'  } },
];

export const TRADUCCIONES = {
  ES: {
    navProductos:'Productos', navGaleria:'Galería', navNosotros:'Nosotros', navContacto:'Contacto',
    heroBadge:'Importado directamente · Sin intermediarios',
    heroTitulo1:'Frutos Secos', heroTitulo2:'Naturaleza Pura',
    heroSub:'Calidad premium · Chile',
    heroDesc:'Seleccionamos los mejores frutos secos del mundo y los traemos directamente a ti.',
    heroCta1:'Ver productos', heroCta2:'Contáctanos',
    catalogoLabel:'Catálogo', catalogoTitulo:'Nuestros Productos', catalogoSub:'Calidad premium directo a tu mesa',
    agregar:'+ Agregar', unidad:'/ unidad',
    carrito:'Mi pedido', carritoVacio:'Tu pedido está vacío',
    total:'Total', pedirWa:'Pedir por WhatsApp', checkout:'Ir al pago',
    tbMenu:'Menú', tbDespacho:'Despacho', tbTema:'Tema', tbCuenta:'Mi cuenta',
    footerTxt:'Frutos Secos · Naturaleza Pura · Hecho con ❤️ en Chile',
  },
  EN: {
    navProductos:'Products', navGaleria:'Gallery', navNosotros:'About', navContacto:'Contact',
    heroBadge:'Directly imported · No middlemen',
    heroTitulo1:'Dried Fruits', heroTitulo2:'Pure Nature',
    heroSub:'Premium quality · Chile',
    heroDesc:'We select the best dried fruits in the world and bring them directly to you.',
    heroCta1:'View products', heroCta2:'Contact us',
    catalogoLabel:'Catalog', catalogoTitulo:'Our Products', catalogoSub:'Premium quality straight to your table',
    agregar:'+ Add', unidad:'/ unit',
    carrito:'My order', carritoVacio:'Your order is empty',
    total:'Total', pedirWa:'Order via WhatsApp', checkout:'Checkout',
    tbMenu:'Menu', tbDespacho:'Delivery', tbTema:'Theme', tbCuenta:'Account',
    footerTxt:'Dried Fruits · Pure Nature · Made with ❤️ in Chile',
  },
  PT: {
    navProductos:'Produtos', navGaleria:'Galeria', navNosotros:'Sobre', navContacto:'Contato',
    heroBadge:'Importado diretamente · Sem intermediários',
    heroTitulo1:'Frutas Secas', heroTitulo2:'Natureza Pura',
    heroSub:'Qualidade premium · Chile',
    heroDesc:'Selecionamos as melhores frutas secas do mundo e trazemos diretamente para você.',
    heroCta1:'Ver produtos', heroCta2:'Fale conosco',
    catalogoLabel:'Catálogo', catalogoTitulo:'Nossos Produtos', catalogoSub:'Qualidade premium direto à sua mesa',
    agregar:'+ Adicionar', unidad:'/ unidade',
    carrito:'Meu pedido', carritoVacio:'Seu pedido está vazio',
    total:'Total', pedirWa:'Pedir pelo WhatsApp', checkout:'Finalizar',
    tbMenu:'Menu', tbDespacho:'Entrega', tbTema:'Tema', tbCuenta:'Conta',
    footerTxt:'Frutas Secas · Natureza Pura · Feito com ❤️ no Chile',
  },
};

export const WA_NUMBER = '56984476659';

export const LOGO_SRC = '/fotos/ChatGPT Image 2 jul 2026, 00_40_55.png';
