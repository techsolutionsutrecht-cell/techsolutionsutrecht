import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ServiceSchema } from "@/components/seo/ServiceSchema";

export const metadata: Metadata = {
    title: "Web Design Utrecht | Professionele Websites & Webshops",
    description: "Wilt u een website laten maken in Utrecht? Wij ontwerpen en bouwen hoogwaardige, SEO-geoptimaliseerde websites en webshops met een focus op conversie.",
    keywords: ["Web Design Utrecht", "Website laten maken", "Webshop bouwen Utrecht", "UX Design", "Responsive Design"],
};

const features = [
    "Mobile-First & Responsief Design",
    "SEO Geoptimaliseerde Architectuur",
    "Conversie-Gericht interface Ontwerp",
    "Snelle Laadtijden & Core Web Vitals",
    "Eenvoudig Beheer via CMS",
    "Utrecht Blue Merkidentiteit Integratie",
];

export default function WebDesignPage() {
    return (
        <div className="flex flex-col">
            <ServiceSchema
                name="Web Design Utrecht"
                description="Huisstijl en conversiegerichte websites laten maken in Utrecht."
                url="/services/web-design"
            />
            {/* Hero Section */}
            <section className="py-24 bg-swiss-stark border-b border-swiss-gray">
                <div className="swiss-grid items-center">
                    <div className="col-span-12 md:col-span-7">
                        <h1 className="text-5xl md:text-8xl font-bold mb-8 uppercase leading-[0.9]">
                            WEB <br />
                            <span className="text-utrecht-blue">DESIGN</span> <br />
                            UTRECHT
                        </h1>
                        <p className="text-swiss-noir/60 text-lg max-w-xl mb-12">
                            Wij bouwen niet zomaar websites. Wij creëren digitale ervaringen die uw merk versterken en resultaten leveren. Vanuit Utrecht bedienen wij bedrijven die streven naar digitale uitmuntendheid.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-4 bg-swiss-noir text-white px-10 py-6 font-bold uppercase tracking-widest hover:bg-utrecht-blue transition-all"
                        >
                            Start Uw Project <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="col-span-12 md:col-span-5 relative aspect-[4/5] mt-12 md:mt-0">
                        <Image
                            src="/service_web_design.png"
                            alt="Web Design Utrecht Showcase"
                            fill
                            className="object-cover border border-swiss-gray p-4 bg-white"
                        />
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="swiss-grid">
                    <div className="col-span-12 md:col-span-5">
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-utrecht-blue mb-8">Onze Expertise</h2>
                        <h3 className="text-3xl md:text-5xl font-bold mb-8 uppercase leading-tight">
                            DE PERFECTE BALANS TUSSEN ESTHETIEK EN PERFORMANCE.
                        </h3>
                    </div>
                    <div className="col-span-12 md:col-span-6 md:col-start-7 space-y-8">
                        <p className="text-swiss-noir/60 leading-relaxed">
                            In de huidige digitale markt is een website uw belangrijkste visitekaartje. Wij combineren de precisie van Swiss Design met de nieuwste webtechnologieën om websites te bouwen die niet alleen prachtig ogen, maar ook technisch superieur zijn.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="text-utrecht-blue shrink-0 mt-1" size={18} />
                                    <span className="text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-utrecht-blue text-white">
                <div className="swiss-grid text-center">
                    <div className="col-span-12">
                        <h2 className="text-4xl md:text-7xl font-bold mb-8 uppercase">KLAAR VOOR DE VOLGENDE STAP?</h2>
                        <p className="mb-12 text-white/80 max-w-2xl mx-auto">
                            Laat ons u helpen bij het realiseren van uw digitale ambities. Wij komen graag bij u langs in Utrecht voor een vrijblijvend adviesgesprek.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block border-2 border-white px-12 py-6 font-bold uppercase tracking-widest hover:bg-white hover:text-utrecht-blue transition-all"
                        >
                            Neem Contact Op
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
