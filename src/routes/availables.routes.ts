import { Router } from 'express';

import ListAvailableHoursService from '../services/ListAvailableHoursService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const availablesRouter = Router();

availablesRouter.use(ensureAuthenticated);

availablesRouter.get('/', async (request, response) => {
  const { date } = request.query;

  const listAppointments = new ListAvailableHoursService();

  const available = await listAppointments.execute({
    date: String(date),
  });

  return response.json(available);
});

export default availablesRouter;
