import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RestaurantSettingsForm from "./settings-form";

export default async function RestaurantSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login/restaurant");

  // Mevcut restoran verilerini çekelim
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) {
      return <div className="pt-40 text-center text-white italic">Restoran kaydınız bulunamadı.</div>;
  }

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
            <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-4 block">Yönetim</span>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
                İŞLETME <span className="text-accent">PROFİLİ.</span>
            </h1>
            <p className="text-muted mt-4 font-medium italic opacity-70 uppercase tracking-widest text-[10px]">Restoran bilgilerini güncelleyerek müşterilerine en iyi deneyimi sun.</p>
        </div>

        <RestaurantSettingsForm restaurant={restaurant} />
      </div>
    </main>
  );
}
