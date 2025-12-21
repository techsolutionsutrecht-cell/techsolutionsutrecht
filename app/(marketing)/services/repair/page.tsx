import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone, Laptop, Tablet, Truck } from "lucide-react";
import { ServiceSchema } from "@/components/seo/ServiceSchema";

export const metadata: Metadata = {
    title: "Hardware Reparatie Utrecht | Mobile Ophaalservice",
    description: "Laptop, telefoon of tablet kapot? Wij repareren uw hardware in Utrecht en omstreken. Maak gebruik van onze gratis haal- en brengservice.",
    keywords: ["iPhone reparatie Utrecht", "Laptop reparatie", "MacBook reparatie Utrecht", "Telefoon reparatie aan huis", "Ophaalservice reparatie"],
};

const repairItems = [
    { icon: Smartphone, name: "Smartphones", text: "Schermreparatie, batterijvervanging en waterschade herstel voor iPhone & Android." },
    { icon: Laptop, name: "Laptops & MacBooks", text: "Hardware upgrades, toetsenbord vervanging en moederbord reparaties." },
    { icon: Tablet, name: "Tablets", text: "Glasherstel en oplaadaansluiting reparaties voor iPad en Samsung Galaxy Tabs." },
    { icon: Truck, name: "Ophaalservice", text: "Gratis haal- en brengservice in de regio Utrecht. U hoeft de deur niet uit." }
];

export default function RepairPage() {
    return (
        <div className="flex flex-col">
            <ServiceSchema
                name="Hardware Reparatie Utrecht"
                description="Snelle reparatie van laptops, smartphones en tablets met gratis ophaalservice in Utrecht."
                url="/services/repair"
            />
            {/* Hero Section */}
            <section className="py-24 bg-swiss-stark border-b border-swiss-gray">
                <div className="swiss-grid items-center">
                    <div className="col-span-12 md:col-span-7">
                        <h1 className="text-5xl md:text-8xl font-bold mb-8 uppercase leading-[0.9]">
                            FIX <br />
                            <span className="text-utrecht-blue">DIRECT.</span>
                        </h1>
                        <p className="text-swiss-noir/60 text-lg max-w-xl mb-12">
                            Uw tech-apparatuur verdient de beste zorg. Wij bieden professionele reparaties met hoogwaardige onderdelen en een unieke haal- en brengservice in Utrecht.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-4 bg-swiss-noir text-white px-10 py-6 font-bold uppercase tracking-widest hover:bg-utrecht-blue transition-all"
                        >
                            Reparatie Aanvragen <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="col-span-12 md:col-span-5 relative aspect-square mt-12 md:mt-0">
                        <Image
                            src="/service_repair.png"
                            alt="Hardware Reparatie Utrecht"
                            fill
                            className="object-cover border border-swiss-gray"
                        />
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24">
                <div className="swiss-grid">
                    <div className="col-span-12 lg:col-span-4">
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-utrecht-blue mb-8">Hoe het werkt</h2>
                        <h3 className="text-3xl md:text-5xl font-bold uppercase leading-tight mb-8">SIMPEL, <br /> SNEL, <br /> STERK.</h3>
                    </div>
                    <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12">
                        {repairItems.map((item, i) => (
                            <div key={i} className="flex flex-col gap-4">
                                <item.icon className="text-utrecht-blue" size={32} />
                                <h4 className="text-xl font-bold uppercase tracking-tight">{item.name}</h4>
                                <p className="text-swiss-noir/60 text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delivery CTA Section */}
            <section className="py-24 bg-swiss-noir text-white overflow-hidden relative">
                <div className="swiss-grid relative z-10">
                    <div className="col-span-12 md:col-span-8">
                        <h2 className="text-4xl md:text-7xl font-bold uppercase mb-8 leading-[0.9]">
                            WIJ KOMEN <br />
                            NAAR <span className="text-utrecht-blue">U TOE.</span>
                        </h2>
                        <p className="text-swiss-gray/60 mb-12 max-w-lg">
                            Of u nu thuis bent of op kantoor, wij halen uw defecte apparaat op en brengen het gerepareerd weer terug. Snel, veilig en zonder extra kosten binnen Utrecht.
                        </p>
                        <Link
                            href="/contact"
                            className="px-12 py-6 bg-utrecht-blue text-white font-bold uppercase tracking-widest hover:bg-white hover:text-utrecht-blue transition-all"
                        >
                            Plan Ophaalservice
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-utrecht-blue/5 skew-x-12 translate-x-20" />
            </section>
        </div>
    );
}
