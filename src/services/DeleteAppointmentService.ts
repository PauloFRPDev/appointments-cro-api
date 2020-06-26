import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  appointment_id: string;
  status_id: number;
}

class DeleteAppointmentService {
  public async execute({
    appointment_id,
    status_id,
  }: Request): Promise<Appointment | null> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointment = await appointmentsRepository.findById(appointment_id);

    if (!appointment) {
      return null;
    }

    if (appointment.status_id === 5) {
      throw new AppError('Appointment already deleted', 400);
    }

    const updatedAppointment = await appointmentsRepository.save({
      ...appointment,
      status_id,
    });

    return updatedAppointment;
  }
}

export default DeleteAppointmentService;
