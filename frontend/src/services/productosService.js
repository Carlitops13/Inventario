import { supabase } from '../supabaseClient';

export async function obtenerProductos() {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

export async function obtenerProductoPorId(id) {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
}

export async function crearProducto(producto) {
  try {
    const { data, error } = await supabase
      .from('productos')
      .insert([producto])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
}

export async function actualizarProducto(id, producto) {
  try {
    const { data, error } = await supabase
      .from('productos')
      .update(producto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
}

export async function eliminarProducto(id) {
  try {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { mensaje: 'Producto eliminado' };
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
}