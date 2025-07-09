// Devolve a base URL com o hostname atual e porta 5001.
export function getBaseURL() {
  const hostname = window.location.hostname;
  const port = 5001;
  return `https://${hostname}:${port}`;
}