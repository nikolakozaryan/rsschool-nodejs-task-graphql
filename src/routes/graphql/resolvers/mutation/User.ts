import { FastifyInstance } from "fastify";

export const createUser = async (data: any, fastify: FastifyInstance) =>
  fastify.db.users.create(data);

export const updateUser = async (
  userId: string,
  data: any,
  fastify: FastifyInstance
) => {
  const user = await fastify.db.users.findOne({ key: "id", equals: userId });

  if (!user) throw fastify.httpErrors.badRequest();

  const patchedUser = await fastify.db.users.change(userId, data);
  return patchedUser;
};

export const subscribe = async (
  userId: string,
  subscribeToId: string,
  fastify: FastifyInstance
) => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: userId,
  });
  const subscribe = await fastify.db.users.findOne({
    key: "id",
    equals: subscribeToId,
  });

  if (!(subscribe && user)) throw fastify.httpErrors.badRequest();

  const alreadySubscribed = subscribe.subscribedToUserIds.includes(userId);

  if (alreadySubscribed) {
    return subscribe;
  }

  const patchedUser = await fastify.db.users.change(subscribeToId, {
    subscribedToUserIds: [...subscribe.subscribedToUserIds, userId],
  });

  return patchedUser;
};

export const unsubscribe = async (
  userId: string,
  unsubscribeFromId: string,
  fastify: FastifyInstance
) => {
  const user = await fastify.db.users.findOne({
    key: "id",
    equals: userId,
  });
  const unsubscribe = await fastify.db.users.findOne({
    key: "id",
    equals: unsubscribeFromId,
  });

  if (!(unsubscribe && user)) {
    throw fastify.httpErrors.badRequest();
  }

  const userSubscribedToAnotherUser =
    unsubscribe.subscribedToUserIds.includes(userId);
  const selfUnsubscribe = unsubscribeFromId === userId;

  if (!userSubscribedToAnotherUser || selfUnsubscribe)
    throw fastify.httpErrors.badRequest();

  const editedSubscriptions = unsubscribe.subscribedToUserIds.filter(
    (id) => id !== userId
  );

  const patchedUser = await fastify.db.users.change(unsubscribeFromId, {
    subscribedToUserIds: editedSubscriptions,
  });

  return patchedUser;
};
