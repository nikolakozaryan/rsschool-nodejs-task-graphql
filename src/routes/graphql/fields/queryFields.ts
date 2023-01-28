import { FastifyInstance } from "fastify";
import { GraphQLID, GraphQLList, GraphQLObjectType } from "graphql";
import {
  EntityTypes,
  getEntities,
  getEntity,
} from "../resolvers/query/getEntity";
import { MemberType } from "../types/query/MemberType";
import { Post } from "../types/query/Post";
import { Profile } from "../types/query/Profile";
import { User } from "../types/query/User";

export const getQueryFields = async (
  fastify: FastifyInstance
): Promise<GraphQLObjectType> =>
  new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      user: {
        type: User,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_, args) =>
          getEntity(EntityTypes.USER, args.id, fastify),
      },
      users: {
        type: new GraphQLList(User),
        resolve: () => getEntities(EntityTypes.USER, fastify),
      },
      post: {
        type: Post,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_, args) =>
          getEntity(EntityTypes.POST, args.id, fastify),
      },
      posts: {
        type: new GraphQLList(Post),
        resolve: () => getEntities(EntityTypes.POST, fastify),
      },
      profile: {
        type: Profile,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_, args) =>
          getEntity(EntityTypes.PROFILE, args.id, fastify),
      },
      profiles: {
        type: new GraphQLList(Profile),
        resolve: () => getEntities(EntityTypes.PROFILE, fastify),
      },
      membertype: {
        type: MemberType,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (_, args) =>
          getEntity(EntityTypes.MEMBER, args.id, fastify),
      },
      membertypes: {
        type: new GraphQLList(MemberType),
        resolve: () => getEntities(EntityTypes.MEMBER, fastify),
      },
    },
  });
