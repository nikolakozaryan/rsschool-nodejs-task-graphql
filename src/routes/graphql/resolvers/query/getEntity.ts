import { FastifyInstance } from "fastify";
import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../../../utils/DB/entities/DBUsers";

export enum EntityTypes {
  USER = "User",
  POST = "Post",
  PROFILE = "Profile",
  MEMBER = "MemberType",
}

type Entity = UserEntity | PostEntity | MemberTypeEntity | ProfileEntity;

export const getEntities = async (
  entityType: EntityTypes,
  fastify: FastifyInstance
): Promise<Entity[]> => {
  switch (entityType) {
    case EntityTypes.MEMBER:
      return fastify.db.memberTypes.findMany();
      break;
    case EntityTypes.USER:
      return fastify.db.users.findMany();
      break;
    case EntityTypes.PROFILE:
      return fastify.db.profiles.findMany();
      break;
    case EntityTypes.POST:
      return fastify.db.posts.findMany();
      break;
  }
};

export const getEntity = async (
  entityType: EntityTypes,
  id: string,
  fastify: FastifyInstance
): Promise<Entity> => {
  let entity: Entity | null;

  switch (entityType) {
    case EntityTypes.MEMBER:
      entity = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: id,
      });
      break;
    case EntityTypes.USER:
      entity = await fastify.db.users.findOne({
        key: "id",
        equals: id,
      });
      break;
    case EntityTypes.PROFILE:
      entity = await fastify.db.profiles.findOne({
        key: "id",
        equals: id,
      });
      break;
    case EntityTypes.POST:
      entity = await fastify.db.posts.findOne({
        key: "id",
        equals: id,
      });
      break;
  }

  if (!entity) throw fastify.httpErrors.notFound(`${entityType} not found`);

  return entity;
};
