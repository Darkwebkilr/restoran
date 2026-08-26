import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SponsorshipManager from "@/components/SponsorshipManager";

export default async function AdminSponsorshipsPage() {
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

    // 2. Get approved restaurants list with all sponsorship columns (crash-safe fallbacks)
    let restaurants: any[] = [];
    try {
        const { data, error } = await supabase
            .from("restaurants")
            .select("id, name, slug, show_in_marquee, is_featured, is_featured_ad, has_delivery, is_delivery_ad, category, district")
            .eq("status", "approved")
            .order("name");
        
        if (error) throw error;
        restaurants = data || [];
    } catch (e: any) {
        console.warn("Some sponsorship columns not found, using query with fallback properties:", e.message);
        try {
            const { data, error } = await supabase
                .from("restaurants")
                .select("id, name, slug, category, district")
                .eq("status", "approved")
                .order("name");
            
            if (error) throw error;
            restaurants = (data || []).map(r => ({
                ...r,
                show_in_marquee: (r as any).show_in_marquee || false,
                is_featured: (r as any).is_featured || false,
                is_featured_ad: (r as any).is_featured_ad || false,
                has_delivery: (r as any).has_delivery || false,
                is_delivery_ad: (r as any).is_delivery_ad || false
            }));
        } catch (innerError: any) {
            console.error("Failed to query approved restaurants:", innerError.message);
        }
    }

    // 3. Get static banner ads
    let adsList: any[] = [];
    try {
        const { data } = await supabase
            .from("ads")
            .select("*")
            .order("position");
        adsList = data || [];
    } catch (e) {
        console.warn("ads table not found or empty:", e);
    }

    return (
        <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white font-sans">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-3 block">Sistem Yönetimi</span>
                        <h1 className="font-display text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                            Reklam & Sponsor <span className="text-accent">Yönetim Merkezi.</span>
                        </h1>
                        <p className="text-zinc-400 mt-2 font-medium uppercase tracking-widest text-[9px] italic">
                            Kayan bant, seçkin masalar, en iyi paket servisleri, sabit afişler ve reklam sıklığı ayarlarını tek ekrandan yönetin.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin"
                        className="px-6 py-3.5 bg-black hover:bg-white hover:text-black text-white font-black rounded-xl text-[9px] tracking-widest uppercase border border-white/20 transition-all italic shadow-lg shadow-black/40"
                    >
                        ← Yönetim Paneli
                    </Link>
                </div>

                {/* Manager Component */}
                <SponsorshipManager 
                    initialRestaurants={restaurants} 
                    adsList={adsList} 
                    currentFrequency={currentFrequency} 
                />

            </div>
        </main>
    );
}
