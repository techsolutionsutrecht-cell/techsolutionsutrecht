import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
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

    return routes;
}
