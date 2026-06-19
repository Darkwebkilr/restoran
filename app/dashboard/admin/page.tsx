import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login/member");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  // Bekleyen restoranlar (Tüm detaylarıyla)
  const { data: pendingRestaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // Tüm restoranlar
  const { data: allRestaurants } = await supabase
    .from("restaurants")
    .select("*")
    .order("name", { ascending: true });

  const { data: allReservations } = await supabase
    .from("reservations")
    .select(`*, restaurants (name), profiles:customer_id (full_name, email)`)
    .order("created_at", { ascending: false });

  const { count: userCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    "use server";
    const supabase = await createClient();
    await supabase.from("restaurants").update({ status }).eq("id", id);
    revalidatePath("/dashboard/admin");
  }

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pt-32 pb-20 px-6 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
                <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-4 block">Kontrol Kulesi</span>
                <h1 className="font-display text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">SİSTEM <span className="text-accent">YÖNETİMİ.</span></h1>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                <div className="glass p-6 px-10 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Üyeler</p>
                    <p className="text-3xl font-display font-black text-accent italic">{userCount || 0}</p>
                </div>
                <div className="glass p-6 px-10 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">İşletmeler</p>
                    <p className="text-3xl font-display font-black text-accent italic">{allRestaurants?.length || 0}</p>
                </div>
                <div className="glass p-6 px-10 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Rezervasyon</p>
                    <p className="text-3xl font-display font-black text-accent italic">{allReservations?.length || 0}</p>
                </div>
            </div>
        </div>

        {/* REZERVASYONLAR TABLOSU */}
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-display font-black uppercase italic">AKTİF REZERVASYONLAR</h2>
                <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <div className="glass rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Misafir</th>
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">İşletme</th>
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Tarih</th>
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center">Kod</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {allReservations?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-zinc-500 font-bold uppercase text-xs italic tracking-wider">Henüz kayıtlı bir rezervasyon bulunmuyor.</td>
                                </tr>
                            ) : (
                                allReservations?.map((res: any) => (
                                    <tr key={res.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-black text-sm uppercase">{res.profiles?.full_name || res.profiles?.email?.split('@')[0]}</span>
                                                <span className="text-[10px] text-zinc-400 font-medium">{res.profiles?.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-6"><span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-accent uppercase">{res.restaurants?.name}</span></td>
                                        <td className="p-6 text-sm font-bold text-white uppercase italic">{res.reservation_date} • {res.reservation_time.substring(0,5)}</td>
                                        <td className="p-6 text-lg font-display font-black text-accent tracking-[0.2em] text-center">{res.code}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        {/* TÜM İŞLETMELER TABLOSU (DÜZENLEME YETKİSİ İLE) */}
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-display font-black uppercase italic">Mevcut İşletmeler & Restoranlar</h2>
                <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <div className="glass rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">İşletme Adı</th>
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Mutfak / Sektör</th>
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Durum</th>
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">İletişim</th>
                                <th className="p-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {!allRestaurants || allRestaurants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-zinc-500 font-bold uppercase text-xs italic tracking-wider">Kayıtlı restoran bulunmamaktadır.</td>
                                </tr>
                            ) : (
                                allRestaurants.map((rest: any) => (
                                    <tr key={rest.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-black text-sm uppercase">{rest.name}</span>
                                                <span className="text-[10px] text-zinc-500 font-medium lowercase">slug: {rest.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/80 uppercase">{rest.category || 'Belirtilmedi'}</span>
                                        </td>
                                        <td className="p-6">
                                            {rest.status === 'approved' ? (
                                                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black rounded-full uppercase tracking-wider">ONAYLI</span>
                                            ) : rest.status === 'pending' ? (
                                                <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black rounded-full uppercase tracking-wider animate-pulse">BEKLEMEDE</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black rounded-full uppercase tracking-wider">REDDEDİLDİ</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col text-[10px] text-zinc-300 font-medium">
                                                <span>📞 {rest.phone || 'Telefon yok'}</span>
                                                <span className="text-zinc-500 mt-1 max-w-[200px] truncate">📍 {rest.address}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Link
                                                href={`/dashboard/admin/edit-restaurant/${rest.id}`}
                                                className="inline-block px-5 py-2.5 bg-white/5 border border-white/10 hover:border-accent hover:bg-accent hover:text-black text-white text-[9px] font-black rounded-xl tracking-widest uppercase transition-all shadow-md italic"
                                            >
                                                DÜZENLE
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        {/* DETAYLI BAŞVURU KARTLARI */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-display font-black uppercase italic">BEKLEYEN İŞLETME BAŞVURULARI</h2>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {!pendingRestaurants || pendingRestaurants.length === 0 ? (
                    <div className="p-16 glass rounded-[3rem] border border-white/10 text-center">
                        <p className="text-zinc-400 font-black uppercase tracking-[0.5em] text-xs italic">Şu an incelenecek yeni bir başvuru bulunmuyor.</p>
                    </div>
                ) : (
                    pendingRestaurants?.map((rest) => (
                        <div key={rest.id} className="glass p-10 md:p-12 rounded-[4rem] border-2 border-white/5 flex flex-col lg:flex-row gap-12 group hover:border-accent/20 transition-all duration-700">
                            {/* Restoran Özet Bilgi */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-500 text-[9px] font-black rounded-full uppercase tracking-widest animate-pulse">Yeni Başvuru</span>
                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Sektör: {rest.category || 'Belirtilmedi'}</span>
                                </div>
                                <h3 className="text-4xl md:text-6xl font-display font-black uppercase italic text-white mb-6 leading-none tracking-tighter">{rest.name}</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <span className="text-accent text-lg">📝</span>
                                        <p className="text-zinc-300 text-sm font-medium leading-relaxed italic">{rest.description || 'Açıklama girilmemiş.'}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <span className="text-accent">📍</span>
                                            <span className="text-[11px] font-bold uppercase text-zinc-300">{rest.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <span className="text-accent">📞</span>
                                            <span className="text-[11px] font-bold text-zinc-300">{rest.phone || 'Telefon yok'}</span>
                                        </div>
                                    </div>
                                    {/* Özellikler */}
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {rest.features?.map((f: string) => (
                                            <span key={f} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-zinc-400">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* İşlem Butonları */}
                            <div className="lg:w-80 flex flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-12">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 text-center">İşletme Onayı</p>
                                <form action={async () => { "use server"; await updateStatus(rest.id, 'approved'); }}>
                                    <button className="w-full py-6 bg-green-500 text-black font-black rounded-3xl text-[11px] tracking-[0.2em] uppercase hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,197,94,0.3)]">BAŞVURUYU ONAYLA</button>
                                </form>
                                <form action={async () => { "use server"; await updateStatus(rest.id, 'rejected'); }}>
                                    <button className="w-full py-6 bg-white/5 border border-white/10 text-white font-black rounded-3xl text-[11px] tracking-[0.2em] uppercase hover:bg-red-500 hover:text-black transition-all">REDDET</button>
                                </form>
                                <p className="text-[9px] text-zinc-500 text-center font-bold uppercase mt-4">ID: {rest.slug}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
      </div>
    </main>
  );
}
