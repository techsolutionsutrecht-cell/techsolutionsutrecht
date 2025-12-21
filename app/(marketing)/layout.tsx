import { SignatureNav } from "@/components/navigation/MainHeader";
import { Footer } from "@/components/navigation/Footer";
import { CookieConsent } from "@/components/marketing/CookieConsent";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col" suppressHydrationWarning>
            <SignatureNav />
            <main className="flex-grow pt-20" suppressHydrationWarning>
                {children}
            </main>
            <Footer />
            <CookieConsent />
        </div>
    );
}
