import { GraphQLInputObjectType } from "graphql/type/definition";
import { GraphQLInt } from "graphql/type/scalars";

export const uMemberType = new GraphQLInputObjectType({
  name: "UpdateMemberType",
  fields: {
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});
