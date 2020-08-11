import { getCustomRepository } from 'typeorm';
import { addHours, isAfter } from 'date-fns';

import AppError from '../errors/AppError';

import UsersRepository from '../repositories/UsersRepository';
import UserTokensRepository from '../repositories/UserTokensRepository';

import HashProvider from '../providers/HashProvider';

interface Request {
  token: string;
  password: string;
  password_confirmation: string;
}

class ResetPasswordService {
  public async execute({
    token,
    password,
    password_confirmation,
  }: Request): Promise<void | null> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const hashProvider = new HashProvider();

    const userToken = await userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    if (password !== password_confirmation) {
      throw new AppError('Password and password confirmation must match');
    }

    user.password = await hashProvider.generateHash(password);

    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
