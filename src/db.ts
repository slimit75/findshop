import { PrismaClient } from "@prisma/client";
import { FindShopLogger } from "./logger";

export class DatabaseManager {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllShops() {
    return this.prisma.shop.findMany({
      include: {
        mainLocation: true,
      },
    });
  }

  async searchItems(query: string) {
    return this.prisma.item.findMany({
      where: {
        itemID: {
          contains: query,
          mode: "insensitive",
        },
        OR: [
          {
            displayName: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        priceKST: "desc",
      },
      include: {
        shop: {
          include: {
            mainLocation: true,
          },
        },
      },
    });
  }
}

export async function connectToDatabase() {
  FindShopLogger.logger.debug("Connecting to database...");
  const prisma = new PrismaClient({
    log: ["error", "info", "query", "warn"],
  });

  await prisma.$connect();
  FindShopLogger.logger.debug("Connected to database!");
  return new DatabaseManager(prisma);
}
