const express = require("express");
const cors = require("cors");
const db = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

const productosRef = db.collection("productos");

app.get("/", (req, res) => {
  res.send("API funcionando - Conectado a Firebase");
});

// Obtener todos los productos
app.get("/api/productos", async (req, res) => {
  try {
    const snapshot = await productosRef.get();
    const productos = [];
    snapshot.forEach(doc => {
      productos.push({ id: doc.id, ...doc.data() });
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener producto por ID
app.get("/api/productos/:id", async (req, res) => {
  try {
    const doc = await productosRef.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo producto
app.post("/api/productos", async (req, res) => {
  try {
    const { nombre, categoria, precio, stock } = req.body;
    if (!nombre || !categoria || precio === undefined || stock === undefined) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }
    
    const nuevoProducto = {
      nombre,
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      createdAt: new Date()
    };
    
    const docRef = await productosRef.add(nuevoProducto);
    res.status(201).json({ id: docRef.id, ...nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto
app.put("/api/productos/:id", async (req, res) => {
  try {
    const docRef = productosRef.doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    
    const datosActualizados = {
      ...req.body,
      updatedAt: new Date()
    };
    
    await docRef.update(datosActualizados);
    const docActualizado = await docRef.get();
    res.json({ id: docActualizado.id, ...docActualizado.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto
app.delete("/api/productos/:id", async (req, res) => {
  try {
    const docRef = productosRef.doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    
    await docRef.delete();
    res.json({ mensaje: "Producto eliminado", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
  console.log("Conectado a Firebase Firestore");
});