/**
 * Utility fetch per componenti client e SWR.
 *
 * fetcher(url) — GET con JSON parsing e gestione errori
 * postFetcher(url, data) — POST con JSON body e gestione errori
 */

export async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Errore nel caricamento dei dati");
    error.status = res.status;
    try {
      error.info = await res.json();
    } catch {
      error.info = null;
    }
    throw error;
  }
  return res.json();
}

export async function postFetcher(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = new Error("Errore nella richiesta");
    error.status = res.status;
    try {
      error.info = await res.json();
    } catch {
      error.info = null;
    }
    throw error;
  }
  return res.json();
}
