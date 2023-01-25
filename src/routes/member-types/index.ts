import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    const memberTypes = await this.db.memberTypes.findMany();
    return memberTypes;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { id } = request.params;

      const memberType = await this.db.memberTypes.findOne({
        key: "id",
        equals: id,
      });

      if (!memberType) throw reply.notFound();

      return memberType as MemberTypeEntity;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { body } = request;
      const { id } = request.params;

      const memberType = await this.db.memberTypes.findOne({
        key: "id",
        equals: id,
      });

      if (!memberType) throw reply.badRequest();

      const patchedMemberType = await this.db.memberTypes.change(id, body);
      return patchedMemberType;
    }
  );
};

export default plugin;
