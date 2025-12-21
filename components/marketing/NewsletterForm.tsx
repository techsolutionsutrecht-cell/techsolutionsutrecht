"use client";

import { useState } from "react";
import { subscribeAction } from "@/actions/newsletter-actions";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const result = await subscribeAction(email);
            if (result.success) {
                setStatus("success");
                setMessage("Bedankt voor het inschrijven!");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(result.error || "Er is iets misgegaan.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Er is een onverwachte fout opgetreden.");
        }
    };

    return (
        <div className="w-full lg:w-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-transparent border-b-4 border-swiss-stark/20 p-4 text-xl font-black focus:border-utrecht-blue outline-none transition-colors sm:min-w-[300px]"
                        required
                        disabled={status === "loading" || status === "success"}
                    />
                    {status === "success" && (
                        <p className="mt-2 text-green-400 font-bold uppercase tracking-widest text-xs">{message}</p>
                    )}
                    {status === "error" && (
                        <p className="mt-2 text-red-500 font-bold uppercase tracking-widest text-xs">{message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="bg-utrecht-blue text-white font-black uppercase tracking-widest p-4 px-8 hover:bg-white hover:text-utrecht-blue transition-all brutal-border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === "loading" ? "Laden..." : "Subscribe"}
                </button>
            </form>
        </div>
    );
}
