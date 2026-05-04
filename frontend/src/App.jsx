import { useEffect, useState } from "react";
import { obtenerProductos } from "./services/productosService";
import ProductoForm from "./components/ProductoForm";
import ProductoList from "./components/ProductoList";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await obtenerProductos();
      setProductos(data);
    } catch (err) {
      setError("Error al cargar productos: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📦 Inventario Fullstack</h1>
        <p>Gestión de productos con React + Firebase</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="app-content">
        <aside className="form-section">
          <ProductoForm onProductoCreado={cargarProductos} />
        </aside>

        <main className="lista-section">
          <ProductoList
            productos={productos}
            onActualizar={cargarProductos}
            loading={loading}
          />
        </main>
      </div>
    </div>
    </main>
  );
}

export default App;