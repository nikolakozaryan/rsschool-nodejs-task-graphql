import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { IContext } from '../types/context.js';
import { ProfileType } from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';

export const ProfilesQueries: Record<string, GraphQLFieldConfig<unknown, IContext>> = {
  profiles: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
    resolve: async (_, __, { db, loaders: { profileLoader } }) => {
      const profiles = await db.profile.findMany();

      profiles.forEach((profile) => {
        profileLoader.prime(profile.id, profile);
      });

      return profiles;
    },
  },
  profile: {
    type: ProfileType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }: { id: string }, { db }) => {
      return db.profile.findUnique({ where: { id } });
    },
  },
};
