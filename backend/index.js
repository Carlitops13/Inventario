const express = require("express");
const cors = require("cors");
const db = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

let productos = [
  { id: 1, nombre: "Laptop", categoria: "Tecnología", precio: 1200, stock: 5 },
  { id: 2, nombre: "Mouse", categoria: "Tecnología", precio: 25, stock: 30 }
];

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.get("/api/productos", (req, res) => {
  res.json(productos);
});

app.get("/api/productos/:id", (req, res) => {
  const producto = productos.find(p => p.id === Number(req.params.id));
  if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
  res.json(producto);
});

app.post("/api/productos", (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;
  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }
  const nuevo = { id: Date.now(), nombre, categoria, precio: Number(precio), stock: Number(stock) };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

app.put("/api/productos/:id", (req, res) => {
  const index = productos.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ mensaje: "Producto no encontrado" });
  productos[index] = { ...productos[index], ...req.body };
  res.json(productos[index]);
});

app.delete("/api/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = productos.some(p => p.id === id);
  if (!existe) return res.status(404).json({ mensaje: "Producto no encontrado" });
  productos = productos.filter(p => p.id !== id);
  res.json({ mensaje: "Producto eliminado" });
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});