"use client";

import { useEffect, useState } from "react";
import { TOCItem } from "@/lib/blog-utils";
import { Hash } from "lucide-react";

export default function TableOfContents({ items }: { items: TOCItem[] }) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0% -80% 0%" }
        );

        items.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [items]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    if (items.length === 0) return null;

    return (
        <nav className="space-y-4">
            <div className="flex items-center gap-2 mb-8">
                <Hash size={16} className="text-utrecht-blue" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-swiss-noir">Inhoudsopgave</span>
            </div>
            <ul className="space-y-4">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={`text-sm font-bold block transition-all hover:text-utrecht-blue border-l-4 pl-4 ${activeId === item.id
                                    ? "border-utrecht-blue text-utrecht-blue bg-utrecht-blue/5"
                                    : "border-swiss-gray text-swiss-noir/40 hover:border-swiss-noir"
                                }`}
                        >
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
