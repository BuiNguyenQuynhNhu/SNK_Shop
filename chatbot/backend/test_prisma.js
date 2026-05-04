const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const sneakers = await prisma.sneaker.findMany({
      include: {
        brand: true,
        variants: true
      }
    });
    console.log("Sneakers found:", sneakers.length);
    if (sneakers.length > 0) {
      console.log("First sneaker:", JSON.stringify(sneakers[0], null, 2));
    }
  } catch (e) {
    console.error("Prisma error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
