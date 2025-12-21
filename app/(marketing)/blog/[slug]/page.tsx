import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateFAQSchema, generateTableOfContents } from "@/lib/blog-utils";
import TableOfContents from "@/components/blog/TableOfContents";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { BlogPost, BlogSection, BlogFAQ } from "@prisma/client";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug }
    });

    if (!post) return {};

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.introduction,
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.introduction,
            images: post.image ? [post.image] : [],
            type: "article",
            publishedTime: post.publishDate.toISOString(),
            authors: [post.author],
        }
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
            sections: { orderBy: { order: "asc" } },
            faqs: { orderBy: { order: "asc" } }
        }
    });

    if (!post) notFound();

    const tocItems = generateTableOfContents(post.sections);
    const faqSchema = generateFAQSchema(post.faqs);

    return (
        <article className="min-h-screen" suppressHydrationWarning>
            {/* Schema.org FAQ Data */}
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            {/* Hero Section */}
            <div className="bg-swiss-stark border-b border-swiss-gray py-24">
                <div className="swiss-grid">
                    <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                        <div className="flex flex-wrap gap-8 mb-12">
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-utrecht-blue">
                                <Tag size={12} /> {post.category.replace("_", " ")}
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-swiss-noir/40">
                                <Calendar size={12} /> {new Date(post.publishDate).toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-swiss-noir/40">
                                <User size={12} /> {post.author}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-12">
                            {post.title}
                        </h1>
                        <p className="text-2xl md:text-3xl font-medium text-swiss-noir/60 leading-relaxed max-w-4xl italic border-l-8 border-utrecht-blue pl-8">
                            {post.introduction}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="swiss-grid py-24 relative">
                {/* Sidebar - TOC */}
                <aside className="hidden lg:block col-span-3 sticky top-32 h-fit">
                    <TableOfContents items={tocItems} />
                </aside>

                {/* Content Body */}
                <div className="col-span-12 lg:col-span-8 lg:col-start-5 space-y-24">
                    {/* Featured Image */}
                    {post.image && (
                        <div className="border-4 border-swiss-noir shadow-[12px_12px_0px_0px_rgba(0,0,1,0.1)] overflow-hidden aspect-video">
                            <img
                                src={post.image}
                                alt={post.featuredImageAlt || post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Simple Content (Backward Compatibility) */}
                    {post.content && (
                        <div className="prose prose-xl max-w-none text-swiss-noir/80 leading-relaxed font-medium">
                            {post.content}
                        </div>
                    )}

                    {/* Sections */}
                    {post.sections.map((section: BlogSection, index: number) => (
                        <section
                            key={section.id}
                            id={`section-${index}`}
                            className="scroll-mt-32 space-y-8"
                        >
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight border-b-4 border-swiss-noir pb-4">
                                {section.title}
                            </h2>

                            <div className="grid grid-cols-1 gap-12">
                                {section.image && (
                                    <div className="border-2 border-swiss-noir shadow-lg overflow-hidden max-h-[500px]">
                                        <img
                                            src={section.image}
                                            alt={section.imageAlt || section.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="text-xl leading-relaxed font-medium text-swiss-noir/70 whitespace-pre-wrap">
                                    {section.content}
                                </div>
                            </div>
                        </section>
                    ))}

                    {/* FAQ Section */}
                    {post.faqs.length > 0 && (
                        <section className="bg-swiss-stark p-12 lg:p-20 border-4 border-swiss-noir shadow-[12px_12px_0px_0px_rgba(4,91,158,0.1)]">
                            <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4">
                                <span className="bg-utrecht-blue text-white w-12 h-12 flex items-center justify-center">?</span>
                                Veelgestelde Vragen
                            </h3>
                            <div className="space-y-12">
                                {post.faqs.map((faq: BlogFAQ) => (
                                    <div key={faq.id} className="space-y-4">
                                        <h4 className="text-xl font-bold text-swiss-noir flex gap-4">
                                            <span className="text-utrecht-blue tracking-tighter">Q.</span>
                                            {faq.question}
                                        </h4>
                                        <p className="text-lg text-swiss-noir/60 leading-relaxed pl-8 border-l-2 border-swiss-gray">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CTA Section */}
                    <div className="bg-utrecht-blue p-12 lg:p-20 text-white border-8 border-swiss-noir shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 text-center space-y-8">
                            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                {post.ctaTitle}
                            </h3>
                            <p className="text-xl font-medium text-white/80 max-w-2xl mx-auto">
                                Klaar om de volgende stap te zetten? Laat ons weten hoe we je kunnen helpen.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-4 px-12 py-5 bg-white text-utrecht-blue font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                            >
                                {post.ctaButtonText} <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Author Footer */}
            <div className="swiss-grid py-24 border-t border-swiss-gray">
                <div className="col-span-12 lg:col-span-8 lg:col-start-5 flex items-center gap-8">
                    <div className="w-20 h-20 bg-swiss-noir rounded-full flex items-center justify-center text-white font-black text-2xl">
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-swiss-noir/40">Gepubliceerd door</p>
                        <p className="text-xl font-bold">{post.author}</p>
                    </div>
                </div>
            </div>
        </article>
    );
}
