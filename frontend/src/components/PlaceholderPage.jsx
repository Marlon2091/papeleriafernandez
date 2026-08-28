import { Construction } from 'lucide-react';

// Vista temporal para módulos del sidebar que todavía no tienen CRUD propio.
// Cada módulo la reemplaza por su página real cuando se construye.
export default function PlaceholderPage({ title, description }) {
  return (
    <main className="container">
      <header className="page-header">
        <h1>{title}</h1>
      </header>

      <div className="card empty-state">
        <Construction size={32} />
        <p>{description || 'Este módulo todavía no está construido.'}</p>
      </div>
    </main>
  );
}
