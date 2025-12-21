"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24" suppressHydrationWarning>
            <div className="swiss-grid">
                <article className="col-span-12 md:col-span-8 md:col-start-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 uppercase leading-none">
                            Privacy <br />
                            <span className="text-utrecht-blue">Policy</span>
                        </h1>

                        <div className="prose prose-lg max-w-none text-swiss-noir/70 leading-relaxed space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-swiss-noir uppercase tracking-widest mb-4">1. Inleiding</h2>
                                <p>
                                    TechSolutionsUtrecht respecteert uw privacy en zet zich in voor de bescherming van uw persoonlijke gegevens. Deze privacyverklaring informeert u over hoe wij omgaan met uw persoonlijke gegevens wanneer u onze website bezoekt en informeert u over uw privacyrechten.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-swiss-noir uppercase tracking-widest mb-4">2. Gegevens die wij verzamelen</h2>
                                <p>
                                    Wij kunnen de volgende categorieën persoonlijke gegevens verzamelen, gebruiken, opslaan en overdragen:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Identiteitsgegevens:</strong> voornaam, achternaam.</li>
                                    <li><strong>Contactgegevens:</strong> e-mailadres, telefoonnummer.</li>
                                    <li><strong>Technische gegevens:</strong> IP-adres, browsertype en -versie, tijdzone-instelling en locatie.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-swiss-noir uppercase tracking-widest mb-4">3. Hoe wij uw gegevens gebruiken</h2>
                                <p>
                                    Wij gebruiken uw gegevens alleen wanneer de wet ons dat toestaat. Meestal zullen wij uw gegevens gebruiken in de volgende omstandigheden:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Om de overeenkomst die wij met u gaan afsluiten of hebben afgesloten uit te voeren.</li>
                                    <li>Wanneer het noodzakelijk is voor onze gerechtvaardigde belangen.</li>
                                    <li>Wanneer wij moeten voldoen aan een wettelijke verplichting.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-swiss-noir uppercase tracking-widest mb-4">4. Informatiebeveiliging</h2>
                                <p>
                                    Wij hebben passende beveiligingsmaatregelen getroffen om te voorkomen dat uw persoonlijke gegevens per ongeluk verloren gaan, worden gebruikt of op ongeoorloofde wijze worden geraadpleegd, gewijzigd of openbaar gemaakt.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-swiss-noir uppercase tracking-widest mb-4">5. Uw wettelijke rechten</h2>
                                <p>
                                    Onder bepaalde omstandigheden heeft u rechten onder de gegevensbeschermingswetgeving met betrekking tot uw persoonlijke gegevens, waaronder het recht om toegang te vragen, correctie te vragen, verwijdering te vragen of bezwaar te maken tegen de verwerking.
                                </p>
                            </section>

                            <section className="pt-12 border-t border-swiss-gray/20">
                                <p className="text-sm text-swiss-gray/60 italic">
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
