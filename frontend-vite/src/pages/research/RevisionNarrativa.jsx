import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRevisionNarrativa from '../../hooks/useRevisionNarrativa';

const SECCIONES = ['objetivo', 'metodos', 'resultados', 'conclusiones'];

const Q1_PAYLOAD = {
  titulo: 'Línea bipupilar como referencia horizontal para la orientación del cráneo en tomografía computarizada de haz cónico (CBCT): una revisión narrativa',
  titulo_en: 'The Bipupillary Line as a Horizontal Reference for Cranial Orientation in Cone-Beam Computed Tomography: A Narrative Review',
  objetivo: 'Sintetizar y analizar la evidencia científica disponible sobre la utilidad de la línea bipupilar como referencia horizontal para la orientación del cráneo durante la adquisición y reorientación de imágenes de tomografía computarizada de haz cónico (CBCT).',
  metodos: 'Revisión narrativa siguiendo principios metodológicos basados en la Scale for the Assessment of Narrative Review Articles (SANRA). Búsqueda estructurada en PubMed/MEDLINE, Web of Science y Scopus, utilizando combinaciones de términos: bipupillary line, diagnostic Imaging, cranial orientation, cone beam computed tomography. Se incluyeron estudios experimentales, estudios clínicos, revisiones sistemáticas y revisiones narrativas publicados entre 2020 y 2026.',
  resultados: 'La evidencia disponible indica que la línea bipupilar constituye una referencia clínica útil para la orientación inicial del cráneo y el análisis facial; sin embargo, su precisión disminuye en presencia de asimetrías orbitarias, alteraciones de los tejidos blandos y variaciones de la posición natural de la cabeza.',
  conclusiones: 'La línea bipupilar es una referencia útil para la orientación inicial del cráneo en CBCT, aunque presenta limitaciones en pacientes con asimetrías faciales u orbitarias. Su uso debe complementarse con referencias anatómicas tridimensionales para mejorar la precisión y reproducibilidad diagnóstica.',
  keywords: ['bipupillary line', 'diagnostic imaging', 'cranial orientation', 'cone beam computed tomography'],
  fecha: '2026-06-28',
};

const REF_VACIA = {
  autores: '', titulo: '', revista: '', anio: '',
  volumen: '', numero_revista: '', paginas: '', doi: '',
};

// ── Componente principal ───────────────────────────────────────────────────

const RevisionNarrativa = ({ appState }) => {
  const { t } = useTranslation();
  const {
    lista, revisionActiva, referencias, loading, error,
    cargarLista, cargarRevision, nuevaRevision,
    guardarSeccion, cargarReferencias, agregarRef, eliminarRef,
  } = useRevisionNarrativa(appState);

  const [seccionActiva, setSeccionActiva] = useState('objetivo');
  const [textoEdicion, setTextoEdicion]   = useState('');
  const [vistaTab, setVistaTab]           = useState('editor');
  const [formRef, setFormRef]             = useState(REF_VACIA);
  const [guardado, setGuardado]           = useState(false);

  useEffect(() => { cargarLista(); }, []);

  useEffect(() => {
    if (revisionActiva) setTextoEdicion(revisionActiva[seccionActiva] || '');
  }, [seccionActiva, revisionActiva]);

  const handleCargarRevision = async (id) => {
    await cargarRevision(id);
    await cargarReferencias(id);
    setSeccionActiva('objetivo');
    setVistaTab('editor');
  };

  const handleCargarQ1 = async () => {
    const res = await nuevaRevision(Q1_PAYLOAD);
    if (res?.id) {
      await cargarRevision(res.id);
      await cargarReferencias(res.id);
    }
  };

  const handleGuardar = async () => {
    if (!revisionActiva?._id) return;
    await guardarSeccion(revisionActiva._id, seccionActiva, textoEdicion);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const handleAgregarRef = async () => {
    if (!revisionActiva?._id) return;
    await agregarRef(revisionActiva._id, formRef);
    setFormRef(REF_VACIA);
  };

  const handleEliminarRef = (refId) => {
    if (!revisionActiva?._id) return;
    eliminarRef(revisionActiva._id, refId);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-screen animate-fade-in
      bg-light-background dark:bg-dark-background
      text-light-text-primary dark:text-dark-text-primary">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 px-8 py-4
        border-b border-light-border dark:border-dark-border
        bg-light-background/80 dark:bg-dark-background/80
        backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-light-accent dark:bg-dark-accent
              flex items-center justify-center shadow-apple">
              <span className="text-white text-xs font-bold">NS</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">
              Nativa Sur · Research
            </span>
          </div>
          <button
            onClick={handleCargarQ1}
            disabled={loading}
            className="btn-primary disabled:opacity-50 shadow-apple">
            {t('research.cargar_q1')}
          </button>
        </div>
      </nav>

      {/* ── Contenido ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Título de sección */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('research.revision_titulo')}
          </h1>
          <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Gestión de revisiones narrativas científicas · Formato Vancouver
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-5 py-3 rounded-2xl text-sm font-medium text-white shadow-apple
            bg-light-error dark:bg-dark-error animate-fade-in">
            {error}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">

          {/* ── Sidebar: lista ── */}
          <aside className="col-span-12 md:col-span-3">
            <div className="rounded-2xl p-5 shadow-apple
              bg-light-surface dark:bg-dark-surface
              border border-light-border dark:border-dark-border">

              <p className="text-xs font-semibold uppercase tracking-widest mb-4
                text-light-text-secondary dark:text-dark-text-secondary">
                {t('research.lista_revisiones')}
              </p>

              {loading && (
                <div className="flex items-center gap-2 py-2">
                  <div className="w-4 h-4 rounded-full border-2
                    border-light-accent dark:border-dark-accent
                    border-t-transparent animate-spin" />
                  <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {t('research.cargando')}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                {lista.map((r) => (
                  <button
                    key={r._id}
                    onClick={() => handleCargarRevision(r._id)}
                    className={`w-full text-left text-sm px-3 py-2.5 rounded-xl transition-all duration-200
                      ${revisionActiva?._id === r._id
                        ? 'bg-light-accent dark:bg-dark-accent text-white font-medium shadow-apple'
                        : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-surface-secondary dark:hover:bg-dark-surface-secondary'
                      }`}>
                    {(r.titulo || 'Sin título').slice(0, 36)}…
                  </button>
                ))}

                {!loading && lista.length === 0 && (
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary py-2">
                    Sin revisiones. Pulsa "Cargar Q1" para comenzar.
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* ── Panel principal ── */}
          <div className="col-span-12 md:col-span-9 flex flex-col gap-5">

            {/* Tabs Editor / Referencias */}
            <div className="flex gap-2">
              {['editor', 'referencias'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setVistaTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${vistaTab === tab
                      ? 'bg-light-text-primary dark:bg-dark-text-primary text-light-background dark:text-dark-background shadow-apple'
                      : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary border border-light-border dark:border-dark-border hover:border-light-text-secondary dark:hover:border-dark-text-secondary'
                    }`}>
                  {t(`research.tab_${tab}`)}
                </button>
              ))}
            </div>

            {/* ── VISTA: Editor ── */}
            {vistaTab === 'editor' && (
              <div className="rounded-2xl p-6 shadow-apple animate-fade-in
                bg-light-surface dark:bg-dark-surface
                border border-light-border dark:border-dark-border">

                {revisionActiva && (
                  <p className="text-xs leading-relaxed mb-5
                    text-light-text-secondary dark:text-dark-text-secondary">
                    {revisionActiva.titulo}
                  </p>
                )}

                {/* Tabs secciones SANRA */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {SECCIONES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeccionActiva(s)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${seccionActiva === s
                          ? 'bg-light-accent dark:bg-dark-accent text-white shadow-apple'
                          : 'bg-light-surface-secondary dark:bg-dark-surface-secondary text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                        }`}>
                      {t(`research.seccion_${s}`)}
                    </button>
                  ))}
                </div>

                <textarea
                  value={textoEdicion}
                  onChange={(e) => setTextoEdicion(e.target.value)}
                  rows={11}
                  disabled={!revisionActiva}
                  className="input-apple resize-none leading-relaxed disabled:opacity-40"
                  placeholder={revisionActiva
                    ? t('research.placeholder_seccion')
                    : t('research.selecciona_revision')}
                />

                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={handleGuardar}
                    disabled={!revisionActiva}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    {t('research.guardar_seccion')}
                  </button>
                  {guardado && (
                    <span className="text-sm font-medium text-light-accent dark:text-dark-accent animate-fade-in">
                      {t('research.guardado_ok')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── VISTA: Referencias Vancouver ── */}
            {vistaTab === 'referencias' && (
              <div className="rounded-2xl p-6 shadow-apple animate-fade-in
                bg-light-surface dark:bg-dark-surface
                border border-light-border dark:border-dark-border
                flex flex-col gap-6">

                {/* Lista */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4
                    text-light-text-secondary dark:text-dark-text-secondary">
                    {t('research.lista_referencias')}
                  </p>
                  {referencias.length === 0 ? (
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {t('research.sin_referencias')}
                    </p>
                  ) : (
                    <ol className="space-y-3">
                      {referencias.map((ref) => (
                        <li key={ref._id} className="flex items-start gap-3 group">
                          <span className="text-sm font-bold min-w-[1.5rem] pt-0.5
                            text-light-accent dark:text-dark-accent">
                            {ref.numero}.
                          </span>
                          <p className="text-sm flex-1 leading-relaxed
                            text-light-text-primary dark:text-dark-text-primary">
                            {ref.cita_vancouver}
                          </p>
                          <button
                            onClick={() => handleEliminarRef(ref._id)}
                            className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded-lg
                              text-light-error dark:text-dark-error
                              hover:bg-light-surface-secondary dark:hover:bg-dark-surface-secondary
                              transition-all duration-200 shrink-0">
                            ✕
                          </button>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                {/* Formulario nueva referencia */}
                <div className="border-t border-light-border dark:border-dark-border pt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-5
                    text-light-text-secondary dark:text-dark-text-secondary">
                    {t('research.nueva_referencia')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'autores',        label: t('research.ref_autores'),  placeholder: 'Apellido A, Apellido B' },
                      { key: 'titulo',         label: t('research.ref_titulo'),   placeholder: 'Título del artículo' },
                      { key: 'revista',        label: t('research.ref_revista'),  placeholder: 'J Oral Maxillofac Surg' },
                      { key: 'anio',           label: t('research.ref_anio'),     placeholder: '2024' },
                      { key: 'volumen',        label: t('research.ref_volumen'),  placeholder: '82' },
                      { key: 'numero_revista', label: t('research.ref_numero'),   placeholder: '3' },
                      { key: 'paginas',        label: t('research.ref_paginas'),  placeholder: '456-463' },
                      { key: 'doi',            label: t('research.ref_doi'),      placeholder: '10.1016/j...' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className={key === 'titulo' ? 'md:col-span-2' : ''}>
                        <label className="block text-xs font-medium mb-1.5
                          text-light-text-secondary dark:text-dark-text-secondary">
                          {label}
                        </label>
                        <input
                          type="text"
                          value={formRef[key]}
                          onChange={(e) => setFormRef(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="input-apple"
                        />
                      </div>
                    ))}
                  </div>

                  {formRef.autores && (
                    <div className="mt-5 p-4 rounded-2xl text-sm italic
                      bg-light-surface-secondary dark:bg-dark-surface-secondary
                      text-light-text-secondary dark:text-dark-text-secondary">
                      <span className="not-italic font-semibold block mb-1.5 text-xs uppercase tracking-widest
                        text-light-text-primary dark:text-dark-text-primary">
                        {t('research.preview_vancouver')}
                      </span>
                      {`${formRef.autores}. ${formRef.titulo}. ${formRef.revista}. ${formRef.anio};${formRef.volumen}(${formRef.numero_revista}):${formRef.paginas}.${formRef.doi ? ` doi:${formRef.doi}` : ''}`}
                    </div>
                  )}

                  <button
                    onClick={handleAgregarRef}
                    disabled={!revisionActiva || !formRef.autores || !formRef.titulo}
                    className="mt-5 btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    {t('research.agregar_referencia')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevisionNarrativa;

export const pageMetadata = {
  path: '/app/research/revision-narrativa',
  label: 'research.label',
  category: 'research.category',
  minRoleLevel: 3,
  maxRoleLevel: 6,
  order: 1,
  locations: ['sidebar'],
  description: 'research.description',
  icon: 'FaBookMedical',
  isSearchable: true,
};
