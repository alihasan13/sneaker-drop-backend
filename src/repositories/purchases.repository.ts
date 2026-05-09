import prisma from '../config/database';

export const purchasesRepository = {
  findByUser(userId: string) {
    return prisma.purchase.findMany({
      where: { userId },
      include: {
        drop: {
          select: { id: true, name: true, brand: true, colorway: true, imageUrl: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  findByDropLatest(dropId: string, take = 3) {
    return prisma.purchase.findMany({
      where: { dropId },
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  },
};
