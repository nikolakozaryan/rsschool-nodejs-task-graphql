import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    const profiles = await this.db.profiles.findMany();
    return profiles;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;

      const profile = await this.db.profiles.findOne({ key: "id", equals: id });
      if (!profile) throw reply.notFound();

      return profile as ProfileEntity;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { body } = request;
      const { userId } = body;

      const memberType = await this.db.memberTypes.findOne({
        key: "id",
        equals: body.memberTypeId,
      });

      const profile = await this.db.profiles.findOne({
        key: "userId",
        equals: userId,
      });

      if (profile || !memberType) throw reply.badRequest();

      const createdProfile = await this.db.profiles.create(body);
      return createdProfile;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;

      const profile = await this.db.profiles.findOne({ key: "id", equals: id });
      if (!profile) throw reply.badRequest();

      const deletedUser = await this.db.profiles.delete(id);
      return deletedUser;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const { body } = request;

      const profile = await this.db.profiles.findOne({ key: "id", equals: id });
      if (!profile) throw reply.badRequest();

      const patchedProfile = await this.db.profiles.change(id, body);
      return patchedProfile;
    }
  );
};

export default plugin;
