const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function apiRequest(
  path,
  { method = "POST", body = null, headers = {} } = {}
) {
  try {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, config);

    let data = null;
    try {
      data = await response.json();
    } catch (err) {
      // ---
    }
    // console.log('response', response);

    if (!response.ok) {
      return {
        status: "false",
        data,
        message:
          data?.result?.message ||
          data?.error ||
          `Error en la solicitud (HTTP ${response.status})`,
      };
    }

    return {
      status: "ok",
      data: data?.result,
      message: data?.result?.message || "Operación realizada correctamente",
    };
  } catch (error) {
    // Errores de red, CORS, timeout, etc.
    return {
      status: "error",
      data: null,
      message: error.message || "Error de conexión con el servidor",
    };
  }
}
