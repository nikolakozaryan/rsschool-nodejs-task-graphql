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
      resolve: async (source, args, context) =>
        getEntity(EntityTypes.USER, args.id, context.fastify),
    },
    users: {
      type: new GraphQLList(User),
      resolve: (source, args, context) =>
        getEntities(EntityTypes.USER, context.fastify),
    },
    post: {
      type: Post,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, context) =>
        getEntity(EntityTypes.POST, args.id, context.fastify),
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: (source, args, context) =>
        getEntities(EntityTypes.POST, context.fastify),
    },
    profile: {
      type: Profile,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, context) =>
        getEntity(EntityTypes.PROFILE, args.id, context.fastify),
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve: (source, args, context) =>
        getEntities(EntityTypes.PROFILE, context.fastify),
    },
    membertype: {
      type: MemberType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, args, context) =>
        getEntity(EntityTypes.MEMBER, args.id, context.fastify),
    },
    membertypes: {
      type: new GraphQLList(MemberType),
      resolve: (source, args, context) =>
        getEntities(EntityTypes.MEMBER, context.fastify),
    },
  },
});
