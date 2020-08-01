import { getCustomRepository, Between } from 'typeorm';
import {
  format,
  setSeconds,
  setMinutes,
  setHours,
  isAfter,
  startOfDay,
  endOfDay,
} from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  date: string;
}

interface AvailableDate {
  time: string;
  value: string;
  available: boolean;
}

class CreateUserService {
  public async execute({ date }: Request): Promise<AvailableDate[]> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const searchDate = Number(date);

    const appointments = await appointmentsRepository.find({
      where: {
        date: Between(startOfDay(searchDate), endOfDay(searchDate)),
      },
    });

    const schedule = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
    ];

    const availableDates = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, Number(hour)), Number(minute)),
        0,
      );

      let count = 0;

      appointments.forEach(appointment => {
        if (
          format(appointment.date, 'HH:mm') === time &&
          appointment.status_id !== 5
        ) {
          if (
            String(format(appointment.date, 'HH:mm')).includes('12:00') ||
            String(format(appointment.date, 'HH:mm')).includes('13:00')
          ) {
            count += 2;
          } else {
            count += 1;
          }
        }
      });

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          count < 2 &&
          !format(value, "yyyy-MM-dd'T'HH:mm:ssxxx-EEEE").includes(
            'Saturday',
          ) &&
          !format(value, "yyyy-MM-dd'T'HH:mm:ssxxx-EEEE").includes('Sunday'),
      };
    });

    return availableDates;
  }
}

export default CreateUserService;
