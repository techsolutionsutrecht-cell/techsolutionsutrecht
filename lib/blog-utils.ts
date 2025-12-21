export interface TOCItem {
    id: string;
    title: string;
}

export function generateTableOfContents(sections: { title: string }[]): TOCItem[] {
    return sections.map((sec, index) => ({
        id: `section-${index}`,
        title: sec.title
    }));
}

export function generateFAQSchema(faqs: { question: string, answer: string }[]) {
    if (faqs.length === 0) return null;

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

export function slugify(text: string) {
    return text
        .toString()
        .normalize('NFD')               // Separate base characters from accents
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')        // Remove all non-word chars
        .replace(/--+/g, '-');          // Replace multiple - with single -
}
