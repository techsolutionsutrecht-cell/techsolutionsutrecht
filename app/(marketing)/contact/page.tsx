"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/metadata";
import { MapPin, Phone, ArrowRight, ArrowLeft, Globe, Code2, Smartphone, HelpCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createContactMessage } from "@/actions/content-actions";

const steps = [
    {
        id: "service",
        title: "WAAR KUNNEN WE BIJ HELPEN?",
        subtitle: "Selecteer een dienst om uw project te starten.",
    },
    {
        id: "details",
        title: "DE DETAILS.",
        subtitle: "Vertel ons iets meer over uw visie.",
    },
    {
        id: "contact",
        title: "WIE BENT U?",
        subtitle: "Hoe kunnen we u bereiken?",
    }
];

const services = [
    { id: "web", icon: Globe, label: "Web Design" },
    { id: "software", icon: Code2, label: "Software" },
    { id: "repair", icon: Smartphone, label: "Reparatie" },
    { id: "other", icon: HelpCircle, label: "Anders" },
];

export default function ContactPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        service: "",
        details: "",
        name: "",
        email: "",
    });

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const isStepComplete = () => {
        if (currentStep === 0) return formData.service !== "";
        if (currentStep === 1) return formData.details.length > 5;
        return formData.name && formData.email;
    };

    const handleSubmit = async () => {
        if (!isStepComplete()) return;
        setIsSubmitting(true);
        try {
            await createContactMessage(formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Er is iets misgegaan. Probeer het later opnieuw.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="py-24 min-h-[80vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8 max-w-lg px-6"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-4">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold uppercase leading-[0.9]">BERICHT <br /><span className="text-utrecht-blue">ONTVANGEN.</span></h1>
                    <p className="text-swiss-noir/60 text-lg">Bedankt voor uw aanvraag, {formData.name}. We nemen binnen 24 uur contact met u op om uw project te bespreken.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-10 py-5 bg-swiss-noir text-white font-bold uppercase tracking-widest hover:bg-utrecht-blue transition-all"
                    >
                        Terug naar Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="py-24 min-h-[80vh] flex flex-col justify-center" suppressHydrationWarning>
            <div className="swiss-grid">
                <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4">

                    {/* Progress Indicator */}
                    <div className="flex gap-2 mb-12">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1 transition-all duration-500",
                                    i <= currentStep ? "w-8 bg-utrecht-blue" : "w-2 bg-swiss-gray"
                                )}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                        >
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-utrecht-blue mb-4">
                                STAP {currentStep + 1} VAN {steps.length}
                            </h2>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase leading-[0.9]">
                                {steps[currentStep].title}
                            </h1>
                            <p className="text-swiss-noir/40 mb-12 font-medium">
                                {steps[currentStep].subtitle}
                            </p>

                            {/* Step 1: Services */}
                            {currentStep === 0 && (
                                <div className="grid grid-cols-2 gap-4">
                                    {services.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                setFormData({ ...formData, service: s.id });
                                                setTimeout(nextStep, 300);
                                            }}
                                            className={cn(
                                                "p-8 border text-left transition-all group flex flex-col gap-6",
                                                formData.service === s.id
                                                    ? "border-utrecht-blue bg-utrecht-blue/5"
                                                    : "border-swiss-gray hover:border-swiss-noir"
                                            )}
                                        >
                                            <s.icon size={24} className={cn(formData.service === s.id ? "text-utrecht-blue" : "text-swiss-noir/40")} />
                                            <span className="font-bold uppercase tracking-widest text-xs">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 2: Details */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div className="p-8 border border-swiss-gray bg-white">
                                        <textarea
                                            autoFocus
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                            className="w-full text-xl md:text-2xl font-bold bg-transparent border-none placeholder:text-swiss-gray focus:outline-none resize-none min-h-[250px]"
                                            placeholder="Wat is uw uitdaging?"
                                        />
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-noir/20 flex justify-between">
                                        <span>Minimaal 5 karakters.</span>
                                        <span>{formData.details.length} karakters</span>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Identity */}
                            {currentStep === 2 && (
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-8 border border-swiss-gray bg-white space-y-2 group focus-within:border-utrecht-blue transition-colors">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-swiss-noir/40 group-focus-within:text-utrecht-blue transition-colors">Naam</label>
                                        <input
                                            type="text"
                                            autoFocus
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full text-xl font-bold focus:outline-none bg-transparent"
                                            placeholder="Uw naam"
                                        />
                                    </div>
                                    <div className="p-8 border border-swiss-gray bg-white space-y-2 group focus-within:border-utrecht-blue transition-colors">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-swiss-noir/40 group-focus-within:text-utrecht-blue transition-colors">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full text-xl font-bold focus:outline-none bg-transparent"
                                            placeholder="uw@email.nl"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="mt-16 flex justify-between items-center">
                                {currentStep > 0 ? (
                                    <button
                                        onClick={prevStep}
                                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-swiss-noir/40 hover:text-swiss-noir transition-colors"
                                    >
                                        <ArrowLeft size={16} /> Terug
                                    </button>
                                ) : <div />}

                                {currentStep < steps.length - 1 ? (
                                    <button
                                        disabled={!isStepComplete()}
                                        onClick={nextStep}
                                        className={cn(
                                            "flex items-center gap-4 px-10 py-6 font-bold uppercase tracking-widest transition-all",
                                            isStepComplete()
                                                ? "bg-swiss-noir text-white hover:bg-utrecht-blue shadow-xl shadow-utrecht-blue/10"
                                                : "bg-swiss-gray text-swiss-noir/20 cursor-not-allowed"
                                        )}
                                    >
                                        Volgende <ArrowRight size={20} />
                                    </button>
                                ) : (
                                    <button
                                        disabled={!isStepComplete() || isSubmitting}
                                        onClick={handleSubmit}
                                        className={cn(
                                            "flex items-center gap-4 px-10 py-6 font-bold uppercase tracking-widest transition-all",
                                            isStepComplete() && !isSubmitting
                                                ? "bg-utrecht-blue text-white hover:bg-swiss-noir shadow-xl shadow-utrecht-blue/20"
                                                : "bg-swiss-gray text-swiss-noir/20 cursor-not-allowed",
                                            isSubmitting && "opacity-70 animate-pulse"
                                        )}
                                    >
                                        {isSubmitting ? "Versturen..." : "Versturen"} <ArrowRight size={20} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Social / Mini Info */}
                    <div className="mt-24 pt-12 border-t border-swiss-gray flex flex-wrap gap-12 opacity-40 grayscale group hover:opacity-100 transition-all">
                        <div className="flex items-center gap-3">
                            <MapPin size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{siteConfig.address.area}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{siteConfig.tel}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
