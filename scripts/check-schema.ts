import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log('Checking models...');
        const projectCount = await prisma.project.count()
        console.log('Project count:', projectCount)

        const blogCount = await prisma.blogPost.count()
        console.log('Blog count:', blogCount)

        const messageCount = await prisma.contactMessage.count()
        console.log('Message count:', messageCount)

        console.log('Database schema check successful!')
    } catch (e: any) {
        console.error('Database check failed!')
        console.error('Error:', e.message)
    } finally {
        await prisma.$disconnect()
        await pool.end();
    }
}

main()
