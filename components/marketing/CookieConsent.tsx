"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Cookie } from "lucide-react";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500); // Trigger after 1.5s for better UX
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, x: "50%", opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 right-6 z-[200] w-[calc(100%-3rem)] max-w-sm"
                    suppressHydrationWarning
                >
                    <div className="bg-white brutal-border brutal-shadow-sm p-6 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -right-4 -top-4 text-swiss-gray/20 -rotate-12 pointer-events-none">
                            <Cookie size={120} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-utrecht-blue text-white brutal-border border-2">
                                    <Cookie size={20} />
                                </div>
                                <h3 className="text-sm font-black tracking-widest m-0">
                                    Cookie Instellingen
                                </h3>
                            </div>

                            <p className="text-xs font-medium text-swiss-noir/70 leading-relaxed mb-6">
                                Wij gebruiken cookies om uw ervaring te verbeteren en het websiteverkeer te analyseren. Door op "Accepteren" te klikken, gaat u akkoord met ons gebruik van cookies.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 px-4 py-2 bg-utrecht-blue text-white text-[10px] font-bold uppercase tracking-[0.2em] brutal-border border-2 transition-transform active:scale-95 hover:-translate-y-0.5"
                                >
                                    Accepteren
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 px-4 py-2 bg-white text-swiss-noir text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-swiss-noir transition-transform active:scale-95 hover:bg-swiss-gray"
                                >
                                    Weigeren
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 p-1 text-swiss-noir/40 hover:text-swiss-noir transition-colors"
                            aria-label="Sluiten"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
