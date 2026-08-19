import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import dotenv from "dotenv";
 
dotenv.config();
 
const trustServerCertificate =
  process.env.DB_TRUST_SERVER_CERT === "true" ||
  process.env.DB_TRUST_SERVER_CERTIFICATE === "true";
 
// Prisma 7 requires an explicit driver adapter instead of connecting
// internally — this replaces the old mssql.connect(dbConfig) call.
const adapter = new PrismaMssql({
  server: process.env.DB_SERVER!,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER || process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate,
  },
});
 
// Singleton: prevents multiple PrismaClient instances piling up during
// dev hot-reload (each one would open its own connection pool).
const globalForPrisma = global as unknown as { prisma: PrismaClient };
 
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
 
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
 
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to SQL Server (Prisma)");
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
  }
}
 
export { prisma, connectDB };