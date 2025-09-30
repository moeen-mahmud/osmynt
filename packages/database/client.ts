import { PrismaClient } from "./generated/client";

// Use globalThis for broader environment compatibility
const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: PrismaClient;
};

// Named export with global memoization
export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
