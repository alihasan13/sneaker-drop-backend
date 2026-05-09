"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var users, drop1, drop2, drop3, drop4, purchasesToSeed, _i, purchasesToSeed_1, p, existing, reservation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    return [4 /*yield*/, Promise.all([
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
                        ])];
                case 1:
                    users = _a.sent();
                    console.log("\u2705 Created ".concat(users.length, " users"));
                    return [4 /*yield*/, prisma.drop.upsert({
                            where: { id: 'drop_aj1_chicago' },
                            update: {},
                            create: {
                                id: 'drop_aj1_chicago',
                                name: 'Air Jordan 1 Retro High OG',
                                brand: 'Jordan Brand',
                                colorway: 'Chicago',
                                description: 'The shoe that started it all. Originally released in 1985, the Air Jordan 1 Retro High OG "Chicago" returns in its most iconic colorway. Hand-stitched leather upper with premium quality.',
                                imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
                                price: 185.0,
                                startsAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
                                isActive: true,
                            },
                        })];
                case 2:
                    drop1 = _a.sent();
                    return [4 /*yield*/, prisma.drop.upsert({
                            where: { id: 'drop_dunk_panda' },
                            update: {},
                            create: {
                                id: 'drop_dunk_panda',
                                name: 'Nike Dunk Low',
                                brand: 'Nike',
                                colorway: 'Panda',
                                description: 'The most sought-after Dunk in recent memory. Clean black and white colorway with premium leather construction. Equally at home on court or on the street.',
                                imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
                                price: 110.0,
                                startsAt: new Date(Date.now() - 30 * 60 * 1000), // 30m ago
                                isActive: true,
                            },
                        })];
                case 3:
                    drop2 = _a.sent();
                    return [4 /*yield*/, prisma.drop.upsert({
                            where: { id: 'drop_yeezy_zebra' },
                            update: { isActive: false },
                            create: {
                                id: 'drop_yeezy_zebra',
                                name: 'Yeezy Boost 350 V2',
                                brand: 'Adidas',
                                colorway: 'Zebra',
                                description: 'The white-and-black zebra print Primeknit upper with translucent midsole. The SPLY-350 branding is a bold red statement. Boost cushioning technology for all-day comfort.',
                                imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
                                price: 220.0,
                                startsAt: new Date(Date.now() - 10 * 60 * 1000), // 10m ago
                                isActive: false,
                            },
                        })];
                case 4:
                    drop3 = _a.sent();
                    return [4 /*yield*/, prisma.drop.upsert({
                            where: { id: 'drop_nb550_wg' },
                            update: {},
                            create: {
                                id: 'drop_nb550_wg',
                                name: 'New Balance 550',
                                brand: 'New Balance',
                                colorway: 'White / Green',
                                description: 'Originally a 1989 basketball shoe, the 550 returns with a retro court aesthetic. Premium leather upper with vintage-inspired silhouette.',
                                imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
                                price: 130.0,
                                startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
                                isActive: true,
                            },
                        })];
                case 5:
                    drop4 = _a.sent();
                    console.log('✅ Created drops');
                    //  Inventory 
                    return [4 /*yield*/, prisma.inventory.upsert({
                            where: { dropId: drop1.id },
                            update: {},
                            create: { dropId: drop1.id, totalStock: 4, reservedStock: 0, soldStock: 0 },
                        })];
                case 6:
                    //  Inventory 
                    _a.sent();
                    return [4 /*yield*/, prisma.inventory.upsert({
                            where: { dropId: drop2.id },
                            update: {},
                            create: { dropId: drop2.id, totalStock: 5, reservedStock: 0, soldStock: 0 },
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.inventory.upsert({
                            where: { dropId: drop3.id },
                            update: {},
                            create: { dropId: drop3.id, totalStock: 3, reservedStock: 0, soldStock: 0 },
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.inventory.upsert({
                            where: { dropId: drop4.id },
                            update: {},
                            create: { dropId: drop4.id, totalStock: 3, reservedStock: 0, soldStock: 0 },
                        })];
                case 9:
                    _a.sent();
                    console.log('✅ Created inventory');
                    purchasesToSeed = [
                        { userId: users[0].id, dropId: drop1.id, quantity: 1, price: 185.0 },
                        { userId: users[1].id, dropId: drop1.id, quantity: 1, price: 185.0 },
                        { userId: users[2].id, dropId: drop2.id, quantity: 1, price: 110.0 },
                    ];
                    _i = 0, purchasesToSeed_1 = purchasesToSeed;
                    _a.label = 10;
                case 10:
                    if (!(_i < purchasesToSeed_1.length)) return [3 /*break*/, 15];
                    p = purchasesToSeed_1[_i];
                    return [4 /*yield*/, prisma.reservation.findFirst({
                            where: { userId: p.userId, dropId: p.dropId, status: client_1.ReservationStatus.COMPLETED },
                        })];
                case 11:
                    existing = _a.sent();
                    if (!!existing) return [3 /*break*/, 14];
                    return [4 /*yield*/, prisma.reservation.create({
                            data: {
                                userId: p.userId,
                                dropId: p.dropId,
                                quantity: p.quantity,
                                status: client_1.ReservationStatus.COMPLETED,
                                expiresAt: new Date(Date.now() - 60000),
                            },
                        })];
                case 12:
                    reservation = _a.sent();
                    return [4 /*yield*/, prisma.purchase.create({
                            data: {
                                userId: p.userId,
                                dropId: p.dropId,
                                reservationId: reservation.id,
                                quantity: p.quantity,
                                totalPrice: p.price * p.quantity,
                            },
                        })];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 10];
                case 15:
                    console.log('✅ Created sample purchases');
                    console.log('\n🎉 Seeding complete!');
                    console.log('\nDemo users:');
                    users.forEach(function (u) { return console.log("  \u2192 ".concat(u.name, " (").concat(u.email, ") \u2014 id: ").concat(u.id)); });
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
