import { Metadata } from 'next';

export const siteConfig = {
  name: 'TechSolutionsUtrecht',
  description: 'Expert web design, software ontwikkeling en hardware reparaties in Utrecht. Wij bouwen de digitale toekomst van Midden-Nederland.',
  url: 'https://techsolutionsutrecht.nl',
  ogImage: '/og-image.jpg',
  address: {
    area: 'Utrecht & Omgeving',
    city: 'Utrecht',
    country: 'Nederland'
  },
  email: 'info@techsolutionsutrecht.nl',
  tel: '06 23434286',
  keywords: [
    'Web design Utrecht',
    'Software ontwikkeling Utrecht',
    'Website laten maken',
    'Laptop reparatie Utrecht',
    'Telefoon reparatie Utrecht',
    'App design Nederland',
    'IT oplossingen Utrecht'
  ]
};

export const baseMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  metadataBase: new URL(siteConfig.url),
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};
