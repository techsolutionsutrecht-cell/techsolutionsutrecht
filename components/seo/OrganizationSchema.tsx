import { siteConfig } from '@/lib/metadata';

export function OrganizationSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo-tsu.png`,
        description: siteConfig.description,
        address: {
            '@type': 'PostalAddress',
            addressLocality: siteConfig.address.city,
            addressRegion: 'Utrecht',
            addressCountry: 'NL',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: siteConfig.tel,
            contactType: 'customer service',
            email: siteConfig.email,
        },
        sameAs: [
            // Add social media links here if available
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
