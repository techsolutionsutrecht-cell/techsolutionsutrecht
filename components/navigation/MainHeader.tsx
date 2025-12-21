"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Projecten", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
];

export function SignatureNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [year, setYear] = useState<number | string>("...");

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-[100] border-b border-swiss-gray bg-swiss-stark/80 backdrop-blur-md" suppressHydrationWarning>
                <div className="swiss-grid h-20 items-center overflow-hidden" suppressHydrationWarning>
                    {/* Logo Section */}
                    <div className="col-span-1 md:col-span-3 flex items-center" suppressHydrationWarning>
                        <Link href="/" className="group flex items-center gap-3" suppressHydrationWarning>
                            <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0" suppressHydrationWarning>
                                <Image
                                    src="/logo-tsu.png"
                                    alt="TSU"
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 56px, 64px"
                                    priority
                                />
                            </div>
                            <span className="font-bold tracking-tighter text-lg hidden sm:inline-block md:inline-block">
                                TECHSOLUTIONS<span className="text-utrecht-blue">UTRECHT</span>
                            </span>
                        </Link>
                    </div>

                    {/* Mobile Center Name - 2 columns in 4-column mobile grid */}
                    <div className="col-span-2 flex justify-center md:hidden" suppressHydrationWarning>
                        <span className="font-bold tracking-tighter text-[10px] xs:text-xs sm:text-base text-center leading-none uppercase">
                            TECHSOLUTIONS<br className="xs:hidden" />
                            <span className="text-utrecht-blue xs:ml-1">UTRECHT</span>
                        </span>
                    </div>

                    {/* Desktop/Center Nav */}
                    <nav className="hidden md:flex md:col-span-6 justify-center gap-8 lg:gap-12" suppressHydrationWarning>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium uppercase tracking-widest transition-colors hover:text-utrecht-blue relative py-1",
                                    pathname === item.href ? "text-utrecht-blue" : "text-swiss-noir/60"
                                )}
                            >
                                {item.name}
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 w-full h-[2px] bg-utrecht-blue"
                                        suppressHydrationWarning
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Action / Mobile Trigger */}
                    <div className="col-span-1 md:col-span-3 flex justify-end items-center" suppressHydrationWarning>
                        <Link
                            href="/contact"
                            className="hidden md:inline-block px-6 py-2 border border-swiss-noir text-xs font-bold uppercase tracking-widest hover:bg-swiss-noir hover:text-swiss-stark transition-all"
                        >
                            Start Project
                        </Link>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-swiss-noir transition-colors hover:text-utrecht-blue"
                            aria-label="Toggle Menu"
                            suppressHydrationWarning
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-swiss-noir/60 backdrop-blur-sm z-[90] md:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-20 bottom-0 w-[80%] max-w-sm bg-swiss-stark z-[91] md:hidden border-l border-swiss-gray p-8 flex flex-col"
                        >
                            <nav className="flex flex-col gap-8 flex-grow">
                                {navItems.map((item, i) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "text-3xl font-bold uppercase tracking-tighter transition-colors hover:text-utrecht-blue block",
                                                pathname === item.href ? "text-utrecht-blue" : "text-swiss-noir"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="mt-auto" suppressHydrationWarning>
                                <Link
                                    href="/contact"
                                    className="block w-full text-center py-4 bg-utrecht-blue text-white font-bold uppercase tracking-widest hover:bg-swiss-noir transition-all"
                                >
                                    Start een Project
                                </Link>
                                <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-swiss-noir/40 text-center">
                                    © {year} TECHSOLUTIONS UTRECHT
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
