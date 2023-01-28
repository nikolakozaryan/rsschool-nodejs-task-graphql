import { FastifyInstance } from "fastify";

export const createProfile = async (data: any, fastify: FastifyInstance) => {
  const memberType = await fastify.db.memberTypes.findOne({
    key: "id",
    equals: data.memberTypeId,
  });

  const user = await fastify.db.users.findOne({
    key: "id",
    equals: data.userId,
  });

  const profile = await fastify.db.profiles.findOne({
    key: "userId",
    equals: data.userId,
  });

  if (profile || !user || !memberType) throw fastify.httpErrors.badRequest('Something went wrong');

  return fastify.db.profiles.create(data);
};
