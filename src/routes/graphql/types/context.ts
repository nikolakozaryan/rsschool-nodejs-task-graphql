import { PrismaClient } from '@prisma/client';
import { LoadersType } from '../loaders/loaders.js';

export interface IContext {
  db: PrismaClient;
  loaders: LoadersType;
}
