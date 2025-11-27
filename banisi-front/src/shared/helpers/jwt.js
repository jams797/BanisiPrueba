function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function isTokenValid(token) {
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;

  // exp viene en segundos UNIX
  const nowInSeconds = Date.now() / 1000;
  return payload.exp > nowInSeconds;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  return localStorage.setItem('token', token);
}

export function lougout() {
  return localStorage.removeItem('token');
}
