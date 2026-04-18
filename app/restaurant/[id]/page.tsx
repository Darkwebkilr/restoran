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
    address: "Abdi İpekçi Cad. No:12, Nişantaşı",
    phone: "+90 (212) 234 56 78",
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
    address: "İstinye Park AVM, No: 461",
    phone: "+90 (212) 345 67 89",
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
    address: "Yol Sk. No:2, Ulus Parkı",
    phone: "+90 (212) 456 78 90",
    description: "Boğaz'ın eşsiz manzarasına karşı, Akdeniz ve Japon mutfağının harmanlandığı bir gastronomi şöleni. İstanbul'un en ikonik manzaralarından biri eşliğinde yemeğinizi yiyin.",
    priceRange: "₺₺₺",
    features: ["Boğaz Manzarası", "Geniş Şarap Kavı", "Piyano Bar", "Açık Hava"],
  },
];

const GALLERY_IMAGES = [
    "1514362545857-3bc16c4c7d1b",
    "1559339352-11d035aa65de",
    "1552566626-52f8b828add9",
    "1517248135467-4c7edcad34c4",
    "1555396273-367ea4eb4db5",
    "1514933651103-005eec06c04b"
];

export default function RestaurantDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === id) || MOCK_RESTAURANTS[0];
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const times = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % GALLERY_IMAGES.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  return (
    <main className="min-h-screen noise-overlay mesh-gradient pb-20 pt-24">
      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20 animate-in fade-in duration-300"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            className="absolute top-10 right-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors z-[110]"
            onClick={() => setSelectedIndex(null)}
          >
            ✕
          </button>

          {/* Navigation Arrows */}
          <button 
            className="absolute left-4 md:left-10 w-14 h-14 bg-white/5 hover:bg-accent hover:text-black rounded-full flex items-center justify-center text-white text-2xl transition-all z-[110] border border-white/10"
            onClick={prevImage}
          >
            ←
          </button>
          <button 
            className="absolute right-4 md:right-10 w-14 h-14 bg-white/5 hover:bg-accent hover:text-black rounded-full flex items-center justify-center text-white text-2xl transition-all z-[110] border border-white/10"
            onClick={nextImage}
          >
            →
          </button>

          <div className="relative w-full h-full max-w-5xl animate-in zoom-in-95 duration-500">
            <Image 
              src={`https://images.unsplash.com/photo-${GALLERY_IMAGES[selectedIndex]}?q=80&w=1200&auto=format&fit=crop`} 
              alt="Büyük Görsel"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-contain"
              priority
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 glass rounded-full text-[10px] font-black tracking-widest text-white/50">
            {selectedIndex + 1} / {GALLERY_IMAGES.length}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 mb-10 shadow-2xl">
            <Image 
              src={restaurant.image} 
              alt={restaurant.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
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

            <div className="flex flex-col gap-4 mb-10 bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">📍</span>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-accent font-black tracking-widest uppercase mb-1">Adres</span>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{restaurant.address}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">📞</span>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-accent font-black tracking-widest uppercase mb-1">Telefon</span>
                        <span className="text-sm font-bold text-white tracking-tight">{restaurant.phone}</span>
                    </div>
                </div>
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

          {/* Experience Section (Video) */}
          <div className="mb-20">
            <h2 className="font-display text-3xl md:text-5xl font-black mb-8 tracking-tighter uppercase italic">DENEYİMİ <span className="text-accent">YAŞA.</span></h2>
            <div className="w-full">
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group cursor-pointer bg-black">
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎥</span>
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase">VİDEO TURU İZLE</span>
                </div>
                <div className="absolute inset-0 bg-accent/10 opacity-50 group-hover:opacity-20 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="mb-20">
            <h2 className="font-display text-3xl md:text-5xl font-black mb-8 tracking-tighter uppercase italic">GALERİ.</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {GALLERY_IMAGES.map((id, i) => (
                    <div 
                        key={i} 
                        onClick={() => setSelectedIndex(i)}
                        className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 group cursor-pointer bg-white/5"
                    >
                        <Image 
                            src={`https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`}
                            alt="Galeri Görseli"
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl">🔍</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-20">
            <h2 className="font-display text-3xl md:text-5xl font-black mb-8 tracking-tighter uppercase italic">KONUM <span className="text-accent">BİLGİSİ.</span></h2>
            <div className="w-full aspect-[21/9] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 relative bg-white/5">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192698.6141973684!2d28.871754!3d41.0053702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1cc1e01f4ca1547!2zSXPPhGFuYnVs!5e0!3m2!1str!2str!4v1713450000000!5m2!1str!2str" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'grayscale(0.8) contrast(1.1) brightness(1.1)' }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-90 hover:opacity-100 transition-opacity duration-500"
                ></iframe>
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
                  <select className="w-full bg-card border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-accent transition-colors font-bold text-sm text-white appearance-none cursor-pointer">
                    <option className="bg-[#001529]">2 KİŞİ</option>
                    <option className="bg-[#001529]">3 KİŞİ</option>
                    <option className="bg-[#001529]">4 KİŞİ</option>
                    <option className="bg-[#001529]">5+ KİŞİ</option>
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

              {/* Special Requests */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">ÖZEL İSTEKLER</label>
                <textarea 
                    placeholder="Alerji durumu, kutlama notu vb." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-accent transition-colors font-bold text-sm placeholder:text-white/20 min-h-[100px] resize-none"
                />
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
