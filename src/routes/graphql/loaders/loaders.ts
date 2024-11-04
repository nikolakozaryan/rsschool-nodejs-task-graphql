import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Member } from '../queries/member-type.queries.js';
import { Post } from '../types/post.js';
import { Profile } from '../types/profile.js';
import { User } from '../types/user.js';

export type LoadersType = ReturnType<typeof generateLoaders>;

export function generateLoaders(prisma: PrismaClient) {
  return {
    memberTypeLoader: new DataLoader(async (keys: readonly string[]) => {
      const rows = await prisma.memberType.findMany({
        where: { id: { in: [...keys] } },
      });

      const map = rows.reduce((acc, item) => {
        acc.set(item.id, item);
        return acc;
      }, new Map<string, Member>());

      return keys.map((id) => map.get(id));
    }),

    postLoader: new DataLoader(async (keys: readonly string[]) => {
      const rows = await prisma.post.findMany({
        where: { id: { in: [...keys] } },
      });

      const map = rows.reduce((acc, item) => {
        acc.set(item.id, item);
        return acc;
      }, new Map<string, Post>());

      return keys.map((id) => map.get(id));
    }),

    profileLoader: new DataLoader(async (keys: readonly string[]) => {
      const rows = await prisma.profile.findMany({
        where: { userId: { in: [...keys] } },
      });

      const map = rows.reduce((acc, item) => {
        acc.set(item.userId, item);
        return acc;
      }, new Map<string, Profile>());

      return keys.map((userId) => map.get(userId));
    }),

    userLoader: new DataLoader(async (keys: readonly string[]) => {
      const rows = await prisma.user.findMany({
        where: { id: { in: [...keys] } },
      });

      const map = rows.reduce((acc, item) => {
        acc.set(item.id, item);
        return acc;
      }, new Map<string, User>());

      return keys.map((id) => map.get(id));
    }),

    postsByAuthorLoader: new DataLoader(async (keys: readonly string[]) => {
      const rows = await prisma.post.findMany({
        where: { authorId: { in: [...keys] } },
      });

      const map = rows.reduce((acc, item) => {
        acc.set(item.authorId, [...(acc.get(item.authorId) || []), item]);
        return acc;
      }, new Map<string, Post[]>());

      return keys.map((authorId) => map.get(authorId) || []);
    }),

    userSubscribedToLoader: new DataLoader(async (keys: readonly string[]) => {
      const rows = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: [...keys] } },
        include: { author: true },
      });

      const map = rows.reduce((acc, item) => {
        acc.set(item.subscriberId, [...(acc.get(item.subscriberId) || []), item.author]);
        return acc;
      }, new Map<string, User[]>());

      return keys.map((userId) => map.get(userId) || []);
    }),

    subscribedToUserLoader: new DataLoader(async (keys: readonly string[]) => {
      const rows = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: [...keys] } },
        include: { subscriber: true },
      });

      const map = rows.reduce((acc, item) => {
        acc.set(item.authorId, [...(acc.get(item.authorId) || []), item.subscriber]);

        return acc;
      }, new Map<string, User[]>());

      return keys.map((userId) => map.get(userId) || []);
    }),
  };
}
