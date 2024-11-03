import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { MemberTypesQuery } from './member-types/queries.js';
import { PostsQuery } from './posts/queries.js';
import { ProfilesQuery } from './profiles/queries.js';
import { StatsQuery } from './stats/queries.js';
import { UsersQuery } from './users/queries.js';

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
          ...MemberTypesQuery,
          ...PostsQuery,
          ...ProfilesQuery,
          ...StatsQuery,
          ...UsersQuery,
        }),
      });

      const mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({}),
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
