"use client";

import Image from "next/image";
import { useState, useActionState, useEffect } from "react";
import { makeReservation } from "@/app/actions/reservations";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function RestaurantDetailClient({ restaurant, userRole }: { restaurant: any, userRole: string | null }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const [resState, resAction, isPending] = useActionState(makeReservation, null);

  const times = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!selectedDate) return;
      const { data } = await supabase
        .from("reservations")
        .select("reservation_time")
        .eq("restaurant_id", restaurant.id)
        .eq("reservation_date", selectedDate)
        .neq("status", "cancelled");

      if (data) {
        setBookedTimes(data.map(res => res.reservation_time.substring(0, 5)));
      }
    };
    fetchBookedTimes();
    setSelectedTime("");
  }, [selectedDate, restaurant.id, supabase]);

  useEffect(() => {
    if (resState?.success && resState.reservation) {
      router.push(`/success?code=${resState.reservation.code}`);
    }
  }, [resState, router]);

  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      dates.push({
        full: d.toISOString().split('T')[0],
        day: d.getDate(),
        month: d.toLocaleString('tr-TR', { month: 'short' }),
        weekday: d.toLocaleString('tr-TR', { weekday: 'short' })
      });
    }
    return dates;
  };

  const availableDates = getDates();

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pb-20 pt-24 text-white">
      {/* Lightbox Modal */}
      {selectedIndex !== null && restaurant?.photos && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4" onClick={() => setSelectedIndex(null)}>
          <div className="relative w-full h-full max-w-6xl">
            <Image src={restaurant.photos[selectedIndex]} alt="Galeri" fill className="object-contain" />
            <button className="absolute top-10 right-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">✕</button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4" onClick={() => setIsVideoOpen(false)}>
           <div className="relative w-full max-w-4xl aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-black flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                 {restaurant?.videos && restaurant.videos.length > 0 ? (
                     <video src={restaurant.videos[0]} controls autoPlay className="w-full h-full object-contain" />
                 ) : (
                     <div className="text-center">
                         <span className="text-6xl mb-6 block">🎥</span>
                         <span className="text-[12px] font-black tracking-[0.4em] uppercase text-white/50 italic">BU MEKANIN VİDEOSU BULUNMUYOR</span>
                     </div>
                 )}
                 <button onClick={() => setIsVideoOpen(false)} className="absolute top-10 right-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">✕</button>
            </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sol İçerik: Restoran Bilgileri */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-[3rem] md:rounded-[4rem] overflow-hidden border-2 border-white/10 mb-10 shadow-2xl group">
            <Image 
                src={restaurant?.photos?.[0] || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop"} 
                alt={restaurant?.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-[10s]" 
                priority 
            />
            <div className="absolute top-8 left-8 glass px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase italic border border-white/20">Onaylı Mekan</div>
            <div className="absolute bottom-8 right-8 glass px-6 py-3 rounded-2xl border border-white/10">
                <span className="text-xs font-black text-accent uppercase italic">⭐ {restaurant?.rating || '4.9'} | {restaurant?.reviews || '120'} Yorum</span>
            </div>
          </div>

          <div className="mb-12">
            <h1 className="font-display text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic leading-none">{restaurant?.name}</h1>
            
            <div className="flex gap-4 mb-12">
              <button onClick={() => setSelectedIndex(0)} className="px-10 py-5 bg-accent text-black font-black rounded-2xl text-[10px] tracking-widest hover:bg-black hover:text-accent border-2 border-accent transition-all uppercase italic shadow-xl">GÖRSELLER</button>
              <button onClick={() => setIsVideoOpen(true)} className="px-10 py-5 glass text-white font-black rounded-2xl text-[10px] tracking-widest border border-white/20 hover:border-accent transition-all uppercase italic">VİDEO</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <div className="flex items-center gap-5 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                    <span className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl">📍</span>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-accent font-black tracking-widest uppercase italic mb-1">Konum</span>
                        <span className="text-sm font-bold uppercase text-white/90">{restaurant?.address}</span>
                    </div>
                </div>
                <div className="flex items-center gap-5 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                    <span className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl">📞</span>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-accent font-black tracking-widest uppercase italic mb-1">Rezervasyon Hattı</span>
                        <span className="text-sm font-bold text-white/90">{restaurant?.phone || '+90 (212) ...'}</span>
                    </div>
                </div>
            </div>

            <p className="text-xl md:text-2xl leading-relaxed text-zinc-300 font-medium mb-12 italic text-balance">{restaurant?.description || "Bu seçkin mekanın hikayesi yakında burada olacak."}</p>

            <div className="flex flex-wrap gap-3 mb-20">
                {(restaurant?.features || ['Vale Park', 'Dış Mekan', 'VIP Salon', 'Alkol Servisi']).map((f: string) => (
                    <span key={f} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest uppercase text-zinc-300 hover:text-accent hover:border-accent transition-colors cursor-default">{f}</span>
                ))}
            </div>

            {/* Google Haritalar */}
            <div className="mb-20">
                <h2 className="font-display text-3xl md:text-5xl font-black mb-8 tracking-tighter uppercase italic">MEKAN <span className="text-accent">KONUMU.</span></h2>
                <div className="w-full aspect-[21/9] rounded-[3.5rem] overflow-hidden border border-white/10 relative bg-white/5 shadow-2xl group">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192698.6141973684!2d28.871754!3d41.0053702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1cc1e01f4ca1547!2zSXPPhGFuYnVs!5e0!3m2!1str!2str!4v1713450000000!5m2!1str!2str" 
                        width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) contrast(1.2) brightness(0.8)' }} allowFullScreen={true} loading="lazy" className="opacity-80 group-hover:opacity-100 group-hover:filter-none transition-all duration-700"
                    ></iframe>
                </div>
            </div>
          </div>
        </div>

        {/* Sağ İçerik: Rezervasyon */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 glass p-8 md:p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
            <h3 className="font-display text-2xl md:text-3xl font-black mb-10 italic uppercase tracking-tighter">Rezervasyon</h3>
            
            {userRole === "admin" ? (
                <div className="p-10 bg-accent/10 border border-accent/20 rounded-[3rem] text-center shadow-inner">
                    <p className="text-accent font-black text-[11px] uppercase tracking-[0.2em] leading-relaxed italic">
                        SAYIN YÖNETİCİ,<br /><br />ADMIN YETKİSİYLE<br />REZERVASYON YAPILAMAZ.
                    </p>
                </div>
            ) : (
                <form className="space-y-8" action={resAction}>
                    <input type="hidden" name="restaurantId" value={restaurant.id} />
                    <input type="hidden" name="date" value={selectedDate} />
                    <input type="hidden" name="time" value={selectedTime} />

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] ml-2">MİSAFİR SAYISI</label>
                        <select name="partySize" required className="w-full bg-black border border-white/10 rounded-[1.5rem] px-6 py-5 outline-none focus:border-accent font-black text-sm text-white appearance-none cursor-pointer uppercase tracking-widest">
                            <option value="2">2 KİŞİ</option>
                            <option value="3">3 KİŞİ</option>
                            <option value="4">4 KİŞİ</option>
                            <option value="5">5+ KİŞİ</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] ml-2">TARİH SEÇİMİ</label>
                        <div className="grid grid-cols-4 gap-2">
                            {availableDates.map(d => (
                                <button type="button" key={d.full} onClick={() => setSelectedDate(d.full)} className={`flex flex-col items-center justify-center py-4 rounded-[1.2rem] border transition-all ${selectedDate === d.full ? "bg-white text-black border-white scale-105 shadow-xl" : "bg-white/5 border-white/10 hover:border-white/30 text-zinc-300"}`}>
                                    <span className="text-[8px] font-black uppercase opacity-60 mb-1">{d.weekday}</span>
                                    <span className="text-base font-black">{d.day}</span>
                                    <span className="text-[8px] font-black uppercase opacity-60 mt-1">{d.month}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] ml-2">SAAT SEÇİMİ</label>
                        <div className="grid grid-cols-3 gap-2">
                            {times.map(t => {
                                const isBooked = bookedTimes.includes(t);
                                return (
                                    <button type="button" key={t} disabled={isBooked} onClick={() => setSelectedTime(t)} className={`py-4 text-[11px] font-black rounded-[1.2rem] border transition-all uppercase tracking-widest ${selectedTime === t ? "bg-accent text-black border-accent shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-105" : isBooked ? "bg-white/5 text-white/10 border-white/5 cursor-not-allowed line-through" : "bg-white/5 border-white/10 hover:border-white/30 text-zinc-300"}`}>
                                        {isBooked ? "DOLU" : t}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {resState?.error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-red-500 text-[10px] font-black uppercase italic tracking-widest">{resState.error}</div>
                    )}

                    <button type="submit" disabled={!selectedDate || !selectedTime || isPending} className={`w-full py-6 font-black rounded-[1.5rem] text-center text-[11px] tracking-[0.3em] transition-all uppercase disabled:opacity-50 ${selectedDate && selectedTime ? "bg-accent text-black shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:scale-[1.02]" : "bg-white/5 text-white/20 border border-white/5"}`}>
                        {isPending ? "İŞLENİYOR..." : (selectedDate && selectedTime ? "REZERVASYONU TAMAMLA" : "TARİH VE SAAT SEÇİN")}
                    </button>
                </form>
            )}
            
            <p className="mt-8 text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                ONAYLANDIĞINDA GİRİŞ KODUNUZ <br /> ANINDA OLUŞTURULACAKTIR.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
