export const StatusReserva = {
  Solicitado: 'Solicitado',
  PreReservado: 'Pré-Reservado',
  Confirmado: 'Confirmado',
  Cancelado: 'Cancelado',
  Rejeitado: 'Rejeitado',
  Expirado: 'Expirado',
} as const;

export type StatusReserva = typeof StatusReserva[keyof typeof StatusReserva];

export const STATUS_RESERVA_EM_ABERTO: StatusReserva[] = [
  StatusReserva.Solicitado,
  StatusReserva.PreReservado,
];

export function isReservaEmAberto(status?: string): boolean {
  return STATUS_RESERVA_EM_ABERTO.indexOf(status as StatusReserva) >= 0;
}

export function canPreReserve(status?: string): boolean {
  return status === StatusReserva.Solicitado;
}

export function canConfirm(status?: string): boolean {
  return status === StatusReserva.PreReservado;
}

export function canCancel(status?: string): boolean {
  return isReservaEmAberto(status);
}
