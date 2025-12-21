"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function subscribeAction(email: string) {
    try {
        if (!email || !email.includes("@")) {
            return { success: false, error: "Ongeldig e-mailadres." };
        }

        // Check if already subscribed
        if (!(prisma as any).newsletterSubscription) {
            console.error("newsletterSubscription is missing on prisma client!");
            console.log("Available keys:", Object.keys(prisma).filter(k => !k.startsWith('_')));
            return { success: false, error: "Database configuratie fout." };
        }

        const existing = await (prisma as any).newsletterSubscription.findUnique({
            where: { email }
        });

        if (existing) {
            return { success: false, error: "U bent al ingeschreven." };
        }

        await (prisma as any).newsletterSubscription.create({
            data: { email }
        });

        revalidatePath("/admin/subscriptions"); // Future proofing
        return { success: true };
    } catch (error) {
        console.error("Subscription error:", error);
        return { success: false, error: "Interne serverfout." };
    }
}
