import { prisma } from "@/lib/prisma";
import { Mail, Check, Trash2, User } from "lucide-react";
import { markContactAsRead, deleteContactMessage } from "@/actions/content-actions";
import { ContactMessage } from "@prisma/client";

export default async function AdminContacts() {
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-12" suppressHydrationWarning>
            <div suppressHydrationWarning>
                <h1 className="text-4xl font-bold mb-2 uppercase">Berichten</h1>
                <p className="text-swiss-noir/40 text-sm font-medium">Beheer binnenkomende aanvragen en inquiries.</p>
            </div>

            <div className="bg-white border border-swiss-gray overflow-hidden" suppressHydrationWarning>
                <div className="divide-y divide-swiss-gray" suppressHydrationWarning>
                    {messages.length === 0 ? (
                        <div className="p-20 text-center">
                            <p className="text-swiss-noir/40 uppercase tracking-widest text-xs font-bold">Geen berichten ontvangen.</p>
                        </div>
                    ) : (
                        messages.map((msg: ContactMessage) => (
                            <div key={msg.id} className="p-8 hover:bg-swiss-stark/50 transition-all flex items-center gap-8" suppressHydrationWarning>
                                <div className="w-12 h-12 bg-swiss-stark flex items-center justify-center text-swiss-noir/40" suppressHydrationWarning>
                                    <User size={20} />
                                </div>
                                <div className="flex-grow" suppressHydrationWarning>
                                    <div className="flex items-center gap-3 mb-1" suppressHydrationWarning>
                                        <p className="font-bold text-sm">{msg.name}</p>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${!msg.isRead ? 'bg-utrecht-blue/10 text-utrecht-blue' : 'bg-green-100 text-green-700'}`}>
                                            {!msg.isRead ? 'Nieuw' : 'Gelezen'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-swiss-noir/60">{msg.email} • {msg.service}</p>
                                    <p className="text-sm mt-3 text-swiss-noir/80 line-clamp-2 italic">"{msg.details}"</p>
                                </div>
                                <div className="text-right" suppressHydrationWarning>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-swiss-noir/20 mb-4" suppressHydrationWarning>
                                        {new Date(msg.createdAt).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' })}
                                    </p>
                                    <div className="flex gap-4 justify-end" suppressHydrationWarning>
                                        {!msg.isRead && (
                                            /* اصلاح شده: استفاده از یک تابع async برای فراخوانی اکشن */
                                            <form action={async () => { "use server"; await markContactAsRead(msg.id); }}>
                                                <button type="submit" className="text-swiss-noir/40 hover:text-green-500 transition-colors">
                                                    <Check size={16} />
                                                </button>
                                            </form>
                                        )}
                                        <a href={`mailto:${msg.email}`} className="text-swiss-noir/40 hover:text-utrecht-blue transition-colors">
                                            <Mail size={16} />
                                        </a>
                                        {/* اصلاح شده: استفاده از یک تابع async برای فراخوانی اکشن حذف */}
                                        <form action={async () => { "use server"; await deleteContactMessage(msg.id); }}>
                                            <button type="submit" className="text-swiss-noir/40 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}