import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { baseMetadata } from "@/lib/metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Prevents render blocking
  preload: true,
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-[#F5F5F5] text-[#0A0A0A]`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const scrub = (el) => {
                  if (el.hasAttribute('bis_skin_checked')) el.removeAttribute('bis_skin_checked');
                };
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      scrub(mutation.target);
                    }
                    if (mutation.type === 'childList') {
                      mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                          scrub(node);
                          node.querySelectorAll('[bis_skin_checked]').forEach(scrub);
                        }
                      });
                    }
                  });
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked']
                });
                document.querySelectorAll('[bis_skin_checked]').forEach(scrub);
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
