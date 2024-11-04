import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { MemberTypeIdEnum, MemberTypeType } from '../types/member-type.js';
import { IContext } from '../types/context.js';
import { MemberTypeId, memberTypeSchema } from '../../member-types/schemas.js';
import { Static } from '@sinclair/typebox';

export type Member = Static<typeof memberTypeSchema>;

export const MemberTypesQueries: Record<string, GraphQLFieldConfig<unknown, IContext>> = {
  memberTypes: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
    resolve: async (_, args, { db }) => {
      return db.memberType.findMany();
    },
  },
  memberType: {
    type: MemberTypeType,
    args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
    resolve: async (_, { id }: { id: MemberTypeId }, { db }) => {
      return db.memberType.findUnique({ where: { id } });
    },
  },
};
