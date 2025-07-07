import { Database } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b p-4 shadow-sm">
      <div className="container mx-auto flex items-center gap-3">
        <Database className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold text-foreground tracking-tight">QueryWise</h1>
      </div>
    </header>
  );
}
