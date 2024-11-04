import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import { ChangePostInputType, CreatePostInputType, PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';
import { IContext } from '../types/context.js';
import { Static } from '@sinclair/typebox';
import { createPostSchema } from '../../posts/schemas.js';

export const PostsMutations: Record<string, GraphQLFieldConfig<unknown, IContext>> = {
  createPost: {
    type: new GraphQLNonNull(PostType),
    args: {
      dto: { type: new GraphQLNonNull(CreatePostInputType) },
    },
    resolve: async (
      _,
      { dto }: { dto: Static<(typeof createPostSchema)['body']> },
      { db, loaders: { postsByAuthorLoader } },
    ) => {
      const post = await db.post.create({
        data: dto,
      });

      postsByAuthorLoader.clear(dto.authorId);

      return post;
    },
  },

  changePost: {
    type: new GraphQLNonNull(PostType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangePostInputType) },
    },
    resolve: async (
      _,
      { id, dto }: { id: string; dto: Static<(typeof createPostSchema)['body']> },
      { db, loaders: { postLoader } },
    ) => {
      const post = await db.post.update({
        where: { id },
        data: dto,
      });

      postLoader.clear(id).prime(id, post);

      return post;
    },
  },

  deletePost: {
    type: new GraphQLNonNull(GraphQLString),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },

    resolve: async (_, { id }: { id: string }, { db }) => {
      await db.post.delete({
        where: { id },
      });

      return `Post ${id} deleted.`;
    },
  },
};
