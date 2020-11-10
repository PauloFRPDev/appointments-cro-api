import { getCustomRepository, Between } from 'typeorm';
import {
  format,
  setSeconds,
  setMinutes,
  setHours,
  isAfter,
  startOfDay,
  endOfDay,
  addHours,
} from 'date-fns';

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
      const valueBeforeTimezone = setSeconds(
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

      const value =
        valueBeforeTimezone.getTimezoneOffset() === 180
          ? valueBeforeTimezone
          : addHours(valueBeforeTimezone, 1);

      return {
        time: time.hour,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          count < time.appointmentQuantity &&
          !format(value, "yyyy-MM-dd'T'HH:mm:ss-EEEExxx").includes(
            'Saturday',
          ) &&
          !format(value, "yyyy-MM-dd'T'HH:mm:ss-EEEExxx").includes('Sunday'),
      };
    });

    return availableDates;
  }
}

export default ListAvailableHoursService;
