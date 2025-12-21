import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Testing BlogPost query...");
    try {
        const posts = await prisma.blogPost.findMany();
        console.log("Success! Posts count:", posts.length);
        if (posts.length > 0) {
            console.log("First post keys:", Object.keys(posts[0]));
        }
    } catch (e: any) {
        console.error("Query failed!");
        console.error("Code:", e.code);
        console.error("Message:", e.message);
        if (e.meta) console.error("Meta:", e.meta);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
