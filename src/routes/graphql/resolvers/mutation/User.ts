import { FastifyInstance } from "fastify";

export const createUser = async (data: any, fastify: FastifyInstance) =>
  fastify.db.users.create(data);