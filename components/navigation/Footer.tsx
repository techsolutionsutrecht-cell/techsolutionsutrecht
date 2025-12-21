"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/metadata";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Footer() {
    const [year, setYear] = useState<number | string>("...");

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-swiss-noir text-swiss-stark py-20 mt-auto" suppressHydrationWarning>
            <div className="swiss-grid" suppressHydrationWarning>
                <div className="col-span-12 md:col-span-4 mb-12 md:mb-0" suppressHydrationWarning>
                    <div className="flex items-center gap-4 mb-6" suppressHydrationWarning>
                        <div className="relative w-20 h-20" suppressHydrationWarning>
                            <Image
                                src="/logoo.png"
                                alt="TechSolutionsUtrecht Logo"
                                fill
                                className="object-contain"
                                sizes="80px"
                                suppressHydrationWarning
                            />
                        </div>
                        <span className="font-bold tracking-tighter text-xl">
                            TECHSOLUTIONS<span className="text-utrecht-blue">UTRECHT</span>
                        </span>
                    </div>
                    <p className="text-swiss-gray/60 text-sm max-w-xs leading-relaxed">
                        Wij transformeren ideeën in digitale uitmuntendheid. Uw partner in Utrecht voor software ontwikkeling en hardware support op locatie.
                    </p>
                </div>

                <div className="col-span-6 md:col-span-2" suppressHydrationWarning>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-utrecht-blue">Diensten</h4>
                    <ul className="space-y-4 text-sm text-swiss-gray/60">
                        <li><Link href="/services/web-design" className="hover:text-swiss-stark transition-colors">Web Design</Link></li>
                        <li><Link href="/services/software" className="hover:text-swiss-stark transition-colors">Software Ontwikkeling</Link></li>
                        <li><Link href="/services/repair" className="hover:text-swiss-stark transition-colors">Hardware Reparatie</Link></li>
                    </ul>
                </div>

                <div className="col-span-6 md:col-span-2" suppressHydrationWarning>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-utrecht-blue">Bedrijf</h4>
                    <ul className="space-y-4 text-sm text-swiss-gray/60">
                        <li><Link href="/projects" className="hover:text-swiss-stark transition-colors">Projecten</Link></li>
                        <li><Link href="/blog" className="hover:text-swiss-stark transition-colors">Blog</Link></li>
                        <li><Link href="/contact" className="hover:text-swiss-stark transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div className="col-span-12 md:col-span-4 mt-12 md:mt-0" suppressHydrationWarning>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-utrecht-blue">Locatie</h4>
                    <address className="not-italic text-sm text-swiss-gray/60 space-y-4">
                        <p>{siteConfig.address.area}<br />{siteConfig.address.city}, {siteConfig.address.country}</p>
                        <p>{siteConfig.address.area}<br />{siteConfig.address.city}, {siteConfig.address.country}</p>
                        <p>Email: {siteConfig.email}</p>
                        <p>Tel: {siteConfig.tel}</p>
                    </address>
                </div>

                <div className="col-span-12 pt-20 mt-20 border-t border-swiss-gray/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-swiss-gray/30" suppressHydrationWarning>
                    <p>© {year} TechSolutionsUtrecht. ALLE RECHTEN VOORBEHOUDEN.</p>
                    <div className="flex gap-8" suppressHydrationWarning>
                        <Link href="/privacy" className="hover:text-swiss-stark transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-swiss-stark transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
