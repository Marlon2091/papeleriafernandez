// Catálogo estático de módulos del sidebar. `roles` define quién puede verlos;
// el filtrado real por rol del usuario logueado vive en hooks/useNavItems.js,
// no aquí ni hardcodeado dentro del componente visual.
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard', roles: ['admin', 'empleado'] },
  { label: 'Productos', path: '/productos', icon: 'Package', roles: ['admin', 'empleado'] },
  { label: 'Categorías', path: '/categorias', icon: 'Tags', roles: ['admin', 'empleado'] },
  { label: 'Proveedores', path: '/proveedores', icon: 'Truck', roles: ['admin', 'empleado'] },
  { label: 'Servicios', path: '/servicios', icon: 'Wrench', roles: ['admin', 'empleado'] },
  { label: 'Movimientos', path: '/movimientos', icon: 'ArrowLeftRight', roles: ['admin', 'empleado'] },
  { label: 'Usuarios', path: '/usuarios', icon: 'Users', roles: ['admin'] }
];
