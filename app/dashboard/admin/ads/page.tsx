import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminAdForm from "./ads-form";

export default async function AdminAdsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login/member");

  // Admin kontrolü
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  // Reklamları çekelim (Tablo yoksa çökmesin diye try-catch yapıyoruz)
  let adsList: any[] = [];
  try {
    const { data } = await supabase
      .from("ads")
      .select("*")
      .order("position");
    adsList = data || [];
  } catch (e) {
    console.warn("ads tablosu bulunamadı, varsayılan listeyle devam ediliyor.");
  }

  // Reklamların tıklandığında yönlendirilebileceği aktif restoranları çekelim
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("status", "approved")
    .order("name");

  // Pozisyon 1, 2, 3 ve 4 için reklamları ayıralım
  const ad1 = adsList.find(a => a.position === 1) || { position: 1, title: "", subtitle: "", image_url: "", restaurant_id: null };
  const ad2 = adsList.find(a => a.position === 2) || { position: 2, title: "", subtitle: "", image_url: "", restaurant_id: null };
  const ad3 = adsList.find(a => a.position === 3) || { position: 3, title: "", subtitle: "", image_url: "", restaurant_id: null };
  const ad4 = adsList.find(a => a.position === 4) || { position: 4, title: "", subtitle: "", image_url: "", restaurant_id: null };

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white font-sans">
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-3 block">Sistem Yönetimi</span>
            <h1 className="font-display text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
              Reklam <span className="text-accent">Paneli.</span>
            </h1>
            <p className="text-zinc-400 mt-2 font-medium uppercase tracking-widest text-[9px] italic">
              Ana sayfadaki dört adet reklam alanını dinamik olarak düzenleyin.
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="px-6 py-3.5 glass text-white/80 hover:text-white font-black rounded-xl text-[9px] tracking-widest uppercase border border-white/10 hover:bg-white/5 transition-all italic"
          >
            ← Yönetim Paneli
          </Link>
        </div>


        {/* Ad Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="font-display text-xl font-black text-accent uppercase italic mb-6">📢 REKLAM ALANI 1 (ÜST SOL BANNER)</h3>
            <AdminAdForm initialAd={ad1} restaurants={restaurants || []} />
          </div>
          <div>
            <h3 className="font-display text-xl font-black text-accent uppercase italic mb-6">📢 REKLAM ALANI 2 (ÜST SAĞ BANNER)</h3>
            <AdminAdForm initialAd={ad2} restaurants={restaurants || []} />
          </div>
          <div>
            <h3 className="font-display text-xl font-black text-accent uppercase italic mb-6">📢 REKLAM ALANI 3 (ALT SOL BANNER)</h3>
            <AdminAdForm initialAd={ad3} restaurants={restaurants || []} />
          </div>
          <div>
            <h3 className="font-display text-xl font-black text-accent uppercase italic mb-6">📢 REKLAM ALANI 4 (ALT SAĞ BANNER)</h3>
            <AdminAdForm initialAd={ad4} restaurants={restaurants || []} />
          </div>
        </div>

      </div>
    </main>
  );
}
