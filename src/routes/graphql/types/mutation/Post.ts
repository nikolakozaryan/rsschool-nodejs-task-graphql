import {
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql/type/definition";
import { GraphQLString } from "graphql/type/scalars";

export const uPost = new GraphQLInputObjectType({
  name: "UpdatePost",
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export const cPost = new GraphQLInputObjectType({
  name: "CreatePost",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
});
