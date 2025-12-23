import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import ProjectSlideshow from "@/components/projects/ProjectSlideshow";

export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await prisma.project.findUnique({
        where: { slug }
    });

    if (!project) return {};

    return {
        title: `${project.title} | Tech Solutions Utrecht`,
        description: project.description,
    };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
        where: { slug },
        include: { screenshots: true }
    });

    if (!project || project.status !== "PUBLISHED") {
        notFound();
    }

    const projectImages = [
        ...(project.image ? [project.image] : []),
        ...project.screenshots.map(s => s.url)
    ];

    return (
        <div className="py-24 lg:py-32">
            <div className="swiss-grid">
                {/* Back Button */}
                <div className="col-span-12 mb-12">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs group hover:text-utrecht-blue transition-colors"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                        Terug naar Projecten
                    </Link>
                </div>

                {/* Project Header */}
                <div className="col-span-12 lg:col-span-8 mb-16">
                    <div className="flex flex-wrap gap-2 mb-8">
                        <span className="brutal-tag bg-utrecht-blue text-white border-none py-2 px-4 text-xs">
                            {project.category.replace('_', ' ')}
                        </span>
                        {project.tags.map((tag) => (
                            <span key={tag} className="brutal-tag py-2 px-4 text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.85] tracking-tighter uppercase break-words">
                        {project.title}
                    </h1>

                    <div className="w-32 h-4 bg-utrecht-blue mb-12" />

                    <p className="text-swiss-noir/80 text-xl md:text-2xl leading-relaxed font-medium">
                        {project.description}
                    </p>

                    <div className="flex items-center gap-4 mt-8 text-swiss-noir/60">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">
                            {new Date(project.createdAt).toLocaleDateString('nl-NL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Project Images */}
                {projectImages.length > 0 && (
                    <div className="col-span-12 mb-16">
                        <div className="brutal-card aspect-[16/9] overflow-hidden">
                            <ProjectSlideshow images={projectImages} title={project.title} />
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                    <div className="brutal-card bg-swiss-stark p-12 md:p-16 text-center">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
                            Klaar voor uw volgende project?
                        </h2>
                        <p className="text-swiss-noir/60 text-lg mb-8 max-w-2xl mx-auto">
                            Laten we samen iets briljants bouwen. Neem vandaag nog contact op.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block bg-utrecht-blue text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-swiss-noir transition-all brutal-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                        >
                            Start uw project
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
