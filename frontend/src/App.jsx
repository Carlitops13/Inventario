import { useEffect, useState } from "react";
import {
  obtenerProductos,
  crearProducto,
  eliminarProducto
} from "./services/productosService";

function App() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: ""
  });

  const cargarProductos = async () => {
    const data = await obtenerProductos();
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    await crearProducto(form);

    setForm({
      nombre: "",
      categoria: "",
      precio: "",
      stock: ""
    });

    cargarProductos();
  };

  const borrarProducto = async (id) => {
    await eliminarProducto(id);
    cargarProductos();
  };

  return (
    <main>
      <h1>Inventario Fullstack</h1>

      <form onSubmit={guardarProducto}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={manejarCambio}
        />

        <input
          name="categoria"
          placeholder="Categoría"
          value={form.categoria}
          onChange={manejarCambio}
        />

        <input
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={manejarCambio}
        />

        <input
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={manejarCambio}
        />

        <button type="submit">Guardar</button>
      </form>

      <hr />

      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio} - Stock: {producto.stock}
            <button onClick={() => borrarProducto(producto.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;