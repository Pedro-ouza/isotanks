export const StatusDisponibilidade = {
  Disponivel: 'Disponível',
  Reservado: 'Reservado',
  Indisponivel: 'Indisponível',
  EmUso: 'Em Uso',
  Manutencao: 'Manutenção',
} as const;

export type StatusDisponibilidade = typeof StatusDisponibilidade[keyof typeof StatusDisponibilidade];

export function normalizeStatusDisponibilidade(status?: string): StatusDisponibilidade | undefined {
  if (!status) {
    return undefined;
  }

  const normalized = status.trim().toLowerCase();

  if (normalized === 'disponivel' || normalized === 'disponível') {
    return StatusDisponibilidade.Disponivel;
  }

  if (normalized === 'reservado') {
    return StatusDisponibilidade.Reservado;
  }

  if (normalized === 'indisponivel' || normalized === 'indisponível') {
    return StatusDisponibilidade.Indisponivel;
  }

  if (normalized === 'em uso') {
    return StatusDisponibilidade.EmUso;
  }

  if (normalized === 'manutencao' || normalized === 'manutenção') {
    return StatusDisponibilidade.Manutencao;
  }

  return undefined;
}

export function isDisponivel(status?: string): boolean {
  return normalizeStatusDisponibilidade(status) === StatusDisponibilidade.Disponivel;
}
