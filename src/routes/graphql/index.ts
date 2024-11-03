import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
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
    async handler(req) {
      const reqQuery = String(req.body.query);

      const query = new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
          ...MemberTypesQueries,
          ...PostsQueries,
          ...ProfilesQueries,
          ...UsersQueries,
        }),
      });

      const mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
          ...PostsMutations,
          ...ProfilesMutations,
          ...UsersMutations,
        }),
      });

      const schema = new GraphQLSchema({ query, mutation });

      const errors = validate(schema, parse(reqQuery), [depthLimit(5)]);

      if (errors.length) return { errors };

      return await graphql({
        schema,
        source: reqQuery,
        variableValues: req.body.variables,
        contextValue: { db: prisma },
      });
    },
  });
};

export default plugin;
