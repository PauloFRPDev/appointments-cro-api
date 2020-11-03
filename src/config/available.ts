export interface TimeDTO {
  hour: string;
  appointmentQuantity: number;
}

export const AttendanceHour = [
  { hour: '09:00', appointmentQuantity: 3 },
  { hour: '10:00', appointmentQuantity: 3 },
  { hour: '11:00', appointmentQuantity: 3 },
  { hour: '12:00', appointmentQuantity: 1 },
  { hour: '13:00', appointmentQuantity: 2 },
  { hour: '14:00', appointmentQuantity: 3 },
  { hour: '15:00', appointmentQuantity: 3 },
  { hour: '16:00', appointmentQuantity: 3 },
] as TimeDTO[];

export const LibraryHour = [
  { hour: '09:00', appointmentQuantity: 1 },
  { hour: '10:00', appointmentQuantity: 1 },
  { hour: '11:00', appointmentQuantity: 1 },
  { hour: '13:00', appointmentQuantity: 1 },
  { hour: '14:00', appointmentQuantity: 1 },
  { hour: '15:00', appointmentQuantity: 1 },
  { hour: '16:00', appointmentQuantity: 1 },
] as TimeDTO[];

export const LibraryStudyHour = [
  { hour: '09:00', appointmentQuantity: 3 },
  { hour: '13:00', appointmentQuantity: 3 },
] as TimeDTO[];
