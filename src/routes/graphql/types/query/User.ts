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
      resolve: async (source: UserEntity, _: any, context) =>
        context.profilesLoader.load(source.id),
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (source: UserEntity, _, context) =>
        context.postsLoader.load(source.id),
    },
    memberType: {
      type: MemberType,
      resolve: async (source: UserEntity, _, context) => {
        const profile = await context.profilesLoader.load(source.id);

        return profile
          ? context.membersLoader.load(profile.memberTypeId)
          : null;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (source: UserEntity, _, context) =>
        context.userSubscribedToLoader.load(source.id),
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (source: UserEntity, _, context) =>
        context.subscribedToUserLoader.load(source.id),
    },
  }),
});
