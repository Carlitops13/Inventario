import { useState } from "react";
import { crearProducto } from "../services/productosService";
import "../styles/ProductoForm.css";

function ProductoForm({ onProductoCreado }) {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    setError("");
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!form.nombre || !form.categoria || !form.precio || !form.stock) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (form.precio <= 0 || form.stock < 0) {
      setError("Precio debe ser mayor a 0 y Stock no puede ser negativo");
      return;
    }

    setLoading(true);
    try {
      await crearProducto(form);
      setForm({
        nombre: "",
        categoria: "",
        precio: "",
        stock: ""
      });
      onProductoCreado();
    } catch (err) {
      setError("Error al crear el producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Agregar Nuevo Producto</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={guardarProducto} className="producto-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Laptop"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoría:</label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={manejarCambio}
          >
            <option value="">Seleccionar categoría</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Ropa">Ropa</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={form.precio}
            onChange={manejarCambio}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={form.stock}
            onChange={manejarCambio}
            placeholder="0"
            min="0"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Guardando..." : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
}

export default ProductoForm;
