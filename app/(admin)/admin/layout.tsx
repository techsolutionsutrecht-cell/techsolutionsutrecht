"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, FileText, Mail, LogOut, Home } from "lucide-react";

import Image from "next/image";

const adminNav = [
    { name: "Overzicht", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projecten", href: "/admin/projects", icon: Briefcase },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Berichten", href: "/admin/contacts", icon: Mail },
    { name: "Inschrijvingen", href: "/admin/subscriptions", icon: Mail }, // Using Mail icon for now
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-swiss-stark" suppressHydrationWarning>
            {/* Admin Sidebar */}
            <aside className="w-64 bg-swiss-noir text-white flex flex-col fixed inset-y-0 z-50" suppressHydrationWarning>
                <div className="p-8 border-b border-white/10" suppressHydrationWarning>
                    <div className="flex items-center gap-4" suppressHydrationWarning>
                        <div className="relative w-8 h-8" suppressHydrationWarning>
                            <Image
                                src="/logo-tsu.png"
                                alt="Admin Logo"
                                fill
                                className="object-contain"
                                sizes="32px"
                                suppressHydrationWarning
                            />
                        </div>
                        <span className="font-bold tracking-tight text-sm uppercase">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-grow p-4 mt-4 space-y-2">
                    {adminNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all group",
                                pathname === item.href
                                    ? "bg-utrecht-blue text-white"
                                    : "text-swiss-gray/40 hover:text-white"
                            )}
                        >
                            <item.icon size={18} className={cn(pathname === item.href ? "text-white" : "group-hover:text-utrecht-blue")} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2" suppressHydrationWarning>
                    <Link href="/" className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-swiss-gray/40 hover:text-white transition-all">
                        <Home size={18} />
                        Naar Website
                    </Link>
                    <button className="w-full flex items-center gap-4 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                        <LogOut size={18} />
                        Uitloggen
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow ml-64 p-12" suppressHydrationWarning>
                {children}
            </main>
        </div>
    );
}
