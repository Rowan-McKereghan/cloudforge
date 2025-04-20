import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const steelCoil = await prisma.material.create({
    data: {
      name: "Steel Coil",
      grade: "A36",
      length: 3,
      lengthUnits: "ft",
      width: 4,
      widthUnits: "in",
      thickness: 0.1,
      thicknessUnits: "gauge",
      defaultPrice: 55.0,
      priceUnits: "CWT",
      inventory: {
        create: { onHand: 100 }
      }
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
