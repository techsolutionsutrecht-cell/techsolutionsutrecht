"use client";

import { motion } from "framer-motion";
import { Briefcase, FileText, Mail, Users, ArrowUpRight } from "lucide-react";

interface StatsGridProps {
    counts: {
        projects: number;
        blogs: number;
        messages: number;
    }
}

export default function StatsGrid({ counts }: StatsGridProps) {
    const stats = [
        { name: "Actieve Projecten", value: counts.projects.toString(), icon: Briefcase, color: "text-blue-500" },
        { name: "Blog Posts", value: counts.blogs.toString(), icon: FileText, color: "text-green-500" },
        { name: "Nieuwe Berichten", value: counts.messages.toString(), icon: Mail, color: "text-orange-500" },
        { name: "Website Bezoeken", value: "0", icon: Users, color: "text-purple-500" }, // Placeholder for now
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-8 border border-swiss-gray"
                >
                    <div className="flex justify-between items-start mb-4">
                        <stat.icon size={24} className={stat.color} />
                        <ArrowUpRight size={16} className="text-swiss-gray" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-swiss-noir/40 mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
            ))}
        </div>
    );
}
