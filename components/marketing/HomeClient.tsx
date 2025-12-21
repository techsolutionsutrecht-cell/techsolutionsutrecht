"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Monitor, Cpu, Smartphone, Settings } from "lucide-react";
import React from "react";

interface HomeClientProps {
    children?: React.ReactNode;
}

export function HomeClient({ children }: HomeClientProps) {
    return (
        <div className="flex flex-col w-full" suppressHydrationWarning>
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden bg-swiss-noir" suppressHydrationWarning>
                <div className="absolute inset-0 z-0 opacity-50" suppressHydrationWarning>
                    <Image
                        src="/hero.png"
                        alt="Utrecht Tech Hub"
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        sizes="100vw"
                        priority
                    />
                </div>

                <div className="swiss-grid relative z-10" suppressHydrationWarning>
                    <div className="col-span-12 md:col-span-10" suppressHydrationWarning>
                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-8xl text-swiss-stark leading-[0.9] mb-8"
                        >
                            WIJ BOUWEN DE <br />
                            <span className="text-utrecht-blue">DIGITALE TOEKOMST</span> <br />
                            VAN UTRECHT.
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-swiss-gray text-lg md:text-2xl max-w-2xl mb-12 font-medium"
                        >
                            Hoogwaardige webapplicaties, maatwerk software en deskundige hardware ondersteuning voor ambitieuze ondernemers.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="flex flex-wrap gap-4"
                            suppressHydrationWarning
                        >
                            <Link href="/contact" className="px-8 py-4 bg-utrecht-blue text-white font-bold uppercase tracking-widest hover:bg-white hover:text-utrecht-blue transition-all flex items-center gap-3">
                                Start een Project <ArrowRight size={18} />
                            </Link>
                            <Link href="/projects" className="px-8 py-4 border border-swiss-stark text-swiss-stark font-bold uppercase tracking-widest hover:bg-swiss-stark hover:text-swiss-noir transition-all">
                                Bekijk Werk
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block" suppressHydrationWarning>
                    <div className="w-[1px] h-20 bg-swiss-stark/30" suppressHydrationWarning></div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-swiss-stark" suppressHydrationWarning>
                <div className="swiss-grid" suppressHydrationWarning>
                    <div className="col-span-12 mb-20" suppressHydrationWarning>
                        <h2 className="text-xs font-bold tracking-[0.3em] text-utrecht-blue mb-4">ONZE EXPERTISE</h2>
                        <div className="h-[2px] w-24 bg-utrecht-blue" suppressHydrationWarning></div>
                    </div>

                    <div className="col-span-12 md:col-span-4 group p-8 border border-swiss-gray hover:border-utrecht-blue transition-all" suppressHydrationWarning>
                        <Monitor className="mb-8 text-utrecht-blue" size={40} />
                        <h3 className="text-2xl mb-4">Web Design & Development</h3>
                        <p className="text-swiss-noir/60 text-sm leading-relaxed mb-8 text-justify-swiss">
                            Moderne, responsieve websites en e-commerce oplossingen die converteren. Gebouwd met de nieuwste technologieën voor maximale snelheid en SEO.
                        </p>
                        <ul className="text-[10px] font-bold uppercase tracking-widest text-swiss-noir/40 space-y-2">
                            <li>• NEXT.JS / REACT</li>
                            <li>• HEADLESS CMS</li>
                            <li>• E-COMMERCE</li>
                        </ul>
                    </div>

                    <div className="col-span-12 md:col-span-4 group p-8 border border-swiss-gray bg-swiss-noir text-swiss-stark hover:border-utrecht-blue transition-all" suppressHydrationWarning>
                        <Cpu className="mb-8 text-utrecht-blue" size={40} />
                        <h3 className="text-2xl mb-4">Maatwerk Software</h3>
                        <p className="text-swiss-gray/60 text-sm leading-relaxed mb-8 text-justify-swiss">
                            Efficiënte software-architectuur die uw bedrijfsprocessen automatiseert en schaalt. Van interne dashboarden tot complexe API's.
                        </p>
                        <ul className="text-[10px] font-bold uppercase tracking-widest text-swiss-gray/40 space-y-2">
                            <li>• CLOUD SYSTEMS</li>
                            <li>• API INTEGRATIE</li>
                            <li>• DATABASE DESIGN</li>
                        </ul>
                    </div>

                    <div className="col-span-12 md:col-span-4 group p-8 border border-swiss-gray hover:border-utrecht-blue transition-all" suppressHydrationWarning>
                        <Smartphone className="mb-8 text-utrecht-blue" size={40} />
                        <h3 className="text-2xl mb-4">App Development</h3>
                        <p className="text-swiss-noir/60 text-sm leading-relaxed mb-8 text-justify-swiss">
                            Gebruiksvriendelijke mobiele applicaties voor iOS en Android. Focus op performance, security en een naadloze user experience.
                        </p>
                        <ul className="text-[10px] font-bold uppercase tracking-widest text-swiss-noir/40 space-y-2">
                            <li>• REACT NATIVE</li>
                            <li>• MOBILE FIRST</li>
                            <li>• UI/UX DESIGN</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Hardware Support Secondary Section */}
            <section className="py-24 border-t border-swiss-gray overflow-hidden" suppressHydrationWarning>
                <div className="swiss-grid items-center" suppressHydrationWarning>
                    <div className="col-span-12 md:col-span-6 mb-12 md:mb-0" suppressHydrationWarning>
                        <h2 className="text-4xl md:text-6xl mb-8 leading-[0.9]">
                            WIJ KOMEN <br />
                            <span className="text-utrecht-blue">NAAR U TOE</span>
                        </h2>
                        <p className="text-swiss-noir/60 mb-8 max-w-md">
                            Geen tijd om de deur uit te gaan? Geen probleem. Wij bieden een gratis haal- en brengservice voor al uw hardware reparaties in de regio Utrecht.
                        </p>
                        <div className="flex gap-12" suppressHydrationWarning>
                            <div suppressHydrationWarning>
                                <span className="block text-3xl font-bold">Gratis</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-swiss-noir/40">Ophaalservice</span>
                            </div>
                            <div suppressHydrationWarning>
                                <span className="block text-3xl font-bold">Remote</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-swiss-noir/40">Software Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8" suppressHydrationWarning>
                        <div className="relative aspect-video md:aspect-[21/9] overflow-hidden border border-swiss-gray group cursor-default" suppressHydrationWarning>
                            <Image
                                src="/laptop_service.png"
                                alt="Laptop Repair"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                suppressHydrationWarning
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-swiss-noir via-swiss-noir/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" suppressHydrationWarning></div>
                            <div className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full" suppressHydrationWarning>
                                <Settings size={28} className="text-white" />
                            </div>
                            <div className="absolute bottom-8 left-8 right-8" suppressHydrationWarning>
                                <h4 className="font-bold text-3xl text-white mb-2 tracking-tight">LAPTOPS</h4>
                                <p className="text-white/80 text-lg font-medium">Professional Software & Hardware Solutions</p>
                                <div className="h-[2px] w-12 bg-utrecht-blue mt-4 group-hover:w-24 transition-all duration-500" suppressHydrationWarning></div>
                            </div>
                        </div>

                        <div className="relative aspect-video md:aspect-[21/9] overflow-hidden border border-swiss-gray group cursor-default" suppressHydrationWarning>
                            <Image
                                src="/smartphone_service.png"
                                alt="Smartphone Repair"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                suppressHydrationWarning
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-swiss-noir via-swiss-noir/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" suppressHydrationWarning></div>
                            <div className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full" suppressHydrationWarning>
                                <Smartphone size={28} className="text-white" />
                            </div>
                            <div className="absolute bottom-8 left-8 right-8" suppressHydrationWarning>
                                <h4 className="font-bold text-3xl text-white mb-2 tracking-tight">SMARTPHONES</h4>
                                <p className="text-white/80 text-lg font-medium">Expert Screen & Battery Replacement</p>
                                <div className="h-[2px] w-12 bg-utrecht-blue mt-4 group-hover:w-24 transition-all duration-500" suppressHydrationWarning></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-utrecht-blue text-white" suppressHydrationWarning>
                <div className="swiss-grid text-center" suppressHydrationWarning>
                    <div className="col-span-12" suppressHydrationWarning>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            suppressHydrationWarning
                        >
                            <h2 className="text-5xl md:text-7xl mb-12">KLAAR OM TE STARTEN?</h2>
                            <Link href="/contact" className="inline-block px-12 py-6 bg-white text-utrecht-blue font-bold uppercase tracking-[0.3em] hover:bg-swiss-noir hover:text-white transition-all">
                                Neem Contact Op
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
            {children}
        </div>
    );
}
