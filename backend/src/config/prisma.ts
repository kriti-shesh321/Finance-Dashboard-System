import { ENV } from "./env";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = ENV.DATABASE_URL;

const pool = new Pool({
    connectionString
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter
});