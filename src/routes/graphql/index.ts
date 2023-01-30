import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql } from "graphql/graphql";
import { GraphQLSchema } from "graphql/type";
import { Mutation } from "./fields/mutationFields";
import { Query } from "./fields/queryFields";
import { graphqlBodySchema } from "./schema";
import { validate } from "graphql/validation";
import depthLimit = require("graphql-depth-limit");
import { parse } from "graphql";
import DataLoader = require("dataloader");
import {
  postsBatch,
  profilesBatch,
  membersBatch,
  subscribedToUserBatch,
  userSubscribedToBatch,
} from "./loader-batches/batches";

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

      const context = {
        fastify,
        postsLoader: new DataLoader(postsBatch(fastify)),
        profilesLoader: new DataLoader(profilesBatch(fastify)),
        membersLoader: new DataLoader(membersBatch(fastify)),
        subscribedToUserLoader: new DataLoader(subscribedToUserBatch(fastify)),
        userSubscribedToLoader: new DataLoader(userSubscribedToBatch(fastify)),
      };

      const result = await graphql({
        schema,
        source: src as string,
        contextValue: context,
        variableValues: variables,
      });

      const errors = validate(schema, parse(src as string), [depthLimit(6)]);

      if (errors.length) {
        return {
          errors,
          message: "Query depth limit exceeded!",
          data: null,
        };
      }

      return result;
    }
  );
};

export default plugin;
