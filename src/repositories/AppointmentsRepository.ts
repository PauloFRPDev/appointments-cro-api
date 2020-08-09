import { EntityRepository, Repository, Not } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment[] | []> {
    const findAppointment = await this.find({
      where: { date },
    });

    return findAppointment || [];
  }

  public async findByDateAndNotCanceled(
    date: Date,
    sector_id: number,
  ): Promise<Appointment[] | []> {
    const findAppointment = await this.find({
      where: { date, status_id: Not(5), sector_id },
    });

    return findAppointment || [];
  }

  public async findById(id: string): Promise<Appointment | null> {
    const findAppointmentById = await this.find({
      where: { id },
    });

    return findAppointmentById[0] || null;
  }
}

export default AppointmentsRepository;
