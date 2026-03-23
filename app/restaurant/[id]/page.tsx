"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, use } from "react";

const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "L'Atelier de L'Entrecôte",
    category: "Fransız Mutfağı",
    rating: 4.9,
    reviews: 1240,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop",
    location: "Nişantaşı, İstanbul",
    description: "İstanbul'un kalbinde, Paris esintili bir akşam yemeği deneyimi. Özel soslu antrikotumuz ve sınırsız patates kızartmamızla efsaneleşen bir lezzet yolculuğuna davetlisiniz.",
    priceRange: "₺₺₺",
    features: ["Vale Park", "Dış Mekan", "Alkol Servisi", "Wi-Fi"],
  },
  {
    id: "2",
    name: "Zuma Istanbul",
    category: "Modern Japon",
    rating: 4.8,
    reviews: 850,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
    location: "İstinye Park",
    description: "İzaka tarzı modern Japon mutfağının en seçkin örneği. Sofistike bir atmosferde, ödüllü kokteyllerimiz ve taze sushi çeşitlerimizle unutulmaz bir akşam sizi bekliyor.",
    priceRange: "₺₺₺₺",
    features: ["Vale Park", "Teras", "Canlı DJ", "Özel Oda"],
  },
  {
    id: "3",
    name: "Sunset Grill & Bar",
    category: "Akdeniz & Sushi",
    rating: 4.7,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
    location: "Ulus, İstanbul",
    description: "Boğaz'ın eşsiz manzarasına karşı, Akdeniz ve Japon mutfağının harmanlandığı bir gastronomi şöleni. İstanbul'un en ikonik manzaralarından biri eşliğinde yemeğinizi yiyin.",
    priceRange: "₺₺₺",
    features: ["Boğaz Manzarası", "Geniş Şarap Kavı", "Piyano Bar", "Açık Hava"],
  },
];

export default function RestaurantDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === id) || MOCK_RESTAURANTS[0];
  const [selectedTime, setSelectedTime] = useState("");

  const times = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 mb-10 shadow-2xl">
            <Image 
              src={restaurant.image} 
              alt={restaurant.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-8 left-8 glass px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/10">
              {restaurant.category}
            </div>
          </div>

          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-muted mb-8 font-bold text-[10px] md:text-xs tracking-widest uppercase">
              <span className="flex items-center gap-2 text-accent">⭐ {restaurant.rating} <span className="text-white/20">|</span> {restaurant.reviews} Yorum</span>
              <span>•</span>
              <span>{restaurant.location}</span>
              <span>•</span>
              <span className="text-accent">{restaurant.priceRange}</span>
            </div>
            <p className="text-lg md:text-xl leading-relaxed text-muted font-medium mb-10 text-balance">
              {restaurant.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {restaurant.features.map(f => (
                <span key={f} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Reservation Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl">
            <h3 className="font-display text-2xl md:text-3xl font-black mb-8 tracking-tighter uppercase italic">Rezervasyon</h3>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Name & Surname Group */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">ADINIZ</label>
                  <input type="text" placeholder="Can" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-accent transition-colors font-bold text-sm placeholder:text-white/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">SOYADINIZ</label>
                  <input type="text" placeholder="Dostum" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-accent transition-colors font-bold text-sm placeholder:text-white/20" />
                </div>
              </div>

              {/* Email & Phone Group */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">E-POSTA</label>
                  <input type="email" placeholder="dostum@ajans.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-accent transition-colors font-bold text-sm placeholder:text-white/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">TELEFON</label>
                  <input type="tel" placeholder="05XX XXX XX XX" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-accent transition-colors font-bold text-sm placeholder:text-white/20" />
                </div>
              </div>

              {/* Selection Group */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">KİŞİ</label>
                  <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-accent transition-colors font-bold text-sm text-white appearance-none cursor-pointer">
                    <option className="bg-[#0A0A0A]">2 KİŞİ</option>
                    <option className="bg-[#0A0A0A]">3 KİŞİ</option>
                    <option className="bg-[#0A0A0A]">4 KİŞİ</option>
                    <option className="bg-[#0A0A0A]">5+ KİŞİ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">TARİH</label>
                  <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-accent transition-colors font-bold text-xs text-white [color-scheme:dark]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">SAAT</label>
                <div className="grid grid-cols-3 gap-2">
                  {times.map(time => (
                    <button 
                      type="button" 
                      key={time} 
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 text-[10px] font-black rounded-xl border transition-all tracking-widest uppercase ${
                        selectedTime === time 
                        ? "bg-accent border-accent text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105" 
                        : "border-white/10 hover:border-accent/50 text-white"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <Link 
                href="/success" 
                className={`block w-full py-5 font-black rounded-2xl text-center text-xs tracking-[0.2em] transition-all uppercase ${
                  selectedTime 
                  ? "bg-accent text-black hover:scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.2)]" 
                  : "bg-white/5 text-muted pointer-events-none border border-white/5"
                }`}
              >
                {selectedTime ? "REZERVASYONU TAMAMLA" : "SAAT SEÇİNİZ"}
              </Link>
              
              <p className="text-center text-[9px] font-bold text-muted uppercase tracking-widest leading-relaxed">
                Tamamladığınızda giriş kodunuz <br /> anında oluşturulacaktır.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
