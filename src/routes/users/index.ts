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
      const { id } = request.params;

      const user = await this.db.users.findOne({ key: "id", equals: id });
      if (!user) throw reply.notFound();

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

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id: curUserID } = request.params;
      const { userId: idSubscribeFor } = request.body;
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: curUserID,
      });
      const subscribe = await fastify.db.users.findOne({
        key: "id",
        equals: idSubscribeFor,
      });

      const usersExist = subscribe && user;
      if (!usersExist) throw reply.badRequest();

      const alreadySubscribed =
        subscribe.subscribedToUserIds.includes(curUserID);

      if (alreadySubscribed) {
        return subscribe;
      }

      const patchedUser = await this.db.users.change(idSubscribeFor, {
        subscribedToUserIds: [...subscribe.subscribedToUserIds, curUserID],
      });

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
      const { id: curUserID } = request.params;
      const { userId: idUnsubscribeFrom } = request.body;
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: curUserID,
      });
      const unsubscribe = await fastify.db.users.findOne({
        key: "id",
        equals: idUnsubscribeFrom,
      });

      const userExists = unsubscribe && user;

      if (!userExists) {
        throw reply.badRequest();
      }

      const userSubscribedToAnotherUser =
        unsubscribe.subscribedToUserIds.includes(curUserID);
      const selfUnsubscribe = idUnsubscribeFrom === curUserID;

      if (!userSubscribedToAnotherUser || selfUnsubscribe)
        throw reply.badRequest();

      const editedSubscriptions = unsubscribe.subscribedToUserIds.filter(
        (id) => id !== curUserID
      );

      const patchedUser = await this.db.users.change(idUnsubscribeFrom, {
        subscribedToUserIds: editedSubscriptions,
      });

      return patchedUser;
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
      const { id } = request.params;

      const user = await this.db.users.findOne({ key: "id", equals: id });
      if (!user) throw reply.badRequest();

      const userPosts = await this.db.posts.findMany({
        key: "userId",
        equals: id,
      });
      const userProfile = await this.db.profiles.findOne({
        key: "userId",
        equals: id,
      });
      const userFollowers = await this.db.users.findMany({
        key: "subscribedToUserIds",
        inArray: id,
      });

      if (userProfile) await this.db.profiles.delete(userProfile.id);
      await Promise.all(userPosts.map((post) => this.db.posts.delete(post.id)));
      await Promise.all(
        userFollowers.map((user) => {
          const subscriptions = user.subscribedToUserIds.filter(
            (item) => item !== id
          );

          return this.db.users.change(user.id, {
            subscribedToUserIds: subscriptions,
          });
        })
      );

      const deletedUser = await this.db.users.delete(id);
      return deletedUser;
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
      const { id } = request.params;
      const { body } = request;

      const user = await this.db.users.findOne({ key: "id", equals: id });
      if (!user) throw reply.badRequest();

      const patchedUser = await this.db.users.change(id, body);

      return patchedUser;
    }
  );
};

export default plugin;
