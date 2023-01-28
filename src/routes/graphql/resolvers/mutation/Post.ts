import { FastifyInstance } from "fastify";

export const createPost = async (data: any, fastify: FastifyInstance) => {
  const postAuthor = await fastify.db.users.findOne({
    key: "id",
    equals: data.userId,
  });

  if (!postAuthor)
    throw fastify.httpErrors.badRequest("Post author doesn't exist!");

  return fastify.db.posts.create(data);
};
