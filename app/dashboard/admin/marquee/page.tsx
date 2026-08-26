import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import MarqueeManager from "@/components/MarqueeManager";

export default async function AdminMarqueePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login/member");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") redirect("/");

    // Tüm onaylı restoranları çek
    let restaurants: any[] = [];
    try {
        const { data, error } = await supabase
            .from("restaurants")
            .select("id, name, slug, show_in_marquee, category, district")
            .eq("status", "approved")
            .order("name");
        if (error) throw error;
        restaurants = data || [];
    } catch (e: any) {
        console.warn("show_in_marquee veya diğer kolonlar bulunamadı, fallback sorgusu deneniyor:", e.message);
        try {
            const { data, error } = await supabase
                .from("restaurants")
                .select("id, name, slug, category, district")
                .eq("status", "approved")
                .order("name");
            if (error) throw error;
            restaurants = (data || []).map(r => ({ ...r, show_in_marquee: false }));
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
                            Kayan <span className="text-accent">Mekanlar.</span>
                        </h1>
                        <p className="text-zinc-400 mt-2 font-medium uppercase tracking-widest text-[9px] italic">
                            Ana sayfanın en üstündeki kayan bantta yer alacak mekanları hızlıca ekleyin veya çıkarın.
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
                <MarqueeManager initialRestaurants={restaurants} />

            </div>
        </main>
    );
}
