import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';
import { IContext } from './context.js';
import { Static } from '@sinclair/typebox';
import { userSchema } from '../../users/schemas.js';
import { PostType } from './post.js';

export type User = Static<typeof userSchema>;

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: async (parent, _, { loaders: { profileLoader } }: IContext) => {
        return profileLoader.load(parent.id);
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (parent, _, { loaders: { postsByAuthorLoader } }: IContext) => {
        return postsByAuthorLoader.load(parent.id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, _, { loaders: { userLoader, userSubscribedToLoader } }) => {
        if (parent.userSubscribedTo) {
          const authorIds = parent.userSubscribedTo.map(
            (sub) => sub.authorId,
          ) as string[];

          const authors = await userLoader.loadMany(authorIds);

          return authors;
        }

        return userSubscribedToLoader.load(parent.id);
      },
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        parent,
        _,
        { loaders: { userLoader, subscribedToUserLoader } }: IContext,
      ) => {
        if (parent.subscribedToUser) {
          const subscriberIds = parent.subscribedToUser.map((sub) => sub.userId);

          const subscribers = await userLoader.loadMany(subscriberIds);

          return subscribers;
        }

        return subscribedToUserLoader.load(parent.id);
      },
    },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: { name: { type: GraphQLString }, balance: { type: GraphQLFloat } },
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});
