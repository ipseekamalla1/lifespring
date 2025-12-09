import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

  // Create default Admin
  const adminEmail = "admin@lifespring.com";
  const adminPassword = await bcrypt.hash("admin", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
