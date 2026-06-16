import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CustomerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login/member");

  // Kullanıcı profilini ve rezervasyonlarını çekelim
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // Admin veya Customer değilse restoran paneline yönlendir
  if (profile?.role === "restaurant") {
    redirect("/dashboard/restaurant");
  }

  const { data: reservations } = await supabase
    .from("reservations")
    .select(`
      *,
      restaurants (
        name,
        address
      )
    `)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
                REZERVASYONLARIM.
            </h1>
            <p className="text-muted font-medium mt-4 uppercase tracking-[0.2em] text-[10px]">Evolution ayrıcalığıyla tüm masaların burada.</p>
          </div>
          <Link href="/restaurants" className="px-8 py-4 bg-accent text-black font-black rounded-2xl text-[10px] tracking-widest uppercase hover:scale-105 transition-transform shadow-xl italic">
            YENİ KEŞİF
          </Link>
        </div>

        <div className="space-y-6">
          {!reservations || reservations.length === 0 ? (
            <div className="glass p-16 rounded-[3rem] border border-white/10 text-center">
              <p className="text-white/20 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Henüz bir kaydın bulunmuyor</p>
              <Link href="/restaurants" className="text-accent font-black text-xs uppercase underline decoration-2 underline-offset-8">Mekanları Keşfet</Link>
            </div>
          ) : (
            reservations.map((res: any) => (
              <div key={res.id} className="glass p-8 rounded-[3rem] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-accent/30 transition-all duration-500">
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center font-display font-black text-3xl text-accent italic border border-white/5 group-hover:scale-110 transition-transform">
                    {res.restaurants?.name?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic">{res.restaurants?.name || 'Seçkin Mekan'}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2">
                      <span>{new Date(res.reservation_date).toLocaleDateString('tr-TR')}</span>
                      <span className="text-accent">•</span>
                      <span>{res.reservation_time.substring(0, 5)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                  <div className="text-center md:text-right">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Giriş Kodu</p>
                    <p className="text-2xl font-display font-black text-white tracking-[0.2em] group-hover:text-accent transition-colors">{res.code}</p>
                  </div>
                  <div className="px-6 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest italic">
                    ONAYLANDI
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
