"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ProjectSlideshow from "./ProjectSlideshow";

interface ProjectCardProps {
    project: any;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const projectImages = [
        ...(project.image ? [project.image] : []),
        ...project.screenshots.map((s: any) => s.url)
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            className="col-span-12 md:col-span-6 group"
        >
            <div className="brutal-card relative overflow-hidden mb-8 aspect-[16/10]">
                <div className="absolute inset-0 bg-utrecht-blue/0 group-hover:bg-utrecht-blue/10 transition-all duration-500 z-10 pointer-events-none" />
                <div className="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-white bg-swiss-noir brutal-border p-3 pointer-events-none">
                    <ArrowUpRight size={24} />
                </div>
                <ProjectSlideshow images={projectImages} title={project.title} />
            </div>

            <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    <span className="brutal-tag bg-utrecht-blue text-white border-none py-1 px-3 text-[10px]">
                        {project.category.replace('_', ' ')}
                    </span>
                    {project.tags.map((tag: string) => (
                        <span key={tag} className="brutal-tag">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="kinetic-text">
                    <h3 className="text-4xl md:text-6xl font-black mb-4 leading-[0.9] tracking-tighter uppercase break-words">
                        {project.title}
                    </h3>
                    <div className="w-24 h-3 bg-utrecht-blue mb-6 group-hover:w-full transition-all duration-700 ease-in-out" />
                    <p className="text-swiss-noir/80 text-lg leading-relaxed max-w-xl font-medium">
                        {project.description}
                    </p>
                </div>

                <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-sm group/link"
                >
                    <span className="border-b-4 border-swiss-noir group-hover/link:border-utrecht-blue transition-colors">
                        Bekijk Project Details
                    </span>
                    <ArrowUpRight size={18} className="group-hover/link:translate-x-2 group-hover/link:-translate-y-2 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
