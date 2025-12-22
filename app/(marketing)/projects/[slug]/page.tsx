import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProjectSlideshow from "@/components/projects/ProjectSlideshow";

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
    const project = await prisma.project.findUnique({
        where: {
            slug,
            status: "PUBLISHED",
        },
        include: {
            screenshots: true,
        },
    });

    return project;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const project = await getProject(resolvedParams.slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `${project.title} | Tech Solutions Utrecht`,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            images: project.image ? [project.image] : [],
        },
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const project = await getProject(resolvedParams.slug);

    if (!project) {
        notFound();
    }

    const projectImages = [
        ...(project.image ? [project.image] : []),
        ...project.screenshots.map((s) => s.url)
    ];

    return (
        <div className="min-h-screen bg-off-white">
            {/* Header */}
            <div className="brutal-border-b bg-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-swiss-noir/60 hover:text-swiss-noir transition-colors mb-6 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Terug naar projecten</span>
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="brutal-tag bg-utrecht-blue text-white border-none py-1 px-3 text-[10px]">
                            {project.category.replace('_', ' ')}
                        </span>
                        {project.tags.map((tag) => (
                            <span key={tag} className="brutal-tag">
                                <Tag size={12} className="inline mr-1" />
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[0.9] tracking-tighter uppercase">
                        {project.title}
                    </h1>

                    <p className="text-xl text-swiss-noir/80 max-w-3xl font-medium leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex items-center gap-4 mt-6 text-sm text-swiss-noir/60">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(project.createdAt).toLocaleDateString('nl-NL')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Images */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                {projectImages.length > 0 && (
                    <div className="brutal-card aspect-video mb-12 overflow-hidden">
                        <ProjectSlideshow images={projectImages} title={project.title} />
                    </div>
                )}

                {/* Project Screenshots Grid */}
                {project.screenshots.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        {project.screenshots.map((screenshot) => (
                            <div key={screenshot.id} className="brutal-card overflow-hidden aspect-video">
                                <Image
                                    src={screenshot.url}
                                    alt={`${project.title} screenshot`}
                                    width={800}
                                    height={450}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <div className="brutal-card bg-utrecht-blue text-white mt-16 p-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                        Geïnteresseerd in een vergelijkbaar project?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Neem contact met ons op om uw visie werkelijkheid te maken
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-white text-utrecht-blue font-black uppercase px-8 py-4 brutal-border hover:translate-x-2 hover:translate-y-2 transition-transform"
                    >
                        Neem Contact Op
                    </Link>
                </div>
            </div>
        </div>
    );
}
