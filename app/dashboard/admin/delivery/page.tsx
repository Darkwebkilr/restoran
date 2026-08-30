import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeliveryManager from "@/components/DeliveryManager";

export default async function AdminDeliveryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login/member");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") redirect("/");

    // Get approved restaurants list (with migration check/fallback queries)
    let restaurants: any[] = [];
    let isMigrationMissing = false;

    try {
        const { data, error } = await supabase
            .from("restaurants")
            .select("id, name, slug, has_delivery, category, district")
            .eq("status", "approved")
            .order("name");
        
        if (error) throw error;
        restaurants = data || [];
    } catch (e: any) {
        console.warn("has_delivery column not found in database, running fallback query:", e.message);
        isMigrationMissing = true;
        try {
            const { data, error } = await supabase
                .from("restaurants")
                .select("id, name, slug, category, district")
                .eq("status", "approved")
                .order("name");
            
            if (error) throw error;
            
            restaurants = (data || []).map(r => ({
                ...r,
                has_delivery: (r as any).has_delivery || false
            }));
        } catch (innerError: any) {
            console.error("Failed to load restaurant list:", innerError.message);
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
                            Paket Servis <span className="text-accent">Yönetimi.</span>
                        </h1>
                        <p className="text-zinc-400 mt-2 font-medium uppercase tracking-widest text-[9px] italic">
                            Ana sayfadaki en iyi paket servisleri bölümünde yer alacak mekanları ve bu bölüme özel sponsorluk durumlarını manuel yönetin.
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
                <DeliveryManager initialRestaurants={restaurants} />

            </div>
        </main>
    );
}
