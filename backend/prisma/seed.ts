import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const password = "password123";
  const hash = await bcrypt.hash(password, 10);

  // Upsert Alice
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice",
      password: hash
    }
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob",
      password: hash
    }
  });

  // Remove existing slots for idempotency
  await prisma.slot.deleteMany({
    where: { userId: { in: [alice.id, bob.id] } }
  });

  // Alice: 3 slots across 2026-02-02 and 2026-02-03
  await prisma.slot.createMany({
    data: [
      {
        userId: alice.id,
        title: "Alice Morning",
        date: "2026-02-02",
        startTime: "09:00",
        endTime: "10:00"
      },
      {
        userId: alice.id,
        title: "Alice Midday",
        date: "2026-02-02",
        startTime: "12:00",
        endTime: "13:00"
      },
      {
        userId: alice.id,
        title: "Alice Afternoon",
        date: "2026-02-03",
        startTime: "15:00",
        endTime: "16:30"
      }
    ]
  });

  // Bob: 2 slots
  await prisma.slot.createMany({
    data: [
      {
        userId: bob.id,
        title: "Bob Standup",
        date: "2026-02-02",
        startTime: "10:30",
        endTime: "11:00"
      },
      {
        userId: bob.id,
        title: "Bob Review",
        date: "2026-02-03",
        startTime: "16:00",
        endTime: "17:00"
      }
    ]
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });