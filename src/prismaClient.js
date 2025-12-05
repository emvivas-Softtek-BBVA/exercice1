import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "stdout" },
    { level: "error", emit: "stdout" }
  ]
});

export default prisma;
