import { eliminarProducto } from "../services/productosService";
import "../styles/ProductoCard.css";

function ProductoCard({ producto, onProductoEliminado }) {
  const handleEliminar = async () => {
    if (window.confirm(`¿Eliminar "${producto.nombre}"?`)) {
      try {
        await eliminarProducto(producto.id);
        onProductoEliminado();
      } catch (error) {
        alert("Error al eliminar el producto: " + error.message);
      }
    }
  };

  return (
    <div className="producto-card">
      <div className="card-header">
        <h3>{producto.nombre}</h3>
        <span className="categoria-badge">{producto.categoria}</span>
      </div>

      <div className="card-body">
        <div className="producto-info">
          <div className="info-item">
            <span className="label">Precio:</span>
            <span className="value precio">${producto.precio.toFixed(2)}</span>
          </div>
          <div className="info-item">
            <span className="label">Stock:</span>
            <span className={`value stock ${producto.stock === 0 ? 'agotado' : ''}`}>
              {producto.stock} unidades
            </span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button
          className="btn-eliminar"
          onClick={handleEliminar}
          title="Eliminar producto"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default ProductoCard;
