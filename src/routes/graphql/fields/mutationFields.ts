import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { updateMember } from "../resolvers/mutation/Member";
import { createPost, updatePost } from "../resolvers/mutation/Post";
import { createProfile, updateProfile } from "../resolvers/mutation/Profile";
import {
  createUser,
  subscribe,
  unsubscribe,
  updateUser,
} from "../resolvers/mutation/User";
import { uMemberType } from "../types/mutation/MemberType";
import { cPost, uPost } from "../types/mutation/Post";
import { cProfile, uProfile } from "../types/mutation/Profile";
import { cUser, uUser } from "../types/mutation/User";
import { MemberType } from "../types/query/MemberType";
import { Post } from "../types/query/Post";
import { Profile } from "../types/query/Profile";
import { User } from "../types/query/User";

export const Mutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    createUser: {
      type: User,
      args: {
        data: { type: new GraphQLNonNull(cUser) },
      },
      resolve: (_, args, context) => createUser(args.data, context.fastify),
    },
    createProfile: {
      type: Profile,
      args: {
        data: { type: new GraphQLNonNull(cProfile) },
      },
      resolve: (_, args, context) => createProfile(args.data, context.fastify),
    },
    createPost: {
      type: Post,
      args: {
        data: { type: new GraphQLNonNull(cPost) },
      },
      resolve: (_, args, context) => createPost(args.data, context.fastify),
    },
    updateUser: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: { type: uUser },
      },
      resolve: (_, args, context) => updateUser(args.id, args.data, context.fastify),
    },
    updateProfile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: { type: uProfile },
      },
      resolve: (_, args, context) => updateProfile(args.id, args.data, context.fastify),
    },
    updatePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: { type: uPost },
      },
      resolve: (_, args, context) => updatePost(args.id, args.data, context.fastify),
    },
    updateMemberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: { type: uMemberType },
      },
      resolve: (_, args, context) => updateMember(args.id, args.data, context.fastify),
    },
    subscribe: {
      type: User,
      args: {
        id: { type: GraphQLID },
        targetId: { type: GraphQLID },
      },
      resolve: (_, args, context) => subscribe(args.id, args.targetId, context.fastify),
    },
    unsubscribe: {
      type: User,
      args: {
        id: { type: GraphQLID },
        targetId: { type: GraphQLID },
      },
      resolve: (_, args, context) =>
        unsubscribe(args.id, args.targetId, context.fastify),
    },
  },
});
