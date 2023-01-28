import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { createProfile } from "../resolvers/mutation/Profile";
import { createUser } from "../resolvers/mutation/User";
import { cPost } from "../types/mutation/Post";
import { cProfile } from "../types/mutation/Profile";
import { cUser } from "../types/mutation/User";
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
      resolve: (_, args, context) => createUser(args.data, context),
    },
    createProfile: {
      type: Profile,
      args: {
        data: { type: new GraphQLNonNull(cProfile) },
      },
      resolve: (_, args, context) => createProfile(args.data, context),
    },
    createPost: {
      type: Post,
      args: {
        data: { type: new GraphQLNonNull(cPost) },
      },
      async resolve(_, args, fastify) {
        return fastify.db.posts.create(args.data);
      },
    },
  },
});
