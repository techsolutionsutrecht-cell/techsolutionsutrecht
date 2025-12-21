"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <div className="bg-swiss-noir text-swiss-stark min-h-screen pt-32 pb-24" suppressHydrationWarning>
            <div className="swiss-grid">
                <article className="col-span-12 md:col-span-8 md:col-start-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 uppercase leading-none">
                            Terms of <br />
                            <span className="text-utrecht-blue">Service</span>
                        </h1>

                        <div className="prose prose-lg prose-invert max-w-none text-swiss-gray/70 leading-relaxed space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-swiss-stark uppercase tracking-widest mb-4">1. Algemene Voorwaarden</h2>
                                <p>
                                    Door gebruik te maken van de website en diensten van TechSolutionsUtrecht, gaat u akkoord met deze algemene voorwaarden. Lees deze zorgvuldig door voordat u onze diensten gebruikt.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-swiss-stark uppercase tracking-widest mb-4">2. Dienstverlening</h2>
                                <p>
                                    TechSolutionsUtrecht biedt software-ontwikkeling, webdesign en hardware-ondersteuning aan. Wij streven naar de hoogste kwaliteit, maar kunnen geen 100% foutloze werking garanderen voor alle systemen.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-swiss-stark uppercase tracking-widest mb-4">3. Betalingsvoorwaarden</h2>
                                <p>
                                    Alle facturen dienen binnen 14 dagen na factuurdatum te worden voldaan, tenzij schriftelijk anders is overeengekomen. Bij te late betaling behoudt TechSolutionsUtrecht zich het recht voor om de dienstverlening te staken.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-swiss-stark uppercase tracking-widest mb-4">4. Intellectueel Eigendom</h2>
                                <p>
                                    Tenzij anders overeengekomen, blijven alle intellectuele eigendomsrechten van door TechSolutionsUtrecht ontwikkelde materialen bij TechSolutionsUtrecht tot de volledige betaling is voldaan.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-swiss-stark uppercase tracking-widest mb-4">5. Aansprakelijkheid</h2>
                                <p>
                                    TechSolutionsUtrecht is niet aansprakelijk voor indirecte schade, gevolgschade, gederfde winst of gemiste besparingen. De totale aansprakelijkheid is beperkt tot het factuurbedrag van de betreffende opdracht.
                                </p>
                            </section>

                            <section className="pt-12 border-t border-swiss-gray/10">
                                <p className="text-sm text-swiss-gray/40 italic">
                                    Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </section>
                        </div>
                    </motion.div>
                </article>
            </div>
        </div>
    );
}
