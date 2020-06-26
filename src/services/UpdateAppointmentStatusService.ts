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
      throw new AppError('Appointment does not exists', 400);
    }

    if (!status_id) {
      throw new AppError('You must insert a status code to update it', 400);
    }

    if (appointment.status_id === status_id) {
      throw new AppError('Appointment already has this status', 400);
    }

    const updatedAppointment = await appointmentsRepository.save({
      ...appointment,
      status_id,
    });

    return updatedAppointment;
  }
}

export default DeleteAppointmentService;
