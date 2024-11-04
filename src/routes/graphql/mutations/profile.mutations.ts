import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import {
  ChangeProfileInputType,
  CreateProfileInputType,
  ProfileType,
} from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';
import { IContext } from '../types/context.js';
import { Static } from '@sinclair/typebox';
import { createProfileSchema } from '../../profiles/schemas.js';

export const ProfilesMutations: Record<string, GraphQLFieldConfig<unknown, IContext>> = {
  createProfile: {
    type: new GraphQLNonNull(ProfileType),
    args: {
      dto: { type: new GraphQLNonNull(CreateProfileInputType) },
    },
    resolve: async (
      _,
      { dto }: { dto: Static<(typeof createProfileSchema)['body']> },
      { db, loaders: { profileLoader } },
    ) => {
      const profile = await db.profile.create({
        data: dto,
      });

      profileLoader.prime(profile.id, profile);

      return profile;
    },
  },

  changeProfile: {
    type: new GraphQLNonNull(ProfileType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
    },
    resolve: async (
      _,
      { id, dto }: { id: string; dto: Static<(typeof createProfileSchema)['body']> },
      { db, loaders: { profileLoader } },
    ) => {
      const profile = await db.profile.update({
        where: { id },
        data: dto,
      });

      profileLoader.clear(profile.userId).prime(profile.userId, profile);

      return profile;
    },
  },

  deleteProfile: {
    type: new GraphQLNonNull(GraphQLString),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }: { id: string }, { db, loaders: { profileLoader } }) => {
      await db.profile.delete({
        where: { id },
      });

      profileLoader.clear(id);

      return `Profile ${id} deleted.`;
    },
  },
};
