import Image from "next/image";
import Link from "next/link";

const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "L'Atelier de L'Entrecôte",
    category: "Fransız Mutfağı",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
    location: "Nişantaşı",
  },
  {
    id: "2",
    name: "Zuma Istanbul",
    category: "Modern Japon",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
    location: "İstinye Park",
  },
  {
    id: "3",
    name: "Sunset Grill & Bar",
    category: "Akdeniz & Sushi",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
    location: "Ulus",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Mekanı Keşfet",
    description: "Şehrin en seçkin restoranlarını listele, ambiyansı ve menüyü incele.",
    icon: "🔍"
  },
  {
    number: "02",
    title: "Anında Rezerve Et",
    description: "Sana uygun tarih ve saati seç, saniyeler içinde masanı garanti altına al.",
    icon: "📅"
  },
  {
    number: "03",
    title: "Kodunla Giriş Yap",
    description: "Kapıda sana özel üretilen 6 haneli kodu göster ve doğrudan masana geç.",
    icon: "🔑"
  }
];

const STATS = [
  { label: "Seçkin Restoran", value: "120+" },
  { label: "Mutlu Misafir", value: "45K+" },
  { label: "Şehir", value: "12" },
  { label: "Bekleme Süresi", value: "0" }
];

export default function Home() {
  return (
    <main className="relative min-h-screen noise-overlay mesh-gradient flex flex-col items-center overflow-x-hidden selection:bg-accent selection:text-black">
      
      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-6 flex flex-col items-center text-center max-w-5xl w-full">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] text-accent mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 uppercase">
          Evolution Ajans • Akıllı Rezervasyon Sistemi
        </div>
        <h1 className="font-display text-5xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase text-balance">
          ŞEHRİN EN İYİ MASALARI <br /> <span className="text-accent italic">TEK BİR KODLA.</span>
        </h1>
        <p className="text-muted text-base md:text-2xl max-w-3xl mb-14 animate-in fade-in slide-in-from-bottom-10 duration-1000 font-medium leading-relaxed">
          Sıra bekleme devri kapandı. Restoranını seç, saniyeler içinde rezervasyonunu yap ve sana özel <span className="text-white font-bold italic">6 haneli giriş koduyla</span> VIP geçiş yap.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md animate-in fade-in slide-in-from-bottom-12 duration-1000">
           <Link href="#restaurants" className="flex-1 px-8 py-6 bg-white text-black font-black rounded-3xl text-[11px] tracking-widest hover:bg-accent transition-all shadow-[0_20px_50px_rgba(245,158,11,0.2)] flex items-center justify-center uppercase hover:-translate-y-1">HEMEN YERİNİ AYIRT</Link>
           <Link href="#how-it-works" className="flex-1 px-8 py-6 glass text-white font-black rounded-3xl text-[11px] tracking-widest hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center uppercase hover:-translate-y-1">NASIL ÇALIŞIR?</Link>
        </div>
      </section>

      {/* Scrolling Ticker (Marquee) */}
      <div className="w-full bg-accent py-6 overflow-hidden border-y border-black/10 rotate-[-1deg] scale-105 z-10 shadow-2xl flex items-center">
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-16 text-black font-display font-black text-2xl md:text-4xl tracking-tighter uppercase italic flex items-center gap-10">
              L'ATELIER: %20 İNDİRİM 
              <span className="text-black/30">•</span> 
              ZUMA: ÖZEL TADIM MENÜSÜ 
              <span className="text-black/30">•</span> 
              SUNSET: BOĞAZ'DA %15 FIRSATI 
              <span className="text-black/30">•</span> 
              EVOLUTION AJANS AYRICALIĞI 
              <span className="text-black/30">•</span> 
              ŞEHRİN EN İYİLERİ BURADA 
              <span className="text-black/30">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="w-full max-w-7xl px-6 py-40 grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
        {STATS.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center reveal" style={{ animationDelay: `${i * 150}ms` }}>
            <span className="font-display text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">{stat.value}</span>
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Big Motto Section */}
      <section className="w-full px-6 py-40 flex flex-col items-center justify-center bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full mesh-gradient opacity-30" />
        <div className="relative z-10 text-center max-w-6xl">
          <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-10 block">Mottomuz</span>
          <h2 className="font-display text-4xl md:text-8xl font-black italic tracking-tighter leading-[1] text-balance">
            "SADECE BİR <span className="text-accent underline decoration-8 underline-offset-10">REZERVASYON</span> DEĞİL, BİR ŞEHİR DENEYİMİ."
          </h2>
        </div>
      </section>

      {/* System Logic Section */}
      <section id="how-it-works" className="w-full max-w-7xl px-6 py-40 relative">
        <div className="text-center mb-28">
          <h2 className="font-display text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-none">SİSTEM NASIL <br /><span className="text-accent italic">İŞLER?</span></h2>
          <p className="text-muted font-bold text-xs tracking-widest uppercase mt-4">Evolution Ajans ile karmaşıklığı tarihe gömdük.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {STEPS.map((step, idx) => (
            <div key={idx} className="group relative p-12 glass rounded-[3.5rem] border border-white/5 hover:border-accent/30 transition-all duration-700 hover:-translate-y-4">
              <div className="text-7xl mb-10 group-hover:scale-110 transition-transform duration-500 block grayscale group-hover:grayscale-0">{step.icon}</div>
              <div className="font-display text-8xl font-black text-white/[0.03] absolute top-12 right-12 group-hover:text-accent/10 transition-colors italic leading-none">{step.number}</div>
              <h3 className="font-display text-3xl font-black mb-6 tracking-tight uppercase">{step.title}</h3>
              <p className="text-muted font-medium leading-relaxed text-lg">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section id="restaurants" className="w-full max-w-7xl px-6 py-32 md:py-40">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-24 gap-8 md:gap-10">
          <div className="max-w-2xl text-left">
            <h2 className="font-display text-4xl md:text-9xl font-black mb-6 md:mb-10 tracking-tighter leading-[0.9] md:leading-[0.8] uppercase text-balance">SEÇKİN <br /><span className="text-accent italic">MEKANLAR</span></h2>
            <p className="text-muted text-sm md:text-xl font-bold tracking-tight uppercase opacity-60 leading-relaxed">Evolution Ajans kürasyonuyla şehrin en ikonik noktaları.</p>
          </div>
          <button className="px-10 md:px-12 py-5 md:py-6 glass text-white font-black rounded-2xl md:rounded-[2rem] hover:bg-accent hover:text-black transition-all border border-white/10 uppercase tracking-[0.3em] text-[10px] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]">Tümünü Gör</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {MOCK_RESTAURANTS.map((res) => (
            <Link key={res.id} href={`/restaurant/${res.id}`} className="group relative">
              <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-white/10 mb-10 shadow-2xl bg-card">
                <Image 
                  src={res.image} 
                  alt={res.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />
                
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-5 py-2 bg-accent text-black text-[9px] font-black rounded-full uppercase tracking-widest">{res.category}</span>
                    <span className="px-5 py-2 glass text-white text-[9px] font-black rounded-full uppercase tracking-widest">{res.location}</span>
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter group-hover:text-accent transition-colors uppercase">{res.name}</h3>
                </div>

                <div className="absolute top-12 right-12 glass w-16 h-16 rounded-full flex items-center justify-center font-black text-sm border border-white/20 shadow-2xl">
                  {res.rating}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full max-w-7xl px-6 py-40">
        <div className="w-full glass rounded-[4rem] p-12 md:p-32 flex flex-col items-center text-center border border-white/10 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent opacity-10 blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent opacity-5 blur-[100px]" />
          
          <h2 className="relative z-10 font-display text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-12 italic">
            MASANDA <br /> YERİN <span className="text-accent underline decoration-8 underline-offset-12">HAZIR.</span>
          </h2>
          <Link href="/login" className="relative z-10 px-12 py-7 bg-white text-black font-black rounded-[2.5rem] text-sm tracking-[0.3em] uppercase hover:bg-accent transition-all shadow-2xl hover:scale-105 active:scale-95">
            HEMEN KATIL
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-32 px-6 glass relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center font-display font-black text-3xl text-black italic">E</div>
              <span className="font-display text-4xl font-black tracking-tighter uppercase leading-none">Evolution <br /><span className="text-accent text-sm tracking-[0.5em]">Ajans</span></span>
            </div>
            <p className="text-muted font-medium text-lg leading-relaxed text-balance opacity-80">
              Gastronomi dünyasında dijital dönüşümün öncüsü, Evolution Ajans. Sınırları zorlayan, cesur ve akıllı deneyimler için buradayız.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-32">
            <div className="flex flex-col gap-8">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Platform</span>
              <a href="#restaurants" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors">Keşfet</a>
              <a href="#restaurants" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors">Mekanlar</a>
              <a href="#how-it-works" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors">Nasıl Çalışır</a>
            </div>
            <div className="flex flex-col gap-8">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Evolution</span>
              <a href="#" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Ajans</a>
              <a href="#" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors font-bold">İletişim</a>
              <a href="#" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Kariyer</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-muted uppercase tracking-[0.5em]">
          <span>© 2026 Evolution Ajans. Tüm hakları saklıdır.</span>
          <div className="flex gap-16">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
