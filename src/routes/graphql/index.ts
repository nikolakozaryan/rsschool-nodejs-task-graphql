import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql } from "graphql/graphql";
import { GraphQLSchema } from "graphql/type";
import { Mutation } from "./fields/mutationFields";
import { Query } from "./fields/queryFields";
import { graphqlBodySchema } from "./schema";

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
        query: Query,
        mutation: Mutation,
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
