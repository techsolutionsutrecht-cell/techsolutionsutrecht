import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, Globe, Lock } from "lucide-react";
import { ServiceSchema } from "@/components/seo/ServiceSchema";

export const metadata: Metadata = {
    title: "Software Ontwikkeling Utrecht | Maatwerk Oplossingen",
    description: "Op zoek naar maatwerk software in Utrecht? Wij ontwikkelen schaalbare applicaties, API's en complexe systemen die uw bedrijf naar een hoger niveau tillen.",
    keywords: ["Software Ontwikkeling Utrecht", "Maatwerk Software", "App Ontwikkeling", "API Koppelingen", "SaaS Bedenken"],
};

const services = [
    {
        icon: Globe,
        title: "Web Applicaties",
        desc: "Krachtige SaaS-platformen en interactieve webtools gebouwd met Next.js en React."
    },
    {
        icon: Lock,
        title: "Beveiligde Systemen",
        desc: "Robuuste software-architectuur met een focus op dataveiligheid en privacy."
    },
    {
        icon: Cpu,
        title: "API Integraties",
        desc: "Naadloze koppelingen tussen uw bestaande systemen en nieuwe software."
    },
    {
        icon: Code2,
        title: "Maatwerk ERP/CRM",
        desc: "Software die zich aanpast aan uw bedrijfsprocessen, niet andersom."
    }
];

export default function SoftwarePage() {
    return (
        <div className="flex flex-col">
            <ServiceSchema
                name="Software Ontwikkeling Utrecht"
                description="Maatwerk software, API koppelingen en cloud systemen ontwikkeld in Utrecht."
                url="/services/software"
            />
            {/* Hero Section */}
            <section className="py-24 bg-swiss-noir text-white">
                <div className="swiss-grid items-center">
                    <div className="col-span-12 md:col-span-7">
                        <h1 className="text-5xl md:text-8xl font-bold mb-8 uppercase leading-[0.9]">
                            SOFTWARE <br />
                            <span className="text-utrecht-blue">DEVELOPMENT</span>
                        </h1>
                        <p className="text-swiss-gray/60 text-lg max-w-xl mb-12">
                            Wij vertalen complexe zakelijke uitdagingen naar elegante software-oplossingen. Onze aanpak is geworteld in precisie-engineering en modern design.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-4 bg-utrecht-blue text-white px-10 py-6 font-bold uppercase tracking-widest hover:bg-white hover:text-utrecht-blue transition-all"
                        >
                            Consultatie Aanvragen <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="col-span-12 md:col-span-5 relative aspect-square mt-12 md:mt-0">
                        <Image
                            src="/service_software.png"
                            alt="Software Architectuur Utrecht"
                            fill
                            className="object-cover border border-white/10"
                        />
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-swiss-stark">
                <div className="swiss-grid">
                    <div className="col-span-12 mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-utrecht-blue mb-4">Onze Focus</h2>
                        <h3 className="text-3xl md:text-5xl font-bold uppercase">DIGITALE ARCHITECTUUR VOOR MORGEN.</h3>
                    </div>
                    {services.map((s, i) => (
                        <div key={i} className="col-span-12 md:col-span-6 bg-white p-12 border border-swiss-gray flex flex-col gap-6 hover:border-utrecht-blue transition-colors">
                            <s.icon className="text-utrecht-blue" size={32} />
                            <h4 className="text-xl font-bold uppercase tracking-tight">{s.title}</h4>
                            <p className="text-swiss-noir/60 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 border-t border-swiss-gray">
                <div className="swiss-grid text-center">
                    <div className="col-span-12">
                        <p className="text-sm font-bold uppercase tracking-widest mb-4">Start Vandaag</p>
                        <h2 className="text-4xl md:text-6xl font-bold mb-12 uppercase leading-[0.9]">UW IDEE, <br /> ONZE <span className="text-utrecht-blue">CODE.</span></h2>
                        <Link
                            href="/contact"
                            className="inline-block bg-swiss-noir text-white px-12 py-6 font-bold uppercase tracking-widest hover:bg-utrecht-blue transition-all"
                        >
                            Boek Een Sessie
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
