export default function StatusPage() {
  const services = [
    { name: "API de Reservas", status: "operational", uptime: "99.9%" },
    { name: "Banco de Dados (D1)", status: "operational", uptime: "100%" },
    { name: "Integração WhatsApp", status: "degraded", uptime: "95.5%" },
    { name: "Integração Maps/Rotas", status: "operational", uptime: "99.8%" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Status do Sistema</h1>
        <p className="text-muted-foreground text-lg">
          Acompanhe em tempo real a disponibilidade dos serviços do Isotank Manager.
        </p>
      </header>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-green-800">Todos os sistemas operacionais</h2>
          <p className="text-green-700 mt-1">Última atualização: {new Date().toLocaleString('pt-BR')}</p>
        </div>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-green-200">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-5 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <span className={`w-3 h-3 rounded-full ${service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="font-medium text-lg">{service.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold capitalize text-muted-foreground">
                {service.status === 'operational' ? 'Operacional' : 'Degradado'}
              </span>
              <span className="text-xs text-muted-foreground">Uptime: {service.uptime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
