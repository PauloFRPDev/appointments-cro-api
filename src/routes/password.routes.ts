import { Router } from 'express';

import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';

const usersRouter = Router();

usersRouter.post('/forgot', async (request, response) => {
  const { email } = request.body;

  const sendForgotPasswordEmailService = new SendForgotPasswordEmailService();

  await sendForgotPasswordEmailService.execute({
    email,
  });

  return response.status(204).json();
});

export default usersRouter;
