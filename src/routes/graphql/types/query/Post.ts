import { GraphQLObjectType } from "graphql/type/definition";
import { GraphQLID, GraphQLString } from "graphql/type/scalars";

export const Post = new GraphQLObjectType({
  name: "Post",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  },
});
