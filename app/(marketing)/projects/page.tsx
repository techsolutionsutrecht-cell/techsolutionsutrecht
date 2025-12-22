import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProjectCard from "@/components/projects/ProjectCard";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        where: { status: "PUBLISHED" },
        include: { screenshots: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="py-24" suppressHydrationWarning>
            <div className="swiss-grid mb-32" suppressHydrationWarning>
                <div className="col-span-12 md:col-span-10" suppressHydrationWarning>
                    <h1 className="text-6xl md:text-[10rem] mb-12 leading-[0.8] tracking-tighter font-black">
                        ONS <br /> <span className="text-utrecht-blue">RECENTE</span> <br /> WERK
                    </h1>
                    <p className="text-swiss-noir/80 max-w-2xl text-xl md:text-2xl font-medium leading-relaxed">
                        Een selectie van onze meest impactvolle projecten. Wij combineren <span className="text-utrecht-blue font-black underline">strategie</span> met <span className="text-utrecht-blue font-black underline">brutaal design</span> om uw merk te laten opvallen.
                    </p>
                </div>
            </div>

            <div className="swiss-grid gap-y-40" suppressHydrationWarning>
                {projects.length === 0 ? (
                    <div className="col-span-12 text-center py-40 brutal-border border-dashed">
                        <p className="text-swiss-noir/40 uppercase tracking-[0.3em] font-black text-2xl">Geen projecten gevonden.</p>
                    </div>
                ) : (
                    projects.map((project: any, index: number) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))
                )}
            </div>
        </div>
    );
}
