import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const cUser = new GraphQLInputObjectType({
  name: "CreateUser",
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const uUser = new GraphQLInputObjectType({
  name: "UpdateUser",
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});
