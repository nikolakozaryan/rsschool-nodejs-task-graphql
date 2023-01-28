import { FastifyInstance } from "fastify";
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLString,
} from "graphql";
import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { MemberType } from "./MemberType";
import { Post } from "./Post";
import { Profile } from "./Profile";

export const User: GraphQLOutputType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: Profile,
      resolve: async (prev: UserEntity, _: any, context: FastifyInstance) =>
        context.db.profiles.findOne({
          key: "userId",
          equals: prev.id,
        }),
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (prev: UserEntity, _: any, context: FastifyInstance) =>
        await context.db.posts.findMany({
          key: "userId",
          equals: prev.id,
        }),
    },
    memberType: {
      type: MemberType,
      resolve: async (prev: UserEntity, _: any, context: FastifyInstance) => {
        const profile = await context.db.profiles.findOne({
          key: "userId",
          equals: prev.id,
        });

        if (!profile) return null;

        return context.db.memberTypes.findOne({
          key: "id",
          equals: profile.memberTypeId,
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (prev: UserEntity, _: any, context: FastifyInstance) =>
        context.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: prev.id,
        }),
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (prev: UserEntity, _: any, context: FastifyInstance) =>
        Promise.all(
          prev.subscribedToUserIds.map((id) =>
            context.db.users.findOne({
              key: "id",
              equals: id,
            })
          )
        ),
    },
  }),
});
