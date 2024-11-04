import { GraphQLNonNull, GraphQLList, GraphQLFieldConfig } from 'graphql';
import { UserType } from '../types/user.js';
import { IContext } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

export const UsersQueries: Record<string, GraphQLFieldConfig<unknown, IContext>> = {
  users: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async (_, __, { db, loaders: { userLoader } }, info) => {
      const parsedInfo = parseResolveInfo(info);

      if (!parsedInfo?.fieldsByTypeName.User) {
        return db.user.findMany();
      }

      const fields = parsedInfo.fieldsByTypeName.User;

      const include = {
        ...(fields['profile'] ? { profile: true } : {}),
        ...(fields['posts'] ? { posts: true } : {}),
        ...(fields['userSubscribedTo'] ? { userSubscribedTo: true } : {}),
        ...(fields['subscribedToUser'] ? { subscribedToUser: true } : {}),
      };

      const users = await db.user.findMany({ include });

      users.forEach((user) => {
        userLoader.prime(user.id, user);
      });

      return users;
    },
  },
  user: {
    type: UserType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }: { id: string }, { db }) => {
      return db.user.findUnique({ where: { id } });
    },
  },
};
