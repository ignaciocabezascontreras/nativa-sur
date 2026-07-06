import { useState, useCallback } from 'react';
import {
  getRevisionLista,
  getRevisionById,
  crearRevision,
  actualizarSeccion,
  getReferencias,
  agregarReferencia,
  eliminarReferencia,
} from '../utils/revisionData';

export default function useRevisionNarrativa(appState) {
  const [lista, setLista]             = useState([]);
  const [revisionActiva, setRevision] = useState(null);
  const [referencias, setReferencias] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const auth = {
    token:         appState?.token,
    walletAddress: appState?.account,
  };

  // ── Lista ────────────────────────────────────────────────────────────────

  const cargarLista = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await getRevisionLista(auth);
      setLista(res?.revisiones || []);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al cargar lista');
    } finally {
      setLoading(false);
    }
  }, [auth.token, auth.walletAddress]);

  // ── Cargar una revisión ──────────────────────────────────────────────────

  const cargarRevision = useCallback(async (id) => {
    setLoading(true); setError(null);
    try {
      const res = await getRevisionById({ id, ...auth });
      setRevision(res?.revision || null);
      return res?.revision;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al cargar revisión');
    } finally {
      setLoading(false);
    }
  }, [auth.token, auth.walletAddress]);

  // ── Crear revisión ───────────────────────────────────────────────────────

  const nuevaRevision = useCallback(async (payload) => {
    setLoading(true); setError(null);
    try {
      const res = await crearRevision({ payload, ...auth });
      await cargarLista();
      return res;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al crear revisión');
    } finally {
      setLoading(false);
    }
  }, [auth.token, auth.walletAddress]);

  // ── Guardar sección ──────────────────────────────────────────────────────

  const guardarSeccion = useCallback(async (id, seccion, contenido) => {
    setError(null);
    try {
      await actualizarSeccion({ id, seccion, contenido, ...auth });
      setRevision(prev => prev ? { ...prev, [seccion]: contenido } : prev);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al guardar sección');
    }
  }, [auth.token, auth.walletAddress]);

  // ── Referencias Vancouver ────────────────────────────────────────────────

  const cargarReferencias = useCallback(async (id) => {
    setError(null);
    try {
      const res = await getReferencias({ id, ...auth });
      setReferencias(res?.referencias || []);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al cargar referencias');
    }
  }, [auth.token, auth.walletAddress]);

  const agregarRef = useCallback(async (revisionId, payload) => {
    setError(null);
    try {
      const res = await agregarReferencia({ id: revisionId, payload, ...auth });
      await cargarReferencias(revisionId);
      return res;
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al agregar referencia');
    }
  }, [auth.token, auth.walletAddress]);

  const eliminarRef = useCallback(async (revisionId, refId) => {
    setError(null);
    try {
      await eliminarReferencia({ revisionId, refId, ...auth });
      await cargarReferencias(revisionId);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Error al eliminar referencia');
    }
  }, [auth.token, auth.walletAddress]);

  return {
    lista, revisionActiva, referencias,
    loading, error,
    cargarLista, cargarRevision, nuevaRevision,
    guardarSeccion,
    cargarReferencias, agregarRef, eliminarRef,
  };
}