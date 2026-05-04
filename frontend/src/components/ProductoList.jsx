import { useState, useEffect } from "react";
import ProductoCard from "./ProductoCard";
import "../styles/ProductoList.css";

function ProductoList({ productos, onActualizar, loading }) {
  const [filtro, setFiltro] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    if (!filtro) {
      setProductosFiltrados(productos);
    } else {
      const filtered = productos.filter(p =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        p.categoria.toLowerCase().includes(filtro.toLowerCase())
      );
      setProductosFiltrados(filtered);
    }
  }, [productos, filtro]);

  const totalProductos = productos.length;
  const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
  const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h2>Inventario de Productos</h2>
        
        <div className="estadisticas">
          <div className="stat">
            <span className="stat-label">Total Productos:</span>
            <span className="stat-valor">{totalProductos}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Stock Total:</span>
            <span className="stat-valor">{totalStock}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Valor Total:</span>
            <span className="stat-valor">${valorTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-input"
        />
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : productosFiltrados.length === 0 ? (
        <div className="empty-state">
          <p>{filtro ? "No se encontraron productos" : "No hay productos registrados"}</p>
        </div>
      ) : (
        <div className="productos-grid">
          {productosFiltrados.map(producto => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              onProductoEliminado={onActualizar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductoList;
