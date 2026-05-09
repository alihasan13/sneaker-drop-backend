import prisma from '../config/database';

export interface InventorySnapshot {
  id: string;
  dropId: string;
  totalStock: number;
  reservedStock: number;
  soldStock: number;
  availableStock: number;
}

function toSnapshot(inv: {
  id: string;
  dropId: string;
  totalStock: number;
  reservedStock: number;
  soldStock: number;
}): InventorySnapshot {
  return {
    ...inv,
    availableStock: inv.totalStock - inv.reservedStock - inv.soldStock,
  };
}

export const inventoryRepository = {
  async findByDropId(dropId: string): Promise<InventorySnapshot | null> {
    const inv = await prisma.inventory.findUnique({ where: { dropId } });
    return inv ? toSnapshot(inv) : null;
  },

  async findMany(dropIds: string[]): Promise<InventorySnapshot[]> {
    const rows = await prisma.inventory.findMany({
      where: { dropId: { in: dropIds } },
    });
    return rows.map(toSnapshot);
  },
};
