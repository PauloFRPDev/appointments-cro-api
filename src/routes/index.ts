import { Router } from 'express';

import appointmentsRouter from './appointments.routes';
import providerAppointmentsRouter from './providerAppointments.routes';
import availablesRouter from './availables.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/api/appointments', appointmentsRouter);
routes.use('/api/provider/appointments', providerAppointmentsRouter);
routes.use('/api/availables', availablesRouter);
routes.use('/api/users', usersRouter);
routes.use('/api/sessions', sessionsRouter);

export default routes;
