const API_URL = "http://localhost:3000/api/productos";

export async function obtenerProductos() {

  const res = await fetch(API_URL);

  return await res.json();

}

export async function crearProducto(producto) {

  const res = await fetch(API_URL, {

    method: "POST",

    headers: {

      "Content-Type": "application/json"

    },

    body: JSON.stringify(producto)

  });

  return await res.json();

}

export async function eliminarProducto(id) {

  const res = await fetch(`${API_URL}/${id}`, {

    method: "DELETE"

  });

  return await res.json();

}