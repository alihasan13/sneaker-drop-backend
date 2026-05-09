import { dropsRepository } from '../repositories/drops.repository';
import { Errors } from '../utils/AppError';
import { CreateDropInput } from '../validators/drops.validator';

// Shape the raw Prisma result into a clean API response
function formatDrop(drop: Awaited<ReturnType<typeof dropsRepository.findById>>) {
  if (!drop) return null;
  const inv = drop.inventory;
  const availableStock = inv
    ? inv.totalStock - inv.reservedStock - inv.soldStock
    : 0;

  return {
    id: drop.id,
    name: drop.name,
    brand: drop.brand,
    colorway: drop.colorway,
    description: drop.description,
    imageUrl: drop.imageUrl,
    price: Number(drop.price),
    startsAt: drop.startsAt,
    endsAt: drop.endsAt,
    isActive: drop.isActive,
    inventory: inv
      ? {
          totalStock: inv.totalStock,
          reservedStock: inv.reservedStock,
          soldStock: inv.soldStock,
          availableStock,
        }
      : null,
    recentPurchasers: drop.purchases.map((p) => ({
      userId: p.user.id,
      name: p.user.name,
      avatarUrl: p.user.avatarUrl,
      purchasedAt: p.createdAt,
    })),
  };
}

export const dropsService = {
  async getActiveDrops() {
    const drops = await dropsRepository.findAllActive();
    return drops.map(formatDrop);
  },

  async getDropById(id: string) {
    const drop = await dropsRepository.findById(id);
    if (!drop) throw Errors.notFound('Drop');
    return formatDrop(drop);
  },

  async createDrop(data: CreateDropInput) {
    const drop = await dropsRepository.create(data);
    return formatDrop(drop as any);
  },

  async activateDrop(id: string) {
    const drop = await dropsRepository.findById(id);
    if (!drop) throw Errors.notFound('Drop');
    return dropsRepository.setActive(id, true);
  },

  async getAllDropsAdmin() {
    const drops = await dropsRepository.findAllForAdmin();
    return drops.map((d) => ({
      ...d,
      price: Number(d.price),
      availableStock: d.inventory
        ? d.inventory.totalStock - d.inventory.reservedStock - d.inventory.soldStock
        : 0,
    }));
  },
};
