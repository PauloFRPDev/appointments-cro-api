import { isBefore, setSeconds } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  user_id: string;
  date: Date;
  subject: string;
  status_id: number;
}

class CreateAppointmentService {
  public async execute({
    user_id,
    date,
    subject,
    status_id,
  }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = setSeconds(date, 0);

    if (isBefore(appointmentDate, new Date())) {
      throw new AppError(
        'You can not book an appointment before the actual date',
      );
    }

    const findAppointmentsInSameDate = await appointmentsRepository.findByDateAndNotCanceled(
      appointmentDate,
    );

    if (findAppointmentsInSameDate.length >= 4) {
      throw new AppError('All available times are already booked.');
    }

    const appointment = appointmentsRepository.create({
      user_id,
      date: appointmentDate,
      subject,
      status_id,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
