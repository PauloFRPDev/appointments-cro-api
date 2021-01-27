import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';
// import Mail from '../lib/Mail';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  isProvider: number;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
    password_confirmation,
    isProvider,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('E-mail adress already used');
    }

    if (!password_confirmation) {
      throw new AppError('You must give a password confirmation');
    }

    if (password !== password_confirmation) {
      throw new AppError("Password confirmation doesn't match");
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isProvider,
    });

    await usersRepository.save(user);

    // Mail.sendMail({
    //   to: `${user.name} <${user.email}>`,
    //   subject: 'Cadastro realizado com sucesso',
    //   text: 'Parabéns, você realizou o seu cadastro.',
    // });

    return user;
  }
}

export default CreateUserService;
