import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql } from "graphql/graphql";
import { GraphQLSchema } from "graphql/type";
import { Mutation } from "./fields/mutationFields";
import { Query } from "./fields/queryFields";
import { graphqlBodySchema } from "./schema";
import { validate } from "graphql/validation";
import depthLimit = require("graphql-depth-limit");
import { parse } from "graphql";

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

      const schema: GraphQLSchema = new GraphQLSchema({
        query: Query,
        mutation: Mutation,
      });

      const result = await graphql({
        schema,
        source: src as string,
        contextValue: fastify,
        variableValues: variables,
      });

      const errors = validate(schema, parse(src as string), [depthLimit(6)]);

      if (errors.length) {
        throw this.httpErrors.badRequest("Query depth limit exceeded!");
      }
      
      return result;
    }
  );
};

export default plugin;
