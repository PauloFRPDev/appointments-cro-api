import { isBefore, setSeconds, format } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import { AttendanceHour, LibraryHour, TimeDTO } from '../config/available';

interface Request {
  user_id: string;
  date: Date;
  subject: string;
  status_id: number;
  sector_id: number;
}

class CreateAppointmentService {
  public async execute({
    user_id,
    date,
    subject,
    status_id,
    sector_id,
  }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = setSeconds(date, 0);

    if (isBefore(appointmentDate, new Date())) {
      throw new AppError(
        'You can not book an appointment before the actual date',
      );
    }

    if (!sector_id) {
      throw new AppError('You must select an sector');
    }

    const findAppointmentsInSameDateAndSector = await appointmentsRepository.findByDateAndNotCanceled(
      appointmentDate,
      sector_id,
    );

    let sectorDaySchedule = [] as TimeDTO[];

    switch (sector_id) {
      case 1:
        sectorDaySchedule = AttendanceHour;
        break;
      case 2:
        sectorDaySchedule = LibraryHour;
        break;
      default:
        break;
    }

    const parsedTime = format(date, 'HH:mm');

    const selectedHour = sectorDaySchedule.find(
      time => time.hour === parsedTime,
    );

    if (
      findAppointmentsInSameDateAndSector.length >=
      Number(selectedHour?.appointmentQuantity)
    ) {
      throw new AppError('All available times are already booked.');
    }

    const appointment = appointmentsRepository.create({
      user_id,
      date: appointmentDate,
      subject,
      status_id,
      sector_id,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
