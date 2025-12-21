const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({}); // Pass an empty object

async function main() {
    console.log("Seeding database...");
    await prisma.project.create({
        data: {
            title: "EcoFlow Utrecht",
            slug: "ecoflow-utrecht",
            description: "Een intelligent energiebeheersysteem voor slimme woningen in de regio Utrecht.",
            category: "SOFTWARE_DEV",
            tags: ["Next.js", "IoT", "Data Viz"],
            status: "PUBLISHED",
        },
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
