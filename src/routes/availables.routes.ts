import { Router } from 'express';

import ListAvailableHoursService from '../services/ListAvailableHoursService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const availablesRouter = Router();

availablesRouter.use(ensureAuthenticated);

availablesRouter.get('/', async (request, response) => {
  const { date, sector_id } = request.query;

  const listAppointments = new ListAvailableHoursService();

  const available = await listAppointments.execute({
    date: String(date),
    sector_id: Number(sector_id),
  });

  return response.json(available);
});

export default availablesRouter;
