import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLError,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  specifiedRules,
  validate,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { generateLoaders } from './loaders/loaders.js';
import { MemberTypesQueries } from './queries/member-type.queries.js';
import { PostsQueries } from './queries/post.queries.js';
import { ProfilesQueries } from './queries/profile.queries.js';
import { UsersQueries } from './queries/user.queries.js';
import { PostsMutations } from './mutations/post.mutations.js';
import { ProfilesMutations } from './mutations/profile.mutations.js';
import { UsersMutations } from './mutations/user.mutations.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    handler: async (req) => {
        const reqQuery = String(req.body.query);

        const query = new GraphQLObjectType({
          name: 'RootQueryType',
          fields: {
            ...MemberTypesQueries,
            ...UsersQueries,
            ...PostsQueries,
            ...ProfilesQueries,
          },
        });

        const mutation = new GraphQLObjectType({
          name: 'Mutations',
          fields: {
            ...PostsMutations,
            ...ProfilesMutations,
            ...UsersMutations,
          },
        });

        const schema = new GraphQLSchema({ query, mutation });

        const loaders = generateLoaders(prisma);

        const errors = validate(schema, parse(reqQuery), [
          ...specifiedRules,
          depthLimit(5),
        ]);

        if (errors.length) return { errors };

        return graphql({
          schema,
          source: reqQuery,
          variableValues: req.body.variables,
          contextValue: { db: prisma, loaders },
        });
      
    },
  });
};

export default plugin;
