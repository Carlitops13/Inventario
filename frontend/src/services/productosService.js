const API_URL = "http://localhost:3000/api/productos";

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || error.error || "Error en la solicitud");
  }
  return await res.json();
}

export async function obtenerProductos() {
  try {
    const res = await fetch(API_URL);
    return await handleResponse(res);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}

export async function obtenerProductoPorId(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    return await handleResponse(res);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
}

export async function crearProducto(producto) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(producto)
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
}

export async function actualizarProducto(id, producto) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(producto)
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
}

export async function eliminarProducto(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
}