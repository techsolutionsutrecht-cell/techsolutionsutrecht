import { PrismaClient, ProjectCategory, BlogCategory, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Clear existing data
    await prisma.project.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.contactMessage.deleteMany();

    // Seed Projects
    await prisma.project.createMany({
        data: [
            {
                title: "EcoFlow Utrecht",
                slug: "ecoflow-utrecht",
                description: "Een intelligent energiebeheersysteem voor slimme woningen in de regio Utrecht.",
                category: ProjectCategory.SOFTWARE_DEV,
                tags: ["Next.js", "IoT", "Data Viz"],
                status: Status.PUBLISHED,
            },
            {
                title: "Vintage Store",
                slug: "vintage-store",
                description: "Een premium online store voor een exclusieve vintage kledingwinkel aan de Oudegracht.",
                category: ProjectCategory.WEB_DESIGN,
                tags: ["Shopify", "React", "UX"],
                status: Status.PUBLISHED,
            },
            {
                title: "MedTech Portal",
                slug: "medtech-portal",
                description: "Veilig patiëntenportaal voor lokale gezondheidscentra met focus op privacy.",
                category: ProjectCategory.SOFTWARE_DEV,
                tags: ["Security", "API", "Mobile"],
                status: Status.PUBLISHED,
            },
        ],
    });

    // Seed Blog Posts
    await prisma.blogPost.createMany({
        data: [
            {
                title: "Waarom Next.js de beste keuze is voor Utrechtse startups",
                slug: "waarom-nextjs-beste-keuze",
                excerpt: "Snelheid, SEO en schaalbaarheid: ontdek waarom moderne tech-bedrijven massaal overstappen naar Next.js.",
                content: "Next.js biedt fantastische mogelijkheden voor performance en SEO...",
                category: BlogCategory.SOFTWARE_DEV,
                status: Status.PUBLISHED,
            },
            {
                title: "De Staat van Tech in Midden-Nederland",
                slug: "staat-van-tech-midden-nederland",
                excerpt: "Utrecht groeit uit tot de belangrijkste tech-hub van Europa. Wat betekent dit voor uw bedrijf?",
                content: "De regio Utrecht heeft een uniek ecosysteem van talent en kapitaal...",
                category: BlogCategory.APP_DEV,
                status: Status.PUBLISHED,
            },
        ],
    });

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
