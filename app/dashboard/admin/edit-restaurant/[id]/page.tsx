import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import AdminRestaurantEditForm from "./edit-form";

export default async function AdminRestaurantEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Düzenlenecek restoranı çek
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white font-sans">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-3 block">Sistem Yönetimi</span>
            <h1 className="font-display text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
              İşletme <span className="text-accent">Düzenleme.</span>
            </h1>
            <p className="text-zinc-400 mt-2 font-medium uppercase tracking-widest text-[9px] italic">
              {restaurant.name} isimli işletmenin detaylarını güncelleyin ve durumunu değiştirin.
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="px-6 py-3.5 glass text-white/80 hover:text-white font-black rounded-xl text-[9px] tracking-widest uppercase border border-white/10 hover:bg-white/5 transition-all italic"
          >
            ← Geri Dön
          </Link>
        </div>

        <AdminRestaurantEditForm restaurant={restaurant} />
      </div>
    </main>
  );
}
