import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import FeaturedAdManager from "@/components/FeaturedAdManager";

export default async function AdminFeaturedAdsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login/member");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") redirect("/");

    // 1. Get current ad frequency setting
    let currentFrequency = "3";
    try {
        const { data: settingData } = await supabase
            .from("settings")
            .select("value")
            .eq("key", "featured_ad_frequency")
            .single();
        if (settingData?.value) {
            currentFrequency = settingData.value;
        }
    } catch (e) {
        console.warn("featured_ad_frequency setting not found, default to '3'");
    }

    // 2. Get approved restaurants list (with migration check/fallback query)
    let restaurants: any[] = [];
    try {
        const { data, error } = await supabase
            .from("restaurants")
            .select("id, name, slug, is_featured_ad, category, district")
            .eq("status", "approved")
            .order("name");
        if (error) throw error;
        restaurants = data || [];
    } catch (e: any) {
        console.warn("is_featured_ad or other columns not found in database, fallback query running:", e.message);
        try {
            const { data, error } = await supabase
                .from("restaurants")
                .select("id, name, slug, category, district")
                .eq("status", "approved")
                .order("name");
            if (error) throw error;
            restaurants = (data || []).map(r => ({ ...r, is_featured_ad: false }));
        } catch (innerError: any) {
            console.error("Mekan listesi yüklenemedi:", innerError.message);
        }
    }

    return (
        <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white font-sans">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-3 block">Sistem Yönetimi</span>
                        <h1 className="font-display text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                            Sponsorlu <span className="text-accent">Mekanlar.</span>
                        </h1>
                        <p className="text-zinc-400 mt-2 font-medium uppercase tracking-widest text-[9px] italic">
                            Seçkin masalar listesinde belirli aralıklarla enjekte edilecek reklam ve sponsorlu mekanları yönetin.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin"
                        className="px-6 py-3.5 glass text-white/80 hover:text-white font-black rounded-xl text-[9px] tracking-widest uppercase border border-white/10 hover:bg-white/5 transition-all italic"
                    >
                        ← Yönetim Paneli
                    </Link>
                </div>

                {/* DB Migration Warning if fallback triggered */}
                {restaurants.length > 0 && restaurants.every(r => r.is_featured_ad === false) && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8 space-y-2">
                        <span className="text-amber-500 font-black text-xs uppercase tracking-widest block">⚠ Veritabanı Kolonu Eksik</span>
                        <p className="text-xs text-zinc-300 font-medium">
                            Yeni özellikleri tam olarak kullanabilmek için lütfen <strong>Supabase SQL Editor</strong> panelinde aşağıdaki sorguyu çalıştırın:
                        </p>
                        <pre className="bg-black/30 border border-white/5 p-4 rounded-xl text-xs font-mono text-zinc-400 overflow-x-auto">
                            {`ALTER TABLE public.restaurants ADD COLUMN is_featured_ad BOOLEAN DEFAULT FALSE;`}
                        </pre>
                    </div>
                )}

                {/* Manager Component */}
                <FeaturedAdManager initialRestaurants={restaurants} currentFrequency={currentFrequency} />

            </div>
        </main>
    );
}
