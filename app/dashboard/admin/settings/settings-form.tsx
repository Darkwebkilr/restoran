"use client";

import { useActionState } from "react";
import { updateSettingsByAdmin } from "@/app/actions/settings";

interface Settings {
  hero_title: string;
  categories_title: string;
  featured_title: string;
  how_it_works_title: string;
  marquee_text: string;
}

export default function AdminSettingsForm({
  initialSettings
}: {
  initialSettings: Settings;
}) {
    const [state, action, isPending] = useActionState(updateSettingsByAdmin, null);

    return (
        <form action={action} className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
            
            {/* Hero Sloganı */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Hero Alanı Sloganı (Girişteki Büyük Yazı)</label>
                <textarea
                    name="hero_title"
                    required
                    defaultValue={initialSettings.hero_title}
                    placeholder="Örn. BODRUMUN EN İYİ MASALARI."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider ml-1">Satır kesmesi yapmak için metin içerisine &lt;br /&gt; yazabilirsiniz.</p>
            </div>

            {/* Marquee Metni */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Kayar Metin (Marquee Text)</label>
                <input
                    name="marquee_text"
                    required
                    defaultValue={initialSettings.marquee_text}
                    placeholder="Metinleri aralarına • koyarak girin."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Kategoriler Başlığı */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Öne Çıkan Kategoriler Başlığı</label>
                <input
                    name="categories_title"
                    required
                    defaultValue={initialSettings.categories_title}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Seçkin Masalar Başlığı */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Seçkin Masalar Başlığı</label>
                <input
                    name="featured_title"
                    required
                    defaultValue={initialSettings.featured_title}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Sistem Nasıl İşler Başlığı */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Sistem Nasıl İşler Başlığı</label>
                <input
                    name="how_it_works_title"
                    required
                    defaultValue={initialSettings.how_it_works_title}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {state?.success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center text-green-500 text-[10px] font-black uppercase italic tracking-widest animate-pulse">
                    Başlıklar Başarıyla Güncellendi!
                </div>
            )}

            {state?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-500 text-[10px] font-black uppercase italic tracking-widest">
                    {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-5 bg-accent hover:bg-white hover:text-black text-black font-black rounded-2xl text-[9px] tracking-widest uppercase transition-colors"
            >
                {isPending ? "KAYDEDİLİYOR..." : "TÜM BAŞLIKLARI KAYDET"}
            </button>
        </form>
    );
}
