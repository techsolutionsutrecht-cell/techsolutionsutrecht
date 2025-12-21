import { prisma } from "@/lib/prisma";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { deleteProject } from "@/actions/content-actions";
import Link from "next/link";
import { Project } from "@prisma/client";

export default async function AdminProjects() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2 uppercase">Projecten</h1>
                    <p className="text-swiss-noir/40 text-sm font-medium">Beheer uw portfolio van Utrechtse projecten.</p>
                </div>
                <Link
                    href="/admin/projects/create"
                    className="bg-utrecht-blue text-white px-6 py-3 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-swiss-noir transition-all"
                >
                    <Plus size={16} /> Nieuw Project
                </Link>
            </div>

            <div className="bg-white border border-swiss-gray overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-swiss-stark border-b border-swiss-gray">
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40">Project</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40">Categorie</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40">Status</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-swiss-noir/40 uppercase tracking-widest text-xs font-bold">
                                    Geen projecten gevonden.
                                </td>
                            </tr>
                        ) : (
                            projects.map((project: Project) => (
                                <tr key={project.id} className="border-b border-swiss-gray last:border-0 hover:bg-swiss-stark/50 transition-colors">
                                    <td className="p-6">
                                        <p className="font-bold text-sm">{project.title}</p>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-xs text-swiss-noir/60">{project.category.replace('_', ' ')}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-[9px] font-bold uppercase px-2 py-1 ${project.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-swiss-gray text-swiss-noir/40'}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right space-x-4">
                                        <Link
                                            href={`/admin/projects/edit/${project.id}`}
                                            className="text-swiss-noir/40 hover:text-utrecht-blue transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                        <form action={deleteProject.bind(null, project.id)} className="inline">
                                            <button type="submit" className="text-swiss-noir/40 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex justify-end pt-8">
                    <Link
                        href="/admin/projects/create"
                        className="bg-swiss-noir text-white px-8 py-4 font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-utrecht-blue transition-all shadow-[8px_8px_0px_0px_rgba(0,59,164,0.2)]"
                    >
                        <Plus size={18} /> Nieuw Project
                    </Link>
                </div>
            </div>
        </div>
    );
}
