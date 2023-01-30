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

export const updatePost = async (
  postId: string,
  data: any,
  fastify: FastifyInstance
) => {
  const post = await fastify.db.posts.findOne({ key: "id", equals: postId });
  if (!post) throw fastify.httpErrors.badRequest();

  const patchedPost = await fastify.db.posts.change(postId, data);
  return patchedPost;
};
