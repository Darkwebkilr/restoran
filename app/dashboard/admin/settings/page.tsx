import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSettingsForm from "./settings-form";

export default async function AdminSettingsPage() {
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

  // Başlıkları çekelim (Tablo yoksa çökmesin diye try-catch yapıyoruz)
  let settingsList: any[] = [];
  try {
    const { data } = await supabase
      .from("settings")
      .select("*");
    settingsList = data || [];
  } catch (e) {
    console.warn("settings tablosu bulunamadı, varsayılan başlıklarla devam ediliyor.");
  }

  // Kayan bantta yönetmek için tüm onaylı restoranları çekelim
  let allRestaurants: any[] = [];
  try {
    const { data } = await supabase
      .from("restaurants")
      .select("id, name, show_in_marquee")
      .eq("status", "approved")
      .order("name");
    allRestaurants = data || [];
  } catch (e) {
    console.warn("restaurants tablosu veya show_in_marquee kolonu bulunamadı.");
  }

  // Değerleri eşleyelim
  const getSetting = (key: string, defaultValue: string) => {
    return settingsList.find(s => s.key === key)?.value || defaultValue;
  };

  const currentSettings = {
    site_meta_title: getSetting("site_meta_title", "Bodrumun Mekanları | En İyi Restoranlar & Rezervasyon"),
    site_meta_description: getSetting("site_meta_description", "Bodrum'un en seçkin mekanları, paket servis ve rezervasyon sistemi."),
    site_meta_keywords: getSetting("site_meta_keywords", "bodrum restoranları, bodrum mekanları, vip rezervasyon, paket servis"),
    site_url: getSetting("site_url", "https://restoran.ismethaktan39.workers.dev"),
    site_og_image: getSetting("site_og_image", "/og-image.jpg"),
    hero_title: getSetting("hero_title", "BODRUMUN EN İYİ MASALARI."),
    delivery_title: getSetting("delivery_title", "EN İYİ PAKET SERVİSLERİ"),
    categories_title: getSetting("categories_title", "ÖNE ÇIKAN KATEGORİLER"),
    featured_title: getSetting("featured_title", "SEÇKİN MASALAR"),
    how_it_works_title: getSetting("how_it_works_title", "SİSTEM NASIL İŞLER?"),
    marquee_text: getSetting("marquee_text", "EVOLUTION AJANS • %100 GERÇEK REZERVASYON • ŞEHRİN EN İYİLERİ"),
    site_logo_url: getSetting("site_logo_url", ""),
    social_facebook: getSetting("social_facebook", ""),
    social_instagram: getSetting("social_instagram", ""),
    social_x: getSetting("social_x", ""),
    social_tiktok: getSetting("social_tiktok", ""),
    social_telegram: getSetting("social_telegram", ""),
    whatsapp_number: getSetting("whatsapp_number", "")
  };

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white font-sans">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-3 block">Sistem Yönetimi</span>
            <h1 className="font-display text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
              Arayüz <span className="text-accent">Başlıkları.</span>
            </h1>
            <p className="text-zinc-400 mt-2 font-medium uppercase tracking-widest text-[9px] italic">
              Ana sayfadaki tüm statik başlıkları ve marquee metnini veritabanından dinamik olarak güncelleyin.
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="px-6 py-3.5 bg-black hover:bg-white hover:text-black text-white font-black rounded-xl text-[9px] tracking-widest uppercase border border-white/20 transition-all italic shadow-lg shadow-black/40"
          >
            ← Yönetim Paneli
          </Link>
        </div>


        {/* Edit Form */}
        <AdminSettingsForm initialSettings={currentSettings} allRestaurants={allRestaurants} />

      </div>
    </main>
  );
}
