import { siteConfig } from '@/lib/metadata';

interface ServiceSchemaProps {
    name: string;
    description: string;
    url: string;
}

export function ServiceSchema({ name, description, url }: ServiceSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: name,
        provider: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
        },
        description: description,
        url: `${siteConfig.url}${url}`,
        areaServed: {
            '@type': 'City',
            name: 'Utrecht',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'IT Services',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
