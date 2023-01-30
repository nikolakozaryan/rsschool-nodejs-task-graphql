import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import { GraphQLObjectType } from "graphql/type/definition";

export const Profile = new GraphQLObjectType({
  name: "Profile",
  fields: {
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLString },
  },
});
