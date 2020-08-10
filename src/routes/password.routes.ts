import { Router } from 'express';

import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';
import ResetPasswordService from '../services/ResetPasswordService';

const passwordRouter = Router();

passwordRouter.post('/forgot', async (request, response) => {
  const { email } = request.body;

  const sendForgotPasswordEmailService = new SendForgotPasswordEmailService();

  await sendForgotPasswordEmailService.execute({
    email,
  });

  return response.status(204).json();
});

passwordRouter.post('/reset', async (request, response) => {
  const { token, password } = request.body;

  const resetPassword = new ResetPasswordService();

  await resetPassword.execute({
    token,
    password,
  });

  return response.status(204).json();
});

export default passwordRouter;
