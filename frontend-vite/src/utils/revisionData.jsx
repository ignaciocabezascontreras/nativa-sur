import api from './api.jsx';

const headers = (token, wallet) => ({
  ...(token  ? { Authorization: `Bearer ${token}` } : {}),
  ...(wallet ? { 'X-Wallet-Address': wallet }       : {}),
});

// ── Lista ──────────────────────────────────────────────────────────────────

export async function getRevisionLista({ token, walletAddress } = {}) {
  return api({
    method: 'GET',
    endpoint: '/revision/lista',
    withCredentials: true,
    headers: headers(token, walletAddress),
  });
}

// ── Por ID ─────────────────────────────────────────────────────────────────

export async function getRevisionById({ id, token, walletAddress } = {}) {
  return api({
    method: 'GET',
    endpoint: `/revision/${id}`,
    withCredentials: true,
    headers: headers(token, walletAddress),
  });
}

// ── Crear ──────────────────────────────────────────────────────────────────

export async function crearRevision({ payload, token, walletAddress } = {}) {
  return api({
    method: 'POST',
    endpoint: '/revision/nueva',
    data: payload,
    withCredentials: true,
    headers: headers(token, walletAddress),
  });
}

// ── Actualizar sección ─────────────────────────────────────────────────────

export async function actualizarSeccion({ id, seccion, contenido, token, walletAddress } = {}) {
  const params = new URLSearchParams({ seccion, contenido });
  return api({
    method: 'PUT',
    endpoint: `/revision/${id}/seccion?${params.toString()}`,
    withCredentials: true,
    headers: headers(token, walletAddress),
  });
}

// ── Referencias Vancouver ──────────────────────────────────────────────────

export async function getReferencias({ id, token, walletAddress } = {}) {
  return api({
    method: 'GET',
    endpoint: `/revision/${id}/referencias`,
    withCredentials: true,
    headers: headers(token, walletAddress),
  });
}

export async function agregarReferencia({ id, payload, token, walletAddress } = {}) {
  return api({
    method: 'POST',
    endpoint: `/revision/${id}/referencias`,
    data: payload,
    withCredentials: true,
    headers: headers(token, walletAddress),
  });
}

export async function eliminarReferencia({ revisionId, refId, token, walletAddress } = {}) {
  return api({
    method: 'DELETE',
    endpoint: `/revision/${revisionId}/referencias/${refId}`,
    withCredentials: true,
    headers: headers(token, walletAddress),
  });
}