import { useMemo } from 'react';
import { NAV_ITEMS } from '../config/navItems';
import { useAuth } from './useAuth';

// Filtra el catálogo de navegación según el rol del usuario logueado.
// La vista (Sidebar) solo recorre lo que este hook devuelve — no decide
// por su cuenta qué mostrar según el rol.
export function useNavItems() {
  const { user } = useAuth();

  return useMemo(() => {
    const rol = user?.rol;
    if (!rol) return [];
    return NAV_ITEMS.filter((item) => item.roles.includes(rol));
  }, [user]);
}
