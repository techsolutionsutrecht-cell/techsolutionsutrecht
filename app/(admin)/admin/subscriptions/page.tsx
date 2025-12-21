import { prisma } from "@/lib/prisma";
import { Mail, Calendar, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
    // Attempt to fetch subscriptions, handling the potentially undefined model
    let subscriptions: any[] = [];
    let error: string | null = null;

    try {
        // @ts-ignore - Handle the case where Prisma might not have generated the model correctly yet
        subscriptions = await prisma.newsletterSubscription.findMany({
            orderBy: { createdAt: "desc" }
        });
    } catch (e: any) {
        console.error("Failed to fetch subscriptions:", e);
        error = e.message;
    }

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-xs font-bold tracking-[0.3em] text-utrecht-blue mb-4 uppercase">Newsletter</h2>
                    <h1 className="text-5xl font-bold uppercase tracking-tighter">Inschrijvingen</h1>
                </div>
                <div className="text-right">
                    <span className="block text-3xl font-bold">{subscriptions.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-swiss-gray/40">Totaal</span>
                </div>
            </header>

            {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-xs">
                    Error loading subscriptions: {error}
                </div>
            )}

            <div className="brutal-border bg-white overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-swiss-noir text-white text-[10px] font-bold uppercase tracking-widest">
                        <tr>
                            <th className="p-6">Email</th>
                            <th className="p-6">Datum</th>
                            <th className="p-6 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-swiss-gray">
                        {subscriptions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-swiss-stark transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-utrecht-blue" />
                                        <span className="font-bold">{sub.email}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-swiss-noir/40 text-xs font-medium">
                                        <Calendar size={14} />
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="p-2 text-swiss-noir/20 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {subscriptions.length === 0 && !error && (
                            <tr>
                                <td colSpan={3} className="p-12 text-center text-swiss-noir/40 uppercase tracking-widest font-black">
                                    Nog geen inschrijvingen.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
