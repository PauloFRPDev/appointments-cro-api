import { Router } from 'express';
import { Between, getRepository } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';

import EnsureAuthenticated from '../middlewares/ensureAuthenticated';
import EnsureIsProvider from '../middlewares/ensureIsProvider';

import ServiceQueue from '../models/ServiceQueue';
import CreateServiceQueueService from '../services/CreateServiceQueueService';

const serviceQueueRouter = Router();

serviceQueueRouter.use(EnsureAuthenticated, EnsureIsProvider);

serviceQueueRouter.get('/', async (request, response) => {
  const serviceQueueRepository = getRepository(ServiceQueue);

  const serviceQueues = await serviceQueueRepository.find({
    relations: ['user', 'appointment', 'employee'],
    where: {
      created_at: Between(startOfDay(new Date()), endOfDay(new Date())),
    },
    order: {
      created_at: 'DESC',
    },
    take: 4,
  });

  const formattedServiceQueue = serviceQueues.map(serviceQueue => {
    return {
      id: serviceQueue.id,
      date: serviceQueue.appointment.date,
      employee: serviceQueue.employee.name,
      user: serviceQueue.user.name,
    };
  });

  return response.json(formattedServiceQueue);
});

serviceQueueRouter.post('/', async (request, response) => {
  const { user_id, appointment_id } = request.body;
  const employee_id = request.user.id;

  const createServiceQueueService = new CreateServiceQueueService();

  const serviceQueue = await createServiceQueueService.execute({
    user_id,
    employee_id,
    appointment_id,
  });

  return response.json(serviceQueue);
});

export default serviceQueueRouter;
