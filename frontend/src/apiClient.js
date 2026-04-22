const API_BASE_URL = "http://localhost:3000/api";

/**
 * Intenta parsear el body como JSON sin romper el flujo.
 *
 * Motivo:
 * - Algunos errores/respuestas pueden venir sin JSON válido.
 * - Evitamos que un `response.json()` lance excepción y oculte el status HTTP original.
 *
 * @param {Response} response Respuesta de `fetch`.
 * @returns {Promise<any|null>} JSON parseado o `null` si no es parseable.
 */
async function safeParseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Cliente HTTP mínimo para consumir el backend.
 *
 * Contrato:
 * - Devuelve siempre `{ response, data }` para que el caller pueda decidir por status (`response.status`)
 *   y por payload (`data`) sin mezclar excepciones con errores de negocio.
 *
 * Decisiones:
 * - Solo setea `Content-Type: application/json` si hay `body` (evita headers innecesarios en GET).
 * - No lanza excepciones por códigos HTTP no-2xx: ese control se hace en el componente.
 *
 * @param {string} path Ruta relativa a la API (ej. `/login`, `guardias/1`).
 * @param {{ method?: string, body?: any }} [options] Opciones de request.
 * @returns {Promise<{ response: Response, data: any }>} Response crudo + datos parseados (o null).
 */
export async function apiRequest(path, { method = "GET", body } = {}) {
  // Normaliza el path para permitir llamadas con o sin slash inicial.
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await safeParseJson(response);
  return { response, data };
}

