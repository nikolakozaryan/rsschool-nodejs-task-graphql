import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    const posts = await this.db.posts.findMany();
    return posts;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      const post = await this.db.posts.findOne({ key: "id", equals: id });

      if (!post) throw reply.notFound();
      return post as PostEntity;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { body } = request;

      const createdPost = await this.db.posts.create(body);
      return createdPost;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;

      const post = await this.db.posts.findOne({ key: "id", equals: id });
      if (!post) throw reply.badRequest();

      const deletedPost = await this.db.posts.delete(id);
      return deletedPost;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { body } = request;
      const { id } = request.params;

      const post = await this.db.posts.findOne({ key: "id", equals: id });
      if (!post) throw reply.badRequest();

      const patchedPost = await this.db.posts.change(id, body);
      return patchedPost;
    }
  );
};

export default plugin;
