import { useEffect, useState, useCallback } from "react";
import { obtenerProductos } from "./services/productosService";
import { logout } from "./services/authService";
import { supabase } from "./supabaseClient";
import ProductoForm from "./components/ProductoForm";
import ProductoList from "./components/ProductoList";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sesion, setSesion] = useState(null);
  const [cargandoSesion] = useState(false);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
    }).catch(err => console.error('Error al obtener sesión:', err));

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSesion(session);
      console.log('Evento auth:', event);
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const cargarProductos = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (sesion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      cargarProductos();
    }
  }, [sesion, cargarProductos]);

  if (cargandoSesion) {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>📦 Inventario Fullstack</h1>
        </header>
        <div className="app-content">
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión, mostrar LoginForm
  if (!sesion) {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>📦 Inventario Fullstack</h1>
          <p>Gestión de productos con Supabase</p>
        </header>
        <div className="app-content">
          <LoginForm />
        </div>
      </div>
    );
  }

  const manejarLogout = async () => {
    await logout();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📦 Inventario Fullstack</h1>
        <p>Gestión de productos con Supabase</p>
        <div style={{ marginTop: "1rem" }}>
          <p style={{ color: 'white' }}>Sesión: {sesion?.user?.email}</p>
          <button onClick={manejarLogout} style={{ padding: "0.5rem 1rem", marginTop: '0.5rem' }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="app-content" style={{ gridTemplateColumns: '300px 1fr' }}>
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
  );
}

export default App;