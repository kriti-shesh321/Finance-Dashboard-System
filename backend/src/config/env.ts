if (!process.env.DATABASE_URL) {
    console.log("in env.ts", process.env.DATABASE_URL);
    throw new Error("Missing DATABASE_URL environment variable");
}

if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
}

export const ENV = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
}