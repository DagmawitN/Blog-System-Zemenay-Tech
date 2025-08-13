import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    const plainPassword = "a1d2m3i4n5001"; // Your current plain password
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 = salt rounds

    const updatedUser = await prisma.user.update({
      where: { email: "admin01@gmail.com" }, // Change to your admin's email
      data: { password: hashedPassword },
    });

    console.log("✅ Password updated and hashed successfully:", updatedUser.email);
  } catch (error) {
    console.error("❌ Error updating password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
