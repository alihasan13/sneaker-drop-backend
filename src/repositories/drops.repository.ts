import prisma from '../config/database';
import { CreateDropInput } from '../validators/drops.validator';

export const dropsRepository = {
  findAllActive() {
    return prisma.drop.findMany({
      where: { isActive: true },
      include: {
        inventory: true,
        purchases: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { startsAt: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.drop.findUnique({
      where: { id },
      include: {
        inventory: true,
        purchases: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });
  },

  create(data: CreateDropInput) {
    return prisma.drop.create({
      data: {
        name: data.name,
        brand: data.brand,
        colorway: data.colorway,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
        startsAt: new Date(data.startsAt),
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
        isActive: false,
        inventory: {
          create: { totalStock: data.totalStock },
        },
      },
      include: { inventory: true },
    });
  },

  setActive(id: string, isActive: boolean) {
    return prisma.drop.update({ where: { id }, data: { isActive } });
  },

  findAllForAdmin() {
    return prisma.drop.findMany({
      include: { inventory: true },
      orderBy: { createdAt: 'desc' },
    });
  },
};
