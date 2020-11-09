import { getCustomRepository, Between } from 'typeorm';
import {
  setSeconds,
  setMinutes,
  setHours,
  isAfter,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';

import {
  AttendanceHour,
  LibraryHour,
  TimeDTO,
  LibraryStudyHour,
} from '../config/available';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  date: string;
  sector_id: number;
}

interface AvailableDate {
  time: string;
  value: string;
  available: boolean;
}

class ListAvailableHoursService {
  public async execute({ date, sector_id }: Request): Promise<AvailableDate[]> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const searchDate = Number(date);

    const appointments = await appointmentsRepository.find({
      where: {
        date: Between(startOfDay(searchDate), endOfDay(searchDate)),
        sector_id,
      },
    });

    let schedule = [] as TimeDTO[];

    switch (sector_id) {
      case 1:
        schedule = AttendanceHour;
        break;
      case 2:
        schedule = LibraryHour;
        break;
      case 3:
        schedule = LibraryStudyHour;
        break;
      default:
        break;
    }

    const availableDates = schedule.map(time => {
      const [hour, minute] = time.hour.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, Number(hour)), Number(minute)),
        0,
      );

      let count = 0;

      appointments.forEach(appointment => {
        if (
          format(appointment.date, 'HH:mm') === time.hour &&
          appointment.status_id !== 5
        ) {
          count += 1;
        }
      });

      return {
        time: time.hour,
        value: format(
          utcToZonedTime(value, 'America/Sao_Paulo'),
          "yyyy-MM-dd'T'HH:mm:ssxxx",
          { timeZone: 'America/Sao_Paulo' },
        ),
        available:
          isAfter(value, new Date()) &&
          count < time.appointmentQuantity &&
          !format(value, "yyyy-MM-dd'T'HH:mm:ss-EEEExxx").includes(
            'Saturday',
          ) &&
          !format(value, "yyyy-MM-dd'T'HH:mm:ss-EEEExxx").includes('Sunday'),
      };
    });

    console.log(availableDates);

    return availableDates;
  }
}

export default ListAvailableHoursService;
