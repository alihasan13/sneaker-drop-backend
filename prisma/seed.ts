import { PrismaClient, ReservationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  //  Users 
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alihasan@sneakerdrop.dev' },
      update: { name: 'Ali Hasan', email: 'alihasan@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=AH' },
      create: { name: 'Ali Hasan', email: 'alihasan@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=AH' },
    }),
    prisma.user.upsert({
      where: { email: 'testuser1@sneakerdrop.dev' },
      update: { name: 'Test User 1', email: 'testuser1@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=1' },
      create: { name: 'Test User 1', email: 'testuser1@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=T1' },
    }),
    prisma.user.upsert({
      where: { email: 'testuser2@sneakerdrop.dev' },
      update: { name: 'User 2', email: 'testuser2@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=2' },
      create: { name: 'User 2', email: 'testuser2@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=AT' },
    }),
    prisma.user.upsert({
      where: { email: 'testuser3@sneakerdrop.dev' },
      update: { name: 'X user3', email: 'testuser3@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=3' },
      create: { name: 'Test User 3', email: 'testuser3@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=SD' },
    }),
    prisma.user.upsert({
      where: { email: 'testuser4@sneakerdrop.dev' },
      update: { name: 'Y User4', email: 'testuser4@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=4' },
      create: { name: 'Test User 4', email: 'testuser4@sneakerdrop.dev', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=CW' },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  //  Drops 
  const drop1 = await prisma.drop.upsert({
    where: { id: 'drop_aj1_chicago' },
    update: {},
    create: {
      id: 'drop_aj1_chicago',
      name: 'Air Jordan 1 Retro High OG',
      brand: 'Jordan Brand',
      colorway: 'Chicago',
      description:
        'The shoe that started it all. Originally released in 1985, the Air Jordan 1 Retro High OG "Chicago" returns in its most iconic colorway. Hand-stitched leather upper with premium quality.',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      price: 185.0,
      startsAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      isActive: true,
    },
  });

  const drop2 = await prisma.drop.upsert({
    where: { id: 'drop_dunk_panda' },
    update: {},
    create: {
      id: 'drop_dunk_panda',
      name: 'Nike Dunk Low',
      brand: 'Nike',
      colorway: 'Panda',
      description:
        'The most sought-after Dunk in recent memory. Clean black and white colorway with premium leather construction. Equally at home on court or on the street.',
      imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      price: 110.0,
      startsAt: new Date(Date.now() - 30 * 60 * 1000), // 30m ago
      isActive: true,
    },
  });

  const drop3 = await prisma.drop.upsert({
    where: { id: 'drop_yeezy_zebra' },
    update: { isActive: false },
    create: {
      id: 'drop_yeezy_zebra',
      name: 'Yeezy Boost 350 V2',
      brand: 'Adidas',
      colorway: 'Zebra',
      description:
        'The white-and-black zebra print Primeknit upper with translucent midsole. The SPLY-350 branding is a bold red statement. Boost cushioning technology for all-day comfort.',
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      price: 220.0,
      startsAt: new Date(Date.now() - 10 * 60 * 1000), // 10m ago
      isActive: false,
    },
  });

  const drop4 = await prisma.drop.upsert({
    where: { id: 'drop_nb550_wg' },
    update: {},
    create: {
      id: 'drop_nb550_wg',
      name: 'New Balance 550',
      brand: 'New Balance',
      colorway: 'White / Green',
      description:
        'Originally a 1989 basketball shoe, the 550 returns with a retro court aesthetic. Premium leather upper with vintage-inspired silhouette.',
      imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
      price: 130.0,
      startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      isActive: true,
    },
  });

  console.log('✅ Created drops');

  //  Inventory 
  await prisma.inventory.upsert({
    where: { dropId: drop1.id },
    update: {},
    create: { dropId: drop1.id, totalStock: 4, reservedStock: 0, soldStock: 0 },
  });
  await prisma.inventory.upsert({
    where: { dropId: drop2.id },
    update: {},
    create: { dropId: drop2.id, totalStock: 5, reservedStock: 0, soldStock: 0 },
  });
  await prisma.inventory.upsert({
    where: { dropId: drop3.id },
    update: {},
    create: { dropId: drop3.id, totalStock: 3, reservedStock: 0, soldStock: 0 },
  });
  await prisma.inventory.upsert({
    where: { dropId: drop4.id },
    update: {},
    create: { dropId: drop4.id, totalStock: 3, reservedStock: 0, soldStock: 0 },
  });

  console.log('✅ Created inventory');

  //  Sample Purchases
  const purchasesToSeed = [
    { userId: users[0].id, dropId: drop1.id, quantity: 1, price: 185.0 },
    { userId: users[1].id, dropId: drop1.id, quantity: 1, price: 185.0 },
    { userId: users[2].id, dropId: drop2.id, quantity: 1, price: 110.0 },
  ];

  for (const p of purchasesToSeed) {
    // Create a completed reservation then a purchase
    const existing = await prisma.reservation.findFirst({
      where: { userId: p.userId, dropId: p.dropId, status: ReservationStatus.COMPLETED },
    });
    if (!existing) {
      const reservation = await prisma.reservation.create({
        data: {
          userId: p.userId,
          dropId: p.dropId,
          quantity: p.quantity,
          status: ReservationStatus.COMPLETED,
          expiresAt: new Date(Date.now() - 60_000),
        },
      });
      await prisma.purchase.create({
        data: {
          userId: p.userId,
          dropId: p.dropId,
          reservationId: reservation.id,
          quantity: p.quantity,
          totalPrice: p.price * p.quantity,
        },
      });
    }
  }

  console.log('✅ Created sample purchases');
  console.log('\n🎉 Seeding complete!');
  console.log('\nDemo users:');
  users.forEach((u) => console.log(`  → ${u.name} (${u.email}) — id: ${u.id}`));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
