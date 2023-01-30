import { FastifyInstance } from "fastify";

export const postsBatch = (fastify: FastifyInstance) => async (ids: any) => {
  const posts = await fastify.db.posts.findMany();

  const result = (ids as string[]).map((id) =>
    posts.filter((post) => post.userId === id)
  );

  return result;
};

export const profilesBatch = (fastify: FastifyInstance) => async (ids: any) => {
  const profiles = await fastify.db.profiles.findMany();

  const result = (ids as string[]).map((id) => {
    const profile = profiles.find((profile) => profile.userId === id);
    return profile || null;
  });

  return result;
};

export const subscribedToUserBatch =
  (fastify: FastifyInstance) => async (ids: any) => {
    const users = await fastify.db.users.findMany();

    const subscribedToUser = (ids as string[]).map((id) =>
      users.filter((user) => user.subscribedToUserIds.includes(id))
    );
    return subscribedToUser;
  };

export const userSubscribedToBatch =
  (fastify: FastifyInstance) => async (ids: any) => {
    const users = await fastify.db.users.findMany();

    const result = (ids as string[]).map((id) =>
      users.filter((user) => user.subscribedToUserIds.includes(id))
    );
    return result;
  };

export const membersBatch = (fastify: FastifyInstance) => async (ids: any) => {
  const memberTypes = await fastify.db.memberTypes.findMany();

  const result = (ids as string[]).map((id) => {
    const memberType = memberTypes.find((memberType) => memberType.id === id);
    return memberType || null;
  });

  return result;
};
