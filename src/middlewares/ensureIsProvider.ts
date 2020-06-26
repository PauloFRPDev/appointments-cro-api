import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import UsersRepository from '../repositories/UsersRepository';

export default async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const userId = request.user.id;

  if (!userId) {
    throw new AppError('You must be logged in.', 400);
  }

  const usersRepository = getCustomRepository(UsersRepository);

  try {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User does not exists', 400);
    }

    if (user.isProvider !== 1) {
      throw new Error();
    }

    return next();
  } catch {
    throw new AppError('You must be a provider', 401);
  }
}
