import { useState } from "react";
import { login, registrar } from "../services/authService";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [esRegistro, setEsRegistro] = useState(false);

    const manejarSubmit = async (accion) => {
        try {
            setMensaje("Procesando...");
            let resultado;

            if (accion === "login") {
                resultado = await login(email, password);
            } else {
                resultado = await registrar(email, password, nombreUsuario);
            }

            const { error } = resultado;

            if (error) {
                setMensaje("Error: " + error.message);
            } else {
                if (accion === "login") {
                    setMensaje("✓ Sesión iniciada correctamente");
                    // Redirigir o mostrar dashboard después de 1 segundo
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 1000);
                } else {
                    setMensaje("✓ Usuario registrado. Revisa tu email de confirmación.");
                    // Limpiar formulario
                    setEmail("");
                    setPassword("");
                    setNombreUsuario("");
                    setEsRegistro(false);
                }
            }
        } catch (error) {
            setMensaje("Error: " + error.message);
        }
    };

    return (
        <section className="card auth-card">
            <h2>{esRegistro ? "Registro" : "Login"} Supabase</h2>
            <p>
                {esRegistro
                    ? "Crea una nueva cuenta"
                    : "Ingresa con usuario y clave. Si no tienes cuenta, presiona Registrarse."}
            </p>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                type="email"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Clave"
                type="password"
            />
            {esRegistro && (
                <input
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    placeholder="Nombre de usuario (opcional)"
                    type="text"
                />
            )}
            <div className="row">
                {esRegistro ? (
                    <>
                        <button onClick={() => manejarSubmit("registro")}>
                            Registrarse
                        </button>
                        <button
                            className="secondary"
                            onClick={() => {
                                setEsRegistro(false);
                                setMensaje("");
                            }}
                        >
                            Volver
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => manejarSubmit("login")}>Ingresar</button>
                        <button
                            className="secondary"
                            onClick={() => {
                                setEsRegistro(true);
                                setMensaje("");
                            }}
                        >
                            Registrarse
                        </button>
                    </>
                )}
            </div>
            {mensaje && (
                <p
                    className="message"
                    style={{
                        color: mensaje.includes("Error") ? "#d32f2f" : "#388e3c",
                        marginTop: "1rem",
                    }}
                >
                    {mensaje}
                </p>
            )}
        </section>
    );
}
