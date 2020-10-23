import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import ServiceQueue from '../models/ServiceQueue';

import UsersRepository from '../repositories/UsersRepository';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestData {
  user_id: string;
  employee_id: string;
  appointment_id: string;
}

class CreateServiceQueueService {
  public async execute({
    user_id,
    employee_id,
    appointment_id,
  }: RequestData): Promise<ServiceQueue> {
    const usersRepository = getCustomRepository(UsersRepository);
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const servicesQueueRepository = getRepository(ServiceQueue);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const employee = await usersRepository.findOne(employee_id);

    if (!employee) {
      throw new AppError('Employee does not exists');
    }

    const appointment = await appointmentsRepository.findOne(appointment_id);

    if (!appointment) {
      throw new AppError('Appointment does not exists');
    }

    const serviceQueue = servicesQueueRepository.create({
      user_id,
      employee_id,
      appointment_id,
      isCalling: 0,
    });

    await servicesQueueRepository.save(serviceQueue);

    return serviceQueue;
  }
}

export default CreateServiceQueueService;
