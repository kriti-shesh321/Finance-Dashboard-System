import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({
    connectionString
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter
});

async function main() {
    const passwordHash = await bcrypt.hash("qwertyuiop00", 10);

    // ADMIN
    await prisma.user.upsert({
        where: { email: "rei@gmail.com" },
        update: {},
        create: {
            name: "Rei Sora",
            email: "rei@gmail.com",
            password: passwordHash,
            role: Role.ADMIN,
            status: true,
        },
    });

    // ANALYSTS
    const analysts = [
        { name: "Kei Izumi", email: "kei@gmail.com" },
        { name: "Tim Smitch", email: "tim@gmail.com" },
    ];

    for (const user of analysts) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                name: user.name,
                email: user.email,
                password: passwordHash,
                role: Role.ANALYST,
                status: true,
            },
        });
    }

    // VIEWERS
    const viewers = [
        { name: "Izumi Aki", email: "izumi@gmail.com" },
        { name: "Raj Hoshino", email: "raj@gmail.com" },
        { name: "Rika Itsuomi", email: "rika@gmail.com" },
    ];

    for (const user of viewers) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                name: user.name,
                email: user.email,
                password: passwordHash,
                role: Role.VIEWER,
                status: true,
            },
        });
    }
    console.log("Data seeded successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });