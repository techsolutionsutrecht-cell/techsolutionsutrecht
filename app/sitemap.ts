import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/metadata';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering - regenerate sitemap on each request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const routes = [
        '',
        '/projects',
        '/blog',
        '/contact',
        '/services/web-design',
        '/services/software',
        '/services/repair',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Try to fetch dynamic blog posts and projects
    // If database is not available (during build), return only static routes
    try {
        // Dynamic blog posts
        const blogPosts = await prisma.blogPost.findMany({
            where: {
                status: 'PUBLISHED',
            },
            select: {
                slug: true,
                updatedAt: true,
            },
        });

        const blogRoutes = blogPosts.map((post) => ({
            url: `${siteConfig.url}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        // Dynamic projects
        const projects = await prisma.project.findMany({
            where: {
                status: 'PUBLISHED',
            },
            select: {
                slug: true,
                updatedAt: true,
            },
        });

        const projectRoutes = projects.map((project) => ({
            url: `${siteConfig.url}/projects/${project.slug}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        return [...routes, ...blogRoutes, ...projectRoutes];
    } catch (error) {
        // Database not available (e.g., during build time)
        // Return only static routes
        console.warn('Database not available for sitemap generation, returning static routes only');
        return routes;
    }
}
