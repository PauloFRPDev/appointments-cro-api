import { Router } from 'express';
import { getCustomRepository, Between } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import DeleteAppointmentService from '../services/DeleteAppointmentService';
import UpdateAppointmentStatusService from '../services/UpdateAppointmentStatusService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ensureIsProvider from '../middlewares/ensureIsProvider';

const providerAppointmentsRouter = Router();

providerAppointmentsRouter.use(ensureAuthenticated);
providerAppointmentsRouter.use(ensureIsProvider);

providerAppointmentsRouter.get(
  '/',
  ensureIsProvider,
  async (request, response) => {
    const { date } = request.query;

    const parsedDate = Number(date);

    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = date
      ? await appointmentsRepository.find({
          relations: ['user', 'status'],
          select: ['id', 'user_id', 'date', 'subject'],
          where: {
            date: Between(startOfDay(parsedDate), endOfDay(parsedDate)),
          },
          order: {
            date: 'ASC',
          },
        })
      : await appointmentsRepository.find({
          relations: ['user', 'status'],
          select: ['id', 'user_id', 'date', 'subject'],
          order: {
            date: 'ASC',
          },
        });

    return response.json(appointments);
  },
);

/**
 * Delete appointment updating the status to 5
 */
providerAppointmentsRouter.delete(
  '/:appointment_id',
  ensureIsProvider,
  async (request, response) => {
    const { appointment_id } = request.params;

    const deleteAppointment = new DeleteAppointmentService();

    await deleteAppointment.execute({
      appointment_id,
      status_id: 5,
    });

    return response.json({ success: 'Appointment canceled successfully' });
  },
);

providerAppointmentsRouter.patch(
  '/:appointment_id',
  ensureIsProvider,
  async (request, response) => {
    const { appointment_id } = request.params;
    const { status_id } = request.body;

    const updateAppointmentStatus = new UpdateAppointmentStatusService();

    await updateAppointmentStatus.execute({
      appointment_id,
      status_id,
    });

    return response.json({ success: 'Appointment updated' });
  },
);

export default providerAppointmentsRouter;
