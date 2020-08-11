import { getCustomRepository } from 'typeorm';
import path from 'path';

import AppError from '../errors/AppError';

import UsersRepository from '../repositories/UsersRepository';
import UserTokensRepository from '../repositories/UserTokensRepository';

import MailProvider from '../providers/MailProvider';

interface Request {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: Request): Promise<void | null> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { token } = await userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'MailTemplates',
      'forgot_password.hbs',
    );

    const mailProvider = new MailProvider();

    await mailProvider.sendMail({
      to: user.email,
      subject: '[CRO-RJ] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.WEB_URL}/reset-password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
