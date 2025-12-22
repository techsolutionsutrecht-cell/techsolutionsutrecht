import BlogPostForm from "@/components/admin/BlogPostForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface EditBlogPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
            sections: {
                orderBy: { order: "asc" }
            },
            faqs: {
                orderBy: { order: "asc" }
            }
        }
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="py-12">
            <BlogPostForm initialData={post} />
        </div>
    );
}
