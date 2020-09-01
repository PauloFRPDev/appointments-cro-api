import { Router } from 'express';
import { getCustomRepository, Between, In } from 'typeorm';
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
    const { date, sector } = request.query;

    const parsedDate = Number(date);

    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = date
      ? await appointmentsRepository.find({
          relations: ['user', 'status', 'sector'],
          select: ['id', 'user_id', 'date', 'subject', 'sector_id', 'sector'],
          where: {
            date: Between(startOfDay(parsedDate), endOfDay(parsedDate)),
            sector_id:
              Number(sector) === 2 || Number(sector) === 3
                ? In([2, 3])
                : sector,
          },
          order: {
            date: 'ASC',
          },
        })
      : await appointmentsRepository.find({
          relations: ['user', 'status', 'sector'],
          select: ['id', 'user_id', 'date', 'subject', 'sector_id', 'sector'],
          where: {
            sector_id:
              Number(sector) === 2 || Number(sector) === 3
                ? In([2, 3])
                : sector,
          },
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
