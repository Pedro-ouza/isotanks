import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Isotank Manager</h1>
        <p className="text-muted-foreground mt-2">
          Painel de Controle e Gestão de Reservas
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/nova-reserva"
          className="group block p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all hover:border-primary/50"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Nova Reserva</h2>
          <p className="text-muted-foreground">Inicie o fluxo de locação de um isotank com aprovação em etapas.</p>
        </Link>
        <Link
          href="/status"
          className="group block p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all hover:border-primary/50"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Status do Sistema</h2>
          <p className="text-muted-foreground">Acompanhe a disponibilidade e SLAs dos serviços em tempo real.</p>
        </Link>
      </div>
    </main>
  );
}
