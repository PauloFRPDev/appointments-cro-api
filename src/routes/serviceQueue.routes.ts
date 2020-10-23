import { Router } from 'express';
import { getRepository } from 'typeorm';

import EnsureAuthenticated from '../middlewares/ensureAuthenticated';
import EnsureIsProvider from '../middlewares/ensureIsProvider';

import ServiceQueue from '../models/ServiceQueue';
import CreateServiceQueueService from '../services/CreateServiceQueueService';

const serviceQueueRouter = Router();

serviceQueueRouter.use(EnsureAuthenticated, EnsureIsProvider);

serviceQueueRouter.get('/', async (request, response) => {
  const serviceQueueRepository = getRepository(ServiceQueue);

  const serviceQueues = await serviceQueueRepository.find();

  return response.json(serviceQueues);
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
