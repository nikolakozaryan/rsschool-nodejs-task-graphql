import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    const users = await this.db.users.findMany();
    return users;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.id;
      const user = await this.db.users.findOne(id);

      if (!user) reply.notFound("No such user!");

      return user as UserEntity;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const body = request.body;

      const creeatedUser = await this.db.users.create(body);
      return creeatedUser;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request;
      const deletedUser = await this.db.users.delete(id);
      return deletedUser;
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request;
      const { userId } = request.body;

      const user = (await this.db.users.findOne(id)) as UserEntity;
      user.subscribedToUserIds.push(userId);

      const patchedUser = await this.db.users.change(id, user);
      return patchedUser;
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request;
      const { userId } = request.body;

      const user = (await this.db.users.findOne(id)) as UserEntity;
      user.subscribedToUserIds = user.subscribedToUserIds.filter(
        (id) => id !== userId
      );

      const patchedUser = await this.db.users.change(id, user);
      return patchedUser;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id, body } = request;
      const patchedUser = await this.db.users.change(id, body);

      return patchedUser;
    }
  );
};

export default plugin;
