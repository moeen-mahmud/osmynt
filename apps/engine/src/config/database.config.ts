import { PrismaClient } from "@osmynt-core/database";

const Prisma = new PrismaClient({
	errorFormat: "pretty",
	log: ["query", "info", "warn", "error"],
	transactionOptions: {
		isolationLevel: "ReadCommitted",
		maxWait: 60000, // 1 minute
		timeout: 60000, // 1 minute
	},
});

export default Prisma;
