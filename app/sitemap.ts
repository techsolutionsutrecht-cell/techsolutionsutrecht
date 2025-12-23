import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/metadata';
import { prisma } from '@/lib/prisma';

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
}
