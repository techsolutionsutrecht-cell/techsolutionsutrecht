import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/blog/BlogCard";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const blogPosts = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="py-24 lg:py-40">
            {/* Header Section */}
            <header className="swiss-grid mb-24 lg:mb-40">
                <div className="col-span-12 lg:col-span-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-1 bg-utrecht-blue" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-swiss-noir/40">Our Journal</span>
                    </div>
                    <h1 className="text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase mb-12">
                        Tech <br />
                        <span className="text-utrecht-blue">Insights</span> <br />
                        Utrecht
                    </h1>
                    <p className="text-2xl md:text-4xl text-swiss-noir/60 leading-tight max-w-4xl font-medium lowercase italic">
                        Deep dives into software architecture, web performance, and the future of technology in the heart of Utrecht.
                    </p>
                </div>
            </header>

            {/* Posts Section */}
            <div className="swiss-grid">
                <div className="col-span-12">
                    {blogPosts.length === 0 ? (
                        <div className="brutal-card bg-swiss-stark p-24 text-center">
                            <p className="text-swiss-noir/40 uppercase tracking-widest font-black text-2xl">Geen blog posts gevonden.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-12 gap-y-24 md:gap-y-32 lg:gap-y-48 gap-x-8 lg:gap-x-12">
                            {blogPosts.map((post, index) => {
                                // Logic for structured editorial rhythm:
                                // index 0, 3, 6... are featured (full width)
                                // others are in a 2-column grid
                                const isFeatured = index % 3 === 0;

                                return (
                                    <BlogCard
                                        key={post.id}
                                        post={post as any}
                                        index={index}
                                        isFeatured={isFeatured}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Newsletter / CTA Section */}
            <section className="mt-80 pb-40">
                <div className="swiss-grid">
                    <div className="col-span-12 bg-swiss-noir p-12 lg:p-24 text-swiss-stark brutal-border shadow-[20px_20px_0px_0px_rgba(40,111,219,1)] relative z-10">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                                    Stay ahead of <br /> the curve.
                                </h2>
                                <p className="text-lg text-swiss-stark/60 font-medium">
                                    Join our monthly briefing for Utrecht's tech scene. No fluff, just hard insights.
                                </p>
                            </div>
                            <NewsletterForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
