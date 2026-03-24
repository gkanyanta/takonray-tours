import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFAB } from "@/components/layout/whatsapp-fab";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Takonray Tours - Adventure Awaits in Livingstone, Zambia",
    template: "%s | Takonray Tours",
  },
  description:
    "Discover the best tours, safaris, and adventures in Livingstone, Zambia. From Victoria Falls to thrilling river safaris, Takonray Tours crafts unforgettable experiences.",
  keywords: [
    "Livingstone tours",
    "Zambia safari",
    "Victoria Falls",
    "adventure tours",
    "Takonray Tours",
    "African safari",
    "bungee jumping Zambia",
    "river cruise Zambezi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans antialiased",
        plusJakartaSans.variable,
        inter.variable
      )}
    >
      <body className="min-h-screen bg-background">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFAB />
        </SessionProvider>
      </body>
    </html>
  );
}
