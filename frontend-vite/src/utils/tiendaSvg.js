const FRUTO_CFG = {
  almendra: { bg:'#c0a878', cols:['#d4b890','#c8a87c','#e0c8a0','#b89870','#dcc0a0'], sh:'alm' },
  nuez:     { bg:'#8a6040', cols:['#a07858','#8a6040','#b48c6a','#785030','#c0946e'], sh:'nz'  },
  maranon:  { bg:'#c09050', cols:['#d4a860','#c09050','#e0bc70','#b08040','#ccaa68'], sh:'mrn' },
  pistacho: { bg:'#b8b080', cols:['#ccc890','#b8b480','#dcd8a0','#a8a470','#d0cc98'], sh:'pst' },
  chia:     { bg:'#504038', cols:['#685040','#504038','#786050','#403028','#604848'], sh:'ch'  },
  girasol:  { bg:'#c0a840', cols:['#d4bc50','#c0a840','#e0cc60','#a89030','#ccb848'], sh:'gs'  },
  zapallo:  { bg:'#708848', cols:['#849c54','#708848','#96ae60','#607838','#7a9850'], sh:'zp'  },
  arandano: { bg:'#483858', cols:['#584868','#483858','#685878','#382848','#584060'], sh:'ar'  },
  pasa:     { bg:'#5a3828', cols:['#6a4838','#5a3828','#7a5848','#4a2818','#704038'], sh:'ps'  },
  mix:      { bg:'#b09060', cols:['#d4b890','#a07858','#ccc890','#d4a860','#b48c6a'], sh:'mx'  },
  mani:     { bg:'#c8a060', cols:['#dcb870','#c8a060','#e8cc80','#b08840','#d4b468'], sh:'alm' },
  datil:    { bg:'#7a4820', cols:['#8a5830','#7a4820','#9a6840','#6a3810','#906040'], sh:'ps'  },
  coco:     { bg:'#e8dfc0', cols:['#f0e8cc','#e0d8b8','#f8f0d8','#d8d0a8','#ece4c4'], sh:'gs'  },
};

function shape(sh, x, y, w, h, col, rot) {
  const g = `rotate(${rot} ${x} ${y})`;
  if (sh==='alm') return `<g transform="${g}"><path d="M${x} ${y-h} C${x+w*.6} ${y-h*.4} ${x+w*.7} ${y+h*.4} ${x} ${y+h} C${x-w*.7} ${y+h*.4} ${x-w*.6} ${y-h*.4} ${x} ${y-h}Z" fill="${col}"/></g>`;
  if (sh==='nz')  return `<g transform="${g}"><ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${col}"/></g>`;
  if (sh==='mrn') return `<g transform="${g}"><path d="M${x-w*.8} ${y+h*.4} C${x-w*.6} ${y-h} ${x+w*.4} ${y-h} ${x+w} ${y} C${x+w} ${y+h*.6} ${x+w*.2} ${y+h} ${x-w*.8} ${y+h*.4}Z" fill="${col}"/></g>`;
  if (sh==='pst') return `<g transform="${g}"><path d="M${x} ${y-h} C${x+w*.8} ${y-h*.5} ${x+w*.8} ${y+h*.5} ${x} ${y+h} C${x-w*.8} ${y+h*.5} ${x-w*.8} ${y-h*.5} ${x} ${y-h}Z" fill="${col}"/></g>`;
  if (sh==='ch')  return `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h*.6}" fill="${col}" transform="${g}"/>`;
  if (sh==='gs')  return `<g transform="${g}"><ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h*.65}" fill="${col}"/></g>`;
  if (sh==='zp')  return `<g transform="${g}"><path d="M${x} ${y-h} C${x+w*.7} ${y-h*.3} ${x+w*.5} ${y+h} ${x} ${y+h} C${x-w*.5} ${y+h} ${x-w*.7} ${y-h*.3} ${x} ${y-h}Z" fill="${col}"/></g>`;
  if (sh==='ar')  return `<g transform="${g}"><circle cx="${x}" cy="${y}" r="${w}" fill="${col}"/></g>`;
  if (sh==='ps')  return `<g transform="${g}"><circle cx="${x}" cy="${y}" r="${w*.9}" fill="${col}"/></g>`;
  const ss = ['alm','nz','pst','mrn'];
  return shape(ss[(Math.abs(x+y|0))%ss.length], x, y, w, h, col, rot);
}

export function frutosTextura(fruto, id) {
  const W = 200, H = 90;
  const c = FRUTO_CFG[fruto] || FRUTO_CFG.mix;
  let out = `<rect width="${W}" height="${H}" fill="${c.bg}"/>`;
  for (let i = 0; i < 50; i++) {
    const x = 3 + ((i*47+id*13)%(W-6));
    const y = 2 + ((i*31+id*7)%(H-4));
    const w = 4 + ((i*11+id*3)%5);
    const h = w * (.5+((i*7+id)%4)*.1);
    const r = (i*43+id*17)%180;
    out += shape(c.sh, x, y, w, h, c.cols[(i+id)%c.cols.length], r);
  }
  for (let i = 0; i < 35; i++) {
    const x = 3 + ((i*67+id*23)%(W-6));
    const y = 2 + ((i*53+id*19)%(H-4));
    const w = 6 + ((i*13+id*5)%6);
    const h = w * (.5+((i*9+id)%4)*.1);
    const r = (i*37+id*11)%180;
    out += shape(c.sh, x, y, w, h, c.cols[(i*2+id)%c.cols.length], r);
  }
  return out;
}

export function pkgSVG(producto) {
  const { id, fruto, nombre, categoria } = producto;
  const uid = `u${id}`;
  const VW = 220, VH = 370;
  const gr = { nueces:'500g', semillas:'400g', mix:'500g', frutas:'300g' }[categoria] || '500g';
  const bx1=22, bx2=198, by1=20, by2=358;
  const mx = VW/2;
  const textura = frutosTextura(fruto, id);

  return `<svg viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 10px 24px rgba(0,0,0,.28))">
    <defs>
      <linearGradient id="kf${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#b07840"/>
        <stop offset="8%" stop-color="#c89050"/>
        <stop offset="28%" stop-color="#e2b870"/>
        <stop offset="50%" stop-color="#f0c880"/>
        <stop offset="72%" stop-color="#e2b870"/>
        <stop offset="92%" stop-color="#c89050"/>
        <stop offset="100%" stop-color="#b07840"/>
      </linearGradient>
      <linearGradient id="kfs${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(0,0,0,.18)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </linearGradient>
      <radialGradient id="wfade${uid}" cx="50%" cy="50%" r="50%">
        <stop offset="60%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,.25)"/>
      </radialGradient>
      <clipPath id="bagclip${uid}">
        <path d="M${bx1+10},${by1} L${bx2-10},${by1} C${bx2-4},${by1} ${bx2},${by1+6} ${bx2},${by1+12} L${bx2+6},${by2-20} C${bx2+8},${by2-8} ${bx2+6},${by2} ${bx2-2},${by2} L${bx1+2},${by2} C${bx1-6},${by2} ${bx1-8},${by2-8} ${bx1-6},${by2-20} L${bx1},${by1+12} C${bx1},${by1+6} ${bx1+4},${by1} ${bx1+10},${by1}Z"/>
      </clipPath>
    </defs>
    <g clip-path="url(#bagclip${uid})">
      <rect x="${bx1-8}" y="${by1}" width="${VW+16}" height="${VH}" fill="url(#kf${uid})"/>
      <rect x="${bx1-8}" y="${by1}" width="${VW+16}" height="60" fill="url(#kfs${uid})"/>
      <rect x="${bx1-8}" y="${by1}" width="14" height="${VH}" fill="rgba(0,0,0,.12)"/>
      <rect x="${bx2-6}" y="${by1}" width="14" height="${VH}" fill="rgba(0,0,0,.10)"/>
    </g>
    <path d="M${bx1+10},${by1} L${bx2-10},${by1} C${bx2-4},${by1} ${bx2},${by1+6} ${bx2},${by1+12} L${bx2+6},${by2-20} C${bx2+8},${by2-8} ${bx2+6},${by2} ${bx2-2},${by2} L${bx1+2},${by2} C${bx1-6},${by2} ${bx1-8},${by2-8} ${bx1-6},${by2-20} L${bx1},${by1+12} C${bx1},${by1+6} ${bx1+4},${by1} ${bx1+10},${by1}Z"
      fill="none" stroke="rgba(160,100,40,.6)" stroke-width="1.5"/>
    <g>
      ${Array.from({length:28},(_,i)=>`<rect x="${bx1+4+(i*6.3)}" y="${by1+4}" width="4" height="9" rx="1" fill="${i%2===0?'#a06830':'#c8a060'}" opacity=".9"/>`).join('')}
    </g>
    <circle cx="${mx}" cy="128" r="52" fill="rgba(249,245,239,.12)" stroke="rgba(44,26,14,.45)" stroke-width="2"/>
    <circle cx="${mx}" cy="128" r="48" fill="rgba(249,245,239,.08)" stroke="rgba(232,200,130,.3)" stroke-width="1"/>
    <image href="/fotos/ChatGPT Image 2 jul 2026, 00_40_55.png" preserveAspectRatio="xMidYMid slice" x="${mx-40}" y="88" width="80" height="80" clip-path="circle(40px at 40px 40px)"/>
    <text x="${mx}" y="218" text-anchor="middle" font-family="'Inter',sans-serif" font-size="11" font-weight="800" letter-spacing="2" fill="#2c1a0e" text-transform="uppercase">${nombre.toUpperCase()}</text>
    <text x="${mx}" y="232" text-anchor="middle" font-family="'Inter',sans-serif" font-size="8.5" fill="#6b3f1f" letter-spacing="1">${gr}</text>
    <rect x="${bx1+8}" y="248" width="${bx2-bx1-16}" height="88" rx="6" fill="rgba(249,245,239,.18)" stroke="rgba(160,100,40,.35)" stroke-width="1"/>
    <svg x="${bx1+12}" y="252" viewBox="0 0 ${bx2-bx1-20} 90" width="${bx2-bx1-20}" height="80">
      ${textura}
    </svg>
    <text x="${mx}" y="356" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" letter-spacing="1.5" fill="rgba(44,26,14,.5)">ORIGEN NATURAL</text>
  </svg>`;
}
