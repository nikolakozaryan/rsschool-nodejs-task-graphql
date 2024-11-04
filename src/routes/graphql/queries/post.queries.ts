import { GraphQLNonNull, GraphQLList, GraphQLFieldConfig } from 'graphql';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';
import { IContext } from '../types/context.js';

export const PostsQueries: Record<string, GraphQLFieldConfig<unknown, IContext>> = {
  posts: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
    resolve: async (_, args, { db, loaders: { postLoader } }) => {
      const posts = await db.post.findMany();

      posts.forEach((post) => {
        postLoader.prime(post.id, post);
      });

      return posts;
    },
  },
  post: {
    type: PostType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }: { id: string }, { db }) => {
      return db.post.findUnique({ where: { id } });
    },
  },
};
