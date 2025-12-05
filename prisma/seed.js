import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.user.createMany({
    data: [
      { name: "Emiliano", email: "emiliano@example.com" },
      { name: "Ademir", email: "ademir@example.com" },
      { name: "Jimena", email: "jimena@example.com" },
    ],
  });

  console.log("Seed completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
