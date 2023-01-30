import { FastifyInstance } from "fastify";

export const updateMember = async (
  memberId: string,
  data: any,
  fastify: FastifyInstance
) => {
  const memberType = await fastify.db.memberTypes.findOne({
    key: "id",
    equals: memberId,
  });

  if (!memberType) throw fastify.httpErrors.badRequest();

  const patchedMemberType = await fastify.db.memberTypes.change(memberId, data);
  return patchedMemberType;
};
