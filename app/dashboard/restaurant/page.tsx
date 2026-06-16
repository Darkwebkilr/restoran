import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RestaurantDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login/restaurant");

  // Kullanıcının restoran kaydını kontrol edelim
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  // 1. DURUM: BAŞVURU HİÇ YOK
  if (!restaurant) {
    return (
      <main className="min-h-screen noise-overlay mesh-gradient pt-32 px-6 flex items-center justify-center text-white">
        <div className="glass p-12 md:p-20 rounded-[3rem] border border-white/10 text-center max-w-2xl animate-in zoom-in-95 duration-700 shadow-2xl">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">🏢</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-6 uppercase italic text-white leading-tight">İşletmenizi <br /><span className="text-accent">Kaydedin.</span></h2>
          <p className="text-muted text-sm font-medium mb-10 leading-relaxed max-w-md mx-auto uppercase tracking-widest">Evolution Ajans ayrıcalığıyla yerinizi almak için hemen başvurunuzu oluşturun.</p>
          <Link href="/dashboard/restaurant/settings" className="px-12 py-5 bg-accent text-black font-black rounded-2xl text-[10px] tracking-[0.3em] uppercase hover:scale-105 transition-transform shadow-xl inline-block">HEMEN BAŞVUR</Link>
        </div>
      </main>
    );
  }

  // 2. DURUM: BAŞVURU VAR AMA ONAY BEKLİYOR (Veya Reddedilmiş)
  if (restaurant.status !== 'approved') {
    return (
      <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white">
        <div className="max-w-4xl mx-auto">
            <div className="mb-12">
                <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-4 block">Kontrol Paneli</span>
                <h1 className="font-display text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">{restaurant.name}.</h1>
            </div>

            <div className="glass p-12 rounded-[3.5rem] border-2 border-white/5 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 ${restaurant.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 animate-pulse' : 'bg-red-500/20 text-red-500'}`}>
                    {restaurant.status === 'pending' ? '⏳' : '✕'}
                </div>
                <h2 className="font-display text-3xl font-black mb-4 uppercase italic">
                    {restaurant.status === 'pending' ? 'BAŞVURUNUZ İNCELENİYOR' : 'BAŞVURUNUZ ONAYLANMADI'}
                </h2>
                <p className="text-muted text-xs font-bold uppercase tracking-[0.2em] max-w-sm mb-10 leading-relaxed">
                    {restaurant.status === 'pending' 
                        ? 'Ekibimiz işletme bilgilerinizi kontrol ediyor. Onaylandığında rezervasyon almaya başlayabileceksiniz.' 
                        : 'Maalesef işletme kaydınız kriterlerimize uymadığı için onaylanmadı. Lütfen teknik ekibimizle görüşün.'}
                </p>
                <Link href="/dashboard/restaurant/settings" className="text-accent font-black text-[10px] tracking-[0.3em] uppercase underline decoration-2 underline-offset-8">Bilgileri Güncelle</Link>
            </div>
        </div>
      </main>
    );
  }

  // 3. DURUM: ONAYLI RESTORAN (TAM PANEL)
  const { data: reservations } = await supabase
    .from("reservations")
    .select(`*, profiles:customer_id (full_name, email)`)
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] font-black tracking-widest uppercase">YAYINDA</span>
                <span className="text-white/20 text-xs font-bold uppercase tracking-widest">ID: {restaurant.slug}</span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none">{restaurant.name}.</h1>
          </div>
          <Link href="/dashboard/restaurant/settings" className="px-8 py-4 glass text-white font-black rounded-2xl text-[10px] tracking-widest uppercase border border-white/10 hover:bg-white/5 transition-all italic">AYARLAR</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass p-10 rounded-[2.5rem] border border-white/10">
                <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2 italic">Gelen Talep</p>
                <p className="text-5xl font-display font-black text-white italic tracking-tighter">{reservations?.length || 0}</p>
            </div>
            <div className="glass p-10 rounded-[2.5rem] border border-white/10 col-span-2">
                <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2 italic">Hızlı Erişim</p>
                <div className="flex gap-4 mt-4">
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 italic italic">QR Kod Oluştur</div>
                    <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Menü Düzenle</div>
                </div>
            </div>
        </div>

        <div className="glass rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic">Aktif Rezervasyonlar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5">
                  <th className="p-8 text-[9px] font-black text-muted uppercase tracking-widest">Müşteri Detayı</th>
                  <th className="p-8 text-[9px] font-black text-muted uppercase tracking-widest">Tarih / Saat</th>
                  <th className="p-8 text-[9px] font-black text-muted uppercase tracking-widest text-center">Bilet Kodu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reservations?.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="p-20 text-center text-white/20 font-black uppercase text-xs italic tracking-widest">Henüz gelen bir rezervasyon yok.</td>
                    </tr>
                ) : (
                    reservations?.map((res: any) => (
                        <tr key={res.id} className="hover:bg-white/[0.01] transition-colors group">
                            <td className="p-8">
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-base uppercase italic">{res.profiles?.full_name || 'İsimsiz Misafir'}</span>
                                    <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{res.profiles?.email}</span>
                                </div>
                            </td>
                            <td className="p-8 text-sm font-bold text-white uppercase italic">{res.reservation_date} • {res.reservation_time.substring(0, 5)}</td>
                            <td className="p-8">
                                <div className="flex justify-center">
                                    <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-lg font-display font-black text-accent tracking-[0.2em] group-hover:scale-110 transition-transform">{res.code}</span>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
