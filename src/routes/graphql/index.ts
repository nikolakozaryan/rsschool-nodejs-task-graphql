import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql } from "graphql/graphql";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql/type";
import { GraphQLNonNull } from "graphql/type/definition";
import { getQueryFields } from "./fields/queryFields";
import { graphqlBodySchema } from "./schema";
import { User } from "./types/query/User";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query: src, variables } = request.body;

      const schema = new GraphQLSchema({
        query: await getQueryFields(fastify),
        mutation: new GraphQLObjectType({
          name: "RootMutation",
          fields: {
            createUser: {
              type: User,
              args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
              },
              async resolve(_, args) {
                const user = await fastify.db.users.create({
                  firstName: args.firstName,
                  lastName: args.lastName,
                  email: args.email,
                });

                return user;
              },
            },
          },
        }),
      });

      const result = await graphql({
        schema,
        source: src as string,
        contextValue: fastify,
        variableValues: variables,
      });

      return result;
    }
  );
};

export default plugin;
