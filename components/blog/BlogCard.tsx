"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    introduction: string | null;
    image: string | null;
    category: string;
    createdAt: Date;
    author: string;
}

interface BlogCardProps {
    post: BlogPost;
    index: number;
    isFeatured?: boolean;
}

export default function BlogCard({ post, index, isFeatured = false }: BlogCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            className={`group ${isFeatured ? 'col-span-12' : 'col-span-12 md:col-span-6'}`}
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <article className={`flex flex-col ${isFeatured ? 'lg:flex-row-reverse gap-12' : 'gap-8'} h-full`}>
                    <div className={`relative overflow-hidden ${isFeatured ? 'lg:w-[60%] aspect-[16/9]' : 'aspect-[16/10]'} brutal-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-swiss-gray`}>
                        {post.image ? (
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-swiss-noir/20 font-black text-4xl italic">
                                NO IMAGE
                            </div>
                        )}
                        <div className="absolute inset-0 bg-utrecht-blue/0 group-hover:bg-utrecht-blue/10 transition-all duration-500 z-10" />

                        <div className="absolute top-6 left-6 z-30">
                            <span className="brutal-tag bg-utrecht-blue text-white border-none py-1 px-4 text-[10px] uppercase font-black tracking-widest">
                                {post.category.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className={`flex flex-col flex-grow ${isFeatured ? 'lg:w-[40%] justify-center' : 'justify-between'}`}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-swiss-noir/40">
                                    {new Date(post.createdAt).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                                <div className="h-px flex-grow bg-swiss-gray" />
                            </div>

                            <div className="kinetic-text">
                                <h2 className={`${isFeatured ? 'text-5xl md:text-7xl' : 'text-3xl md:text-5xl'} font-black leading-[0.9] tracking-tighter uppercase mb-6 group-hover:text-utrecht-blue transition-colors`}>
                                    {post.title}
                                </h2>
                                <p className="text-swiss-noir/60 text-lg leading-relaxed max-w-2xl font-medium">
                                    {post.introduction}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-swiss-gray flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-utrecht-blue flex items-center justify-center text-white font-black text-[10px]">
                                    {post.author.charAt(0)}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-swiss-noir/60">{post.author}</span>
                            </div>
                            <div className="w-12 h-12 rounded-full border-4 border-swiss-noir flex items-center justify-center group-hover:bg-utrecht-blue group-hover:text-white transition-all transform group-hover:rotate-45">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
