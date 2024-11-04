import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import { ChangeUserInputType, CreateUserInputType, UserType } from '../types/user.js';
import { UUIDType } from '../types/uuid.js';
import { IContext } from '../types/context.js';
import { Static } from '@sinclair/typebox';
import { createUserSchema } from '../../users/schemas.js';

export const UsersMutations: Record<string, GraphQLFieldConfig<unknown, IContext>> = {
  createUser: {
    type: new GraphQLNonNull(UserType),
    args: {
      dto: { type: new GraphQLNonNull(CreateUserInputType) },
    },
    resolve: async (
      _,
      { dto }: { dto: Static<(typeof createUserSchema)['body']> },
      { db, loaders: { userLoader } },
    ) => {
      const user = await db.user.create({
        data: dto,
      });

      userLoader.prime(user.id, user);

      return user;
    },
  },

  changeUser: {
    type: new GraphQLNonNull(UserType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeUserInputType) },
    },
    resolve: async (
      _,
      { id, dto }: { id: string; dto: Static<(typeof createUserSchema)['body']> },
      { db, loaders: { userLoader } },
    ) => {
      const user = await db.user.update({
        where: { id },
        data: dto,
      });

      userLoader.clear(id).prime(id, user);

      return user;
    },
  },

  deleteUser: {
    type: new GraphQLNonNull(GraphQLString),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }: { id: string }, { db, loaders: { userLoader } }) => {
      await db.user.delete({
        where: { id },
      });

      userLoader.clear(id);

      return `User ${id} deleted.`;
    },
  },

  subscribeTo: {
    type: new GraphQLNonNull(GraphQLString),
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (
      _,
      { userId, authorId }: { userId: string; authorId: string },
      { db, loaders: { userSubscribedToLoader, subscribedToUserLoader } },
    ) => {
      await db.subscribersOnAuthors.create({
        data: {
          subscriberId: userId,
          authorId,
        },
      });

      userSubscribedToLoader.clear(userId);
      subscribedToUserLoader.clear(authorId);

      return `Subscribed`;
    },
  },

  unsubscribeFrom: {
    type: new GraphQLNonNull(GraphQLString),
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (
      _,
      { userId, authorId }: { userId: string; authorId: string },
      { db, loaders: { userSubscribedToLoader, subscribedToUserLoader } },
    ) => {
      await db.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId,
          },
        },
      });

      userSubscribedToLoader.clear(userId);
      subscribedToUserLoader.clear(authorId);

      return `Unsubscribed`;
    },
  },
};
