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

export const Query = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: User,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (prev, args, fastify) =>
        getEntity(EntityTypes.USER, args.id, fastify),
    },
    users: {
      type: new GraphQLList(User),
      resolve: (prev, args, fastify) => getEntities(EntityTypes.USER, fastify),
    },
    post: {
      type: Post,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, fastify) =>
        getEntity(EntityTypes.POST, args.id, fastify),
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: (prev, args, fastify) => getEntities(EntityTypes.POST, fastify),
    },
    profile: {
      type: Profile,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, fastify) =>
        getEntity(EntityTypes.PROFILE, args.id, fastify),
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve: (prev, args, fastify) =>
        getEntities(EntityTypes.PROFILE, fastify),
    },
    membertype: {
      type: MemberType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, fastify) =>
        getEntity(EntityTypes.MEMBER, args.id, fastify),
    },
    membertypes: {
      type: new GraphQLList(MemberType),
      resolve: (prev, args, fastify) =>
        getEntities(EntityTypes.MEMBER, fastify),
    },
  },
});
