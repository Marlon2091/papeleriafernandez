import { useEffect, useState } from 'react';
import { Package, Save, X } from 'lucide-react';

const EMPTY_FORM = {
  sku: '',
  nombre: '',
  descripcion: '',
  id_categoria: '',
  id_unidad: '',
  precio_venta: '',
  stock_actual: '',
  stock_minimo: '',
  id_proveedor: '',
  precio_compra: ''
};

export default function ProductoForm({ editing, categorias, unidades, proveedores, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!editing) {
      setForm(EMPTY_FORM);
      return;
    }

    const principal = editing.proveedores?.find((p) => p.es_principal) || editing.proveedores?.[0];

    setForm({
      sku: editing.sku || '',
      nombre: editing.nombre || '',
      descripcion: editing.descripcion || '',
      id_categoria: String(editing.id_categoria),
      id_unidad: String(editing.id_unidad),
      precio_venta: editing.precio_venta || '',
      stock_actual: editing.stock_actual || '',
      stock_minimo: editing.stock_minimo || '',
      id_proveedor: principal ? String(principal.id_proveedor) : '',
      precio_compra: principal ? principal.precio_compra : ''
    });
  }, [editing]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();

    const proveedoresPayload = form.id_proveedor
      ? [{ id_proveedor: Number(form.id_proveedor), precio_compra: Number(form.precio_compra) || 0, es_principal: true }]
      : [];

    onSubmit({
      sku: form.sku || null,
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      id_categoria: Number(form.id_categoria),
      id_unidad: Number(form.id_unidad),
      precio_venta: Number(form.precio_venta) || 0,
      stock_actual: Number(form.stock_actual) || 0,
      stock_minimo: Number(form.stock_minimo) || 0,
      proveedores: proveedoresPayload
    });
  }

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h2>{editing ? 'Editar producto' : 'Nuevo producto'}</h2>

      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={change} required />
      <input name="sku" placeholder="SKU (opcional)" value={form.sku} onChange={change} />
      <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={change} />

      <select name="id_categoria" value={form.id_categoria} onChange={change} required>
        <option value="">Selecciona categoría</option>
        {categorias.filter((c) => c.activo).map((c) => (
          <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
        ))}
      </select>

      <select name="id_unidad" value={form.id_unidad} onChange={change} required>
        <option value="">Selecciona unidad</option>
        {unidades.filter((u) => u.activo).map((u) => (
          <option key={u.id_unidad} value={u.id_unidad}>{u.nombre}</option>
        ))}
      </select>

      <input
        name="precio_venta"
        type="number"
        step="0.01"
        min="0"
        placeholder="Precio de venta"
        value={form.precio_venta}
        onChange={change}
      />

      <input
        name="stock_actual"
        type="number"
        step="0.01"
        min="0"
        placeholder="Stock inicial"
        value={form.stock_actual}
        onChange={change}
        disabled={Boolean(editing)}
        title={editing ? 'El stock solo cambia desde Movimientos de inventario' : undefined}
      />

      <input
        name="stock_minimo"
        type="number"
        step="0.01"
        min="0"
        placeholder="Stock mínimo (alerta)"
        value={form.stock_minimo}
        onChange={change}
      />

      <select name="id_proveedor" value={form.id_proveedor} onChange={change}>
        <option value="">Sin proveedor asignado</option>
        {proveedores.filter((p) => p.activo).map((p) => (
          <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
        ))}
      </select>

      {form.id_proveedor && (
        <input
          name="precio_compra"
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio de compra a ese proveedor"
          value={form.precio_compra}
          onChange={change}
        />
      )}

      <div className="actions">
        <button type="submit">
          <Save size={16} />
          {editing ? 'Guardar cambios' : 'Crear'}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onCancel}>
            <X size={16} />
            Cancelar
          </button>
        )}
      </div>

      {!editing && (
        <p className="footer-note">
          <Package size={14} style={{ verticalAlign: 'text-bottom' }} /> El producto puede tener más de un proveedor — por ahora este formulario asigna solo el principal; edítalo luego si necesitas agregar más.
        </p>
      )}
    </form>
  );
}
