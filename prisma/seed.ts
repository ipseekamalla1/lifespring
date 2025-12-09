import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10);

  await prisma.admin.upsert({
    where: { email: "admin@lifespring.com" },
    update: {},
    create: {
      email: "admin@lifespring.com",
      password: hashedPassword
    },
  });

  console.log("Admin seeded successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
