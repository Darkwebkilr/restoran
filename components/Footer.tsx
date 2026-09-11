"use client";

import Link from "next/link";
import { SiInstagram, SiX, SiFacebook, SiTiktok, SiTelegram } from "@icons-pack/react-simple-icons";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Footer() {
    const [siteLogo, setSiteLogo] = useState("");
    const [socials, setSocials] = useState({
        facebook: "#",
        instagram: "#",
        x: "#",
        tiktok: "#",
        telegram: "#"
    });
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await supabase.from("settings").select("*");
                if (data) {
                    const getVal = (key: string, fallback: string) => data.find(s => s.key === key)?.value || fallback;
                    setSiteLogo(getVal("site_logo_url", ""));
                    setSocials({
                        facebook: getVal("social_facebook", "#"),
                        instagram: getVal("social_instagram", "#"),
                        x: getVal("social_x", "#"),
                        tiktok: getVal("social_tiktok", "#"),
                        telegram: getVal("social_telegram", "#")
                    });
                }
            } catch (err) {
                console.error("Error fetching settings in footer:", err);
            }
        };
        fetchSettings();
    }, [supabase]);
    return (
        <footer className="w-full border-t border-white/5 py-16 md:py-32 px-6 glass relative mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-16 md:gap-24 text-center md:text-left">
                <div className="max-w-md flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-4 mb-8 md:mb-10">
                        <img 
                            src="/Logo 3.png" 
                            alt="Bodrumun Mekanları" 
                            className="h-24 md:h-32 w-auto object-contain rounded-2xl shadow-2xl border border-white/10" 
                        />
                    </div>
                    <p className="text-muted font-medium text-base md:text-lg leading-relaxed text-balance opacity-80 max-w-sm md:max-w-none">
                        Gastronomi dünyasında dijital dönüşümün öncüsü, Evolution Ajans. Sınırları zorlayan, cesur ve akıllı deneyimler için buradayız.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-32 w-full md:w-auto">
                    <div className="flex flex-col gap-6 md:gap-8 items-center md:items-start">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Platform</span>
                        <div className="flex flex-col gap-4 items-center md:items-start">
                            <Link href="/categories" className="text-muted hover:text-accent text-[11px] md:text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Kategoriler</Link>
                            <Link href="/restaurants" className="text-muted hover:text-accent text-[11px] md:text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Mekanlar</Link>
                            <Link href="/#how-it-works" className="text-muted hover:text-accent text-[11px] md:text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Nasıl Çalışır</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 md:gap-8 items-center md:items-start sm:col-span-2 lg:col-span-1">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Sosyal Medya</span>
                        <div className="flex flex-row md:flex-col gap-6 md:gap-4 flex-wrap justify-center md:justify-start">
                            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent text-sm font-black uppercase tracking-widest transition-all flex items-center gap-4 group">
                                <span className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-accent/10 transition-all">
                                    <SiInstagram color="default" size={20} />
                                </span> 
                                Instagram
                            </a>
                            <a href={socials.x} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent text-sm font-black uppercase tracking-widest transition-all flex items-center gap-4 group">
                                <span className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-accent/10 transition-all">
                                    <SiX color="#FFFFFF" size={20} />
                                </span> 
                                Twitter
                            </a>
                            <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent text-sm font-black uppercase tracking-widest transition-all flex items-center gap-4 group">
                                <span className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-accent/10 transition-all">
                                    <SiTiktok color="#FFFFFF" size={20} />
                                </span> 
                                TikTok
                            </a>
                            <a href={socials.telegram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent text-sm font-black uppercase tracking-widest transition-all flex items-center gap-4 group">
                                <span className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-accent/10 transition-all">
                                    <SiTelegram color="default" size={20} />
                                </span> 
                                Telegram
                            </a>
                            <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent text-sm font-black uppercase tracking-widest transition-all flex items-center gap-4 group">
                                <span className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-accent/10 transition-all">
                                    <SiFacebook color="default" size={20} />
                                </span> 
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-16 md:mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] md:text-[10px] font-black text-muted uppercase tracking-[0.3em] md:tracking-[0.5em] text-center md:text-left">
                <span>© 2026 Evolution Ajans. Tüm hakları saklıdır.</span>
                <div className="flex gap-8 md:gap-16">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    );
}
