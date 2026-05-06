require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabaseAuth, supabaseAdmin } = require('./supabase');
const verificarSupabaseToken = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ mensaje: 'API Supabase funcionando' }));

// ==================== AUTENTICACIÓN ====================
// Registrar usuario
app.post('/api/auth/registrar', async (req, res) => {
  try {
    const { email, password, nombre_usuario } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son requeridos' });
    }

    // Crear usuario en auth.users
    const { data: usuario, error: errorAuth } = await supabaseAuth.auth.signUp({
      email,
      password,
    });

    if (errorAuth) throw errorAuth;

    // Crear perfil en tabla perfiles
    if (usuario?.user) {
      const { error: errorPerfil } = await supabaseAdmin
        .from('perfiles')
        .insert({
          id: usuario.user.id,
          email: usuario.user.email,
          nombre_usuario: nombre_usuario || null,
        });

      if (errorPerfil) throw errorPerfil;
    }

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: { id: usuario.user.id, email: usuario.user.email }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar', detalle: error.message });
  }
});

// Login usuario
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son requeridos' });
    }

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      mensaje: 'Sesión iniciada',
      usuario: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }
    });
  } catch (error) {
    res.status(401).json({ mensaje: 'Error al iniciar sesión', detalle: error.message });
  }
});

// ==================== PERFILES ====================
// Obtener perfil del usuario autenticado
app.get('/api/perfil', verificarSupabaseToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('perfiles')
      .select('*')
      .eq('id', req.usuario.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', detalle: error.message });
  }
});

// Actualizar perfil
app.put('/api/perfil', verificarSupabaseToken, async (req, res) => {
  try {
    const { nombre_usuario } = req.body;

    if (!nombre_usuario) {
      return res.status(400).json({ mensaje: 'Nombre de usuario requerido' });
    }

    const { data, error } = await supabaseAdmin
      .from('perfiles')
      .update({ nombre_usuario })
      .eq('id', req.usuario.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      mensaje: 'Perfil actualizado',
      perfil: data
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar perfil', detalle: error.message });
  }
});

// ==================== PRODUCTOS ====================

app.get('/api/productos', verificarSupabaseToken, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('productos')
    .select('*')
    .eq('user_id', req.usuario.id)
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ mensaje: 'Error al listar productos', detalle: error.message });
  res.json(data);
});

app.post('/api/productos', verificarSupabaseToken, async (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;

  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({ mensaje: 'Nombre, categoría, precio y stock son obligatorios' });
  }

  const nuevo = {
    nombre: nombre.toUpperCase(),
    categoria,
    precio: Number(precio),
    stock: Number(stock),
    user_id: req.usuario.id,
    email_usuario: req.usuario.email,
  };

  const { data, error } = await supabaseAdmin
    .from('productos')
    .insert([nuevo])
    .select()
    .single();

  if (error) return res.status(500).json({ mensaje: 'Error al crear producto', detalle: error.message });
  res.status(201).json(data);
});

app.put('/api/productos/:id', verificarSupabaseToken, async (req, res) => {
  const cambios = { ...req.body, actualizado_en: new Date().toISOString() };
  if (cambios.nombre) cambios.nombre = cambios.nombre.toUpperCase();
  if (cambios.precio !== undefined) cambios.precio = Number(cambios.precio);
  if (cambios.stock !== undefined) cambios.stock = Number(cambios.stock);
  delete cambios.user_id;
  delete cambios.email_usuario;

  const { data, error } = await supabaseAdmin
    .from('productos')
    .update(cambios)
    .eq('id', req.params.id)
    .eq('user_id', req.usuario.id)
    .select()
    .single();

  if (error || !data) return res.status(404).json({ mensaje: 'Producto no encontrado o no autorizado', detalle: error?.message });
  res.json(data);
});

app.delete('/api/productos/:id', verificarSupabaseToken, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('productos')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.usuario.id);

  if (error) return res.status(500).json({ mensaje: 'Error al eliminar producto', detalle: error.message });
  res.json({ mensaje: 'Producto eliminado' });
});

app.listen(PORT, () => console.log(`API Supabase en http://localhost:${PORT}`));
