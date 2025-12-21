import { prisma } from "@/lib/prisma";
import StatsGrid from "@/components/admin/StatsGrid";
import { BlogPost, ContactMessage } from "@prisma/client";

export default async function AdminDashboard() {
    const [projectCount, blogCount, unreadMessages, recentAanvragen, recentBlogs] = await Promise.all([
        prisma.project.count(),
        prisma.blogPost.count(),
        prisma.contactMessage.count({ where: { isRead: false } }),
        prisma.contactMessage.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
        prisma.blogPost.findMany({ take: 3, orderBy: { createdAt: 'desc' } })
    ]);

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold mb-2 uppercase">Dashboard</h1>
                <p className="text-swiss-noir/40 text-sm font-medium">Welkom terug, Admin.</p>
            </div>

            <StatsGrid counts={{ projects: projectCount, blogs: blogCount, messages: unreadMessages }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-8 border border-swiss-gray">
                    <h3 className="text-lg font-bold mb-8 uppercase">Recente Aanvragen</h3>
                    <div className="space-y-6">
                        {recentAanvragen.length === 0 ? (
                            <p className="text-sm text-swiss-noir/40 italic">Geen recente aanvragen.</p>
                        ) : (
                            recentAanvragen.map((msg: ContactMessage) => (
                                <div key={msg.id} className="flex justify-between items-center pb-6 border-b border-swiss-gray last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-bold text-sm">{msg.name}</p>
                                        <p className="text-xs text-swiss-noir/40">{msg.service}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 ${!msg.isRead ? 'bg-utrecht-blue/10 text-utrecht-blue' : 'bg-swiss-gray text-swiss-noir/40'}`}>
                                        {!msg.isRead ? 'Nieuw' : 'Gelezen'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white p-8 border border-swiss-gray">
                    <h3 className="text-lg font-bold mb-8 uppercase">Recente Blogs</h3>
                    <div className="space-y-6">
                        {recentBlogs.length === 0 ? (
                            <p className="text-sm text-swiss-noir/40 italic">Geen recente blogs.</p>
                        ) : (
                            recentBlogs.map((post: BlogPost) => (
                                <div key={post.id} className="flex justify-between items-center pb-6 border-b border-swiss-gray last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-bold text-sm">{post.title}</p>
                                        <p className="text-xs text-swiss-noir/40">{new Date(post.createdAt).toLocaleDateString('nl-NL')}</p>
                                    </div>
                                    <button className="text-xs font-bold uppercase text-utrecht-blue hover:underline">Bewerk</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
