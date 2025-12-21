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
    console.log("Seeding blog posts...");

    const posts = [
        {
            title: "De Toekomst van Web Design in 2024",
            slug: "toekomst-web-design-2024",
            introduction: "Ontdek de belangrijkste trends die de digitale wereld van Utrecht en daarbuiten zullen vormen in het komende jaar.",
            content: "Volledige inhoud komt hier...",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072",
            category: "WEB_DESIGN",
            status: "PUBLISHED",
            author: "Tech Solutions Team",
        },
        {
            title: "Snelheid is Alles: Next.js Optimalisatie",
            slug: "nextjs-optimalisatie-tips",
            introduction: "Hoe wij de Core Web Vitals van onze klanten naar 100/100 tillen met geavanceerde caching en SSR technieken.",
            content: "Volledige inhoud komt hier...",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070",
            category: "SOFTWARE_DEV",
            status: "PUBLISHED",
            author: "Max de Vries",
        },
        {
            title: "Hardware Duurzaamheid in Utrecht",
            slug: "hardware-duurzaamheid-utrecht",
            introduction: "Waarom repareren bijna altijd beter is dan vervangen, en hoe Tech Solutions helpt de e-waste berg te verkleinen.",
            content: "Volledige inhoud komt hier...",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070",
            category: "HARDWARE_REPAIR",
            status: "PUBLISHED",
            author: "Reparatie Expert",
        },
        {
            title: "Custom App Ontwikkeling voor Lokale Bedrijven",
            slug: "custom-app-ontwikkeling-lokaal",
            introduction: "Hoe een op maat gemaakte applicatie de workflow van een Utrechtse mkb'er volledig transformeerde.",
            content: "Volledige inhoud komt hier...",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2070",
            category: "APP_DEV",
            status: "PUBLISHED",
            author: "Innovatie Team",
        },
        {
            title: "Het Belang van Cybersecurity voor ZZP'ers",
            slug: "cybersecurity-voor-zzp",
            introduction: "Bescherm je digitale voetafdruk met deze 5 essentiële stappen voor moderne ondernemers.",
            content: "Volledige inhoud komt hier...",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
            category: "SOFTWARE_DEV",
            status: "PUBLISHED",
            author: "Security Specialist",
        }
    ];

    for (const post of posts) {
        await prisma.blogPost.upsert({
            where: { slug: post.slug },
            update: post as any,
            create: post as any,
        });
    }

    console.log("Seed successful!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
