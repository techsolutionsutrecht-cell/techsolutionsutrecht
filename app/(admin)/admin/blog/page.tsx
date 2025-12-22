import { prisma } from "@/lib/prisma";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { deleteBlogPost } from "@/actions/content-actions";
import Link from "next/link";
import { BlogPost } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function AdminBlog() {
    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2 uppercase">Blog Posts</h1>
                    <p className="text-swiss-noir/40 text-sm font-medium">Deel uw expertise met de Utrechtse tech community.</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="bg-utrecht-blue text-white px-6 py-3 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-swiss-noir transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                >
                    <Plus size={16} /> Nieuwe Post
                </Link>
            </div>

            <div className="bg-white border border-swiss-gray overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-swiss-stark border-b border-swiss-gray">
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40">Titel</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40">Datum</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40">Status</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-swiss-noir/40 uppercase tracking-widest text-xs font-bold">
                                    Geen blog posts gevonden.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post: BlogPost) => (
                                <tr key={post.id} className="border-b border-swiss-gray last:border-0 hover:bg-swiss-stark/50 transition-colors">
                                    <td className="p-6">
                                        <p className="font-bold text-sm">{post.title}</p>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-xs text-swiss-noir/60">
                                            {new Date(post.createdAt).toLocaleDateString('nl-NL')}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-[9px] font-bold uppercase px-2 py-1 ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-swiss-gray text-swiss-noir/40'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right space-x-4">
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="text-swiss-noir/40 hover:text-utrecht-blue transition-colors inline-block"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                        <form action={deleteBlogPost.bind(null, post.id)} className="inline">
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
            </div>
        </div>
    );
}
