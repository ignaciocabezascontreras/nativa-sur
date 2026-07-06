import React, { useState } from 'react';

const PHONE   = '56912345678';
const MESSAGE = encodeURIComponent('Hola Nativa Sur, me interesa conocer sus productos 🌿');
const WA_URL  = `https://wa.me/${PHONE}?text=${MESSAGE}`;

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-3">

      {/* Tooltip */}
      <div className={`
        mb-1 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg
        bg-[#1a1a1a]/90 backdrop-blur-sm whitespace-nowrap
        transition-all duration-300 ease-out
        ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
      `}>
        ¡Escríbenos por WhatsApp!
      </div>

      {/* Botón */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Contactar por WhatsApp"
        className="
          w-14 h-14 rounded-2xl flex items-center justify-center
          shadow-xl transition-all duration-300 ease-out
          hover:scale-110 active:scale-95
          animate-pulse-soft
        "
        style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
      >
        {/* Logo WhatsApp SVG */}
        <svg viewBox="0 0 32 32" className="w-7 h-7" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.635 4.594 1.742 6.516L2.667 29.333l6.99-1.72A13.27 13.27 0 0 0 16.003 29.333C23.37 29.333 29.333 23.364 29.333 16S23.37 2.667 16.003 2.667zm0 2.4c5.99 0 10.93 4.94 10.93 10.933s-4.94 10.933-10.93 10.933a10.9 10.9 0 0 1-5.573-1.527l-.397-.238-4.148 1.02 1.052-3.994-.261-.414A10.89 10.89 0 0 1 5.07 16c0-5.993 4.94-10.933 10.933-10.933zm-3.09 4.8c-.247 0-.65.093-.99.463-.34.37-1.3 1.27-1.3 3.096s1.33 3.59 1.516 3.838c.185.247 2.59 4.117 6.375 5.612 3.786 1.495 3.786 1.003 4.47.94.685-.062 2.22-.91 2.534-1.786.314-.876.314-1.627.22-1.784-.093-.155-.34-.247-.71-.432-.37-.185-2.22-1.095-2.563-1.218-.34-.124-.587-.186-.834.185-.247.37-.957 1.218-1.173 1.465-.216.247-.432.278-.803.093-.37-.185-1.563-.576-2.978-1.84-1.1-.98-1.843-2.192-2.059-2.563-.216-.37-.023-.57.163-.755.167-.165.37-.432.555-.648.186-.216.247-.37.37-.617.124-.247.062-.463-.031-.648-.093-.185-.803-2.02-1.12-2.754-.308-.712-.625-.617-.834-.617-.216 0-.463-.03-.71-.03z"/>
        </svg>
      </a>
    </div>
  );
}
