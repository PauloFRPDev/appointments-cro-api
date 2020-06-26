import { Router } from 'express';
import { getCustomRepository, MoreThan } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import DeleteAppointmentService from '../services/DeleteAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const { future } = request.query;

  // const [day, month, year] = dateSearched.split('/');

  // const parsedDate = parseISO(`${year}-${month}-${day}`);

  const appointments =
    future === 'true'
      ? await appointmentsRepository.find({
          select: ['id', 'date'],
          relations: ['status'],
          where: {
            user_id: request.user.id,
            date: MoreThan(new Date()),
          },
          order: {
            date: 'ASC',
          },
        })
      : await appointmentsRepository.find({
          select: ['id', 'date'],
          relations: ['status'],
          where: {
            user_id: request.user.id,
          },
          order: {
            date: 'ASC',
          },
        });

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { date, subject } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    user_id: request.user.id,
    date: parsedDate,
    subject,
    status_id: 1,
  });

  return response.json(appointment);
});

/**
 * Delete appointment updating the status to 5
 */
appointmentsRouter.delete('/:appointment_id', async (request, response) => {
  // TODO: the user can delete only if the appointment is for himself

  const { appointment_id } = request.params;

  const deleteAppointment = new DeleteAppointmentService();

  await deleteAppointment.execute({
    appointment_id,
    status_id: 5,
  });

  return response.json({ success: 'Appointment canceled successfully' });
});

export default appointmentsRouter;
