import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/metadata';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteConfig.name,
        short_name: 'TSU',
        description: siteConfig.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#F5F5F5',
        theme_color: '#0052CC', // Utrecht Blue
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/logo-tsu.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
