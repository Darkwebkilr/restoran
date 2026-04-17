import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

const bricolage = Bricolage_Grotesque({
    variable: "--font-display",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Evolution Ajans | Akıllı Rezervasyon & Giriş Sistemi",
    description: "En seçkin restoranlarda yerini ayırt, kapıda sıra bekleme.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="tr"
            className={`${bricolage.variable} ${inter.variable} h-full antialiased dark`}
        >
            <body className="min-h-full  flex flex-col font-sans bg-background text-foreground selection:bg-accent selection:text-black">
                <Header />
                <div className="z-30 cursor-pointer fixed bottom-12 right-10 text-white items-center text-lg bg-green-600/50 rounded-2xl p-2 gap-3 flex">
                    <span>Whatsapp Destek</span>
                    <SiWhatsapp className="" color="default" size={64}></SiWhatsapp>
                </div>
                {children}
                <Footer />
            </body>
        </html>
    );
}
