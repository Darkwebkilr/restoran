import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { createClient } from "@/utils/supabase/server";

const bricolage = Bricolage_Grotesque({
    variable: "--font-display",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
    try {
        const supabase = await createClient();
        const { data } = await supabase.from("settings").select("*");
        const getVal = (key: string, fallback: string) => data?.find(s => s.key === key)?.value || fallback;

        const title = getVal("site_meta_title", "Bodrumun Mekanları | Akıllı Rezervasyon & Giriş Sistemi");
        const description = getVal("site_meta_description", "Bodrum'un en seçkin mekanları, paket servis ve rezervasyon sistemi. En iyi masalarda yerinizi hemen ayırtın.");
        const keywords = getVal("site_meta_keywords", "bodrum restoranları, bodrum mekanları, vip rezervasyon, paket servis, akşam yemeği");

        return {
            title,
            description,
            keywords: keywords ? keywords.split(",").map((k: string) => k.trim()) : undefined,
            openGraph: {
                title,
                description,
                siteName: "Bodrumun Mekanları",
                locale: "tr_TR",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
            }
        };
    } catch (e) {
        return {
            title: "Bodrumun Mekanları | Akıllı Rezervasyon & Giriş Sistemi",
            description: "En seçkin restoranlarda yerini ayırt, kapıda sıra bekleme.",
        };
    }
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let whatsappNumber = "";
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("settings")
            .select("value")
            .eq("key", "whatsapp_number")
            .maybeSingle();
        if (data) {
            whatsappNumber = data.value || "";
        }
    } catch (e) {
        console.warn("Failed to fetch WhatsApp number in RootLayout:", e);
    }

    return (
        <html
            lang="tr"
            className={`${bricolage.variable} ${inter.variable} h-full antialiased dark`}
        >
            <body className="min-h-full  flex flex-col font-sans bg-background text-foreground selection:bg-accent selection:text-black">
                <Header />
                {whatsappNumber ? (
                    <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="z-50 cursor-pointer fixed bottom-12 right-6 text-white items-center text-lg bg-green-600/50 hover:bg-green-600/70 hover:scale-105 transition-all duration-300 rounded-2xl p-2 gap-3 flex decoration-none"
                    >
                        <span>Whatsapp Destek</span>
                        <SiWhatsapp className="" color="default" size={48}></SiWhatsapp>
                    </a>
                ) : (
                    <div className="z-50 cursor-pointer fixed bottom-12 right-6 text-white items-center text-lg bg-green-600/50 rounded-2xl p-2 gap-3 flex">
                        <span>Whatsapp Destek</span>
                        <SiWhatsapp className="" color="default" size={48}></SiWhatsapp>
                    </div>
                )}
                {children}
                <Footer />
            </body>
        </html>
    );
}
