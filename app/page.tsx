"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const RESTAURANT_LOGOS = [
    "ZUMA", "SUNSET", "L'ATELIER", "NUSR-ET", "MIKLA", "ULUS 29", "PAPER MOON", "VOGUE"
];

const CATEGORIES = [
    { name: "Deniz Ürünleri", icon: "🐟", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop" },
    { name: "Uzak Doğu", icon: "🥢", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop" },
    { name: "İtalyan Mutfağı", icon: "🍝", image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop" },
    { name: "Geleneksel", icon: "🥘", image: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=800&auto=format&fit=crop" },
    { name: "Steakhouse", icon: "🥩", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop" },
    { name: "Fransız Mutfağı", icon: "🥐", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop" },
];

const STEPS = [
    {
        number: "01",
        title: "Mekanı Keşfet",
        description: "Şehrin en seçkin restoranlarını listele, ambiyansı incele.",
        icon: "🔍"
    },
    {
        number: "02",
        title: "Anında Rezerve Et",
        description: "Uygun saatini seç, saniyeler içinde masanı ayır.",
        icon: "📅"
    },
    {
        number: "03",
        title: "Kodunla Giriş Yap",
        description: "Özel giriş kodunla kapıda beklemeden masana geç.",
        icon: "🔑"
    }
];

const STATS = [
    { label: "Seçkin Restoran", value: "120+" },
    { label: "Mutlu Misafir", value: "45K+" },
    { label: "Şehir", value: "12" },
    { label: "Bekleme Süresi", value: "0" }
];

const ADS = [
    { title: "ZUMA: ÖZEL TADIM MENÜSÜ", subtitle: "Uzak Doğu'nun gizemli tatlarını keşfedin.", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop", tag: "SPONSORLU" },
    { title: "SUNSET: BOĞAZ'DA %15 FIRSATI", subtitle: "Eşsiz manzara eşliğinde unutulmaz bir akşam yemeği.", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop", tag: "SPONSORLU" },
    { title: "L'ATELIER'DE ŞARAP GECESİ", subtitle: "Seçili Fransız şaraplarında %20 indirim.", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop", tag: "ÖNE ÇIKAN" },
    { title: "NUSR-ET VIP GEÇİŞ", subtitle: "Evolution Ajans üyelerine özel beklemeden geçiş.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", tag: "SPONSORLU" }
];

const MOCK_RESTAURANTS = [
    {
        id: "1",
        name: "L'Atelier de L'Entrecôte",
        category: "Fransız Mutfağı",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
        location: "Nişantaşı",
        address: "Abdi İpekçi Cad. No:12, Nişantaşı",
        phone: "+90 (212) 234 56 78"
    },
    {
        id: "2",
        name: "Zuma Istanbul",
        category: "Modern Japon",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
        location: "İstinye Park",
        address: "İstinye Park AVM, No: 461",
        phone: "+90 (212) 345 67 89"
    },
    {
        id: "3",
        name: "Sunset Grill & Bar",
        category: "Akdeniz & Sushi",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
        location: "Ulus",
        address: "Yol Sk. No:2, Ulus Parkı",
        phone: "+90 (212) 456 78 90"
    },
    {
        id: "4",
        name: "Mikla",
        category: "Yeni Anadolu",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
        location: "Beyoğlu",
        address: "The Marmara Pera, Meşrutiyet Cad. No:15",
        phone: "+90 (212) 293 56 56"
    },
    {
        id: "5",
        name: "Ulus 29",
        category: "Dünya Mutfağı",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop",
        location: "Ulus",
        address: "Adnan Saygun Cad. Ulus Parkı İçi",
        phone: "+90 (212) 358 29 29"
    },
    {
        id: "6",
        name: "Paper Moon",
        category: "İtalyan Mutfağı",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop",
        location: "Bodrum",
        address: "Milta Bodrum Marina",
        phone: "+90 (252) 316 74 74"
    },
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCat, setSelectedCat] = useState("Tüm Kategoriler");

    return (
        <main className="relative min-h-screen noise-overlay mesh-gradient flex flex-col items-center overflow-x-hidden selection:bg-accent selection:text-black">

            {/* Logo Marquee (Top) */}
            <div className="fixed top-20 md:top-28 z-40 w-full bg-white/[0.05] backdrop-blur-xl border-y border-white/10 py-3 md:py-4 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            {RESTAURANT_LOGOS.map((logo) => (
                                <div key={logo} className="mx-3 md:mx-6 px-4 md:px-8 py-2 md:py-3 bg-white/10 border border-white/30 rounded-xl md:rounded-2xl flex items-center justify-center hover:border-accent/50 transition-colors group">
                                    <span className="text-[9px] md:text-[11px] font-black text-white tracking-[0.3em] md:tracking-[0.4em] uppercase group-hover:text-accent transition-colors cursor-default">
                                        {logo}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-48 md:pt-80 pb-20 md:pb-32 px-6 flex flex-col items-center text-center max-w-6xl w-full">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-accent mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 uppercase">
                    Evolution Ajans • Akıllı Rezervasyon Sistemi
                </div>
                
                <h1 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-10 md:mb-12 leading-[0.9] md:leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase text-balance">
                    BODRUMUN EN İYİ <br /> 
                    <span className="text-accent italic">
                        MASALARI.
                    </span>
                </h1>

                {/* Search Bar with Categories */}
                <div className="w-full max-w-4xl glass p-2 md:p-4 rounded-[2rem] md:rounded-[3.5rem] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-10 duration-1000 mb-10 md:mb-14">
                    <div className="flex-1 w-full relative flex items-center">
                        <span className="absolute left-6 text-lg md:text-xl">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Restoran veya mutfak ara..." 
                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] pl-14 md:pl-16 pr-6 py-4 md:py-6 outline-none focus:border-accent/50 transition-all font-bold text-sm md:text-base placeholder:text-white/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2 md:gap-3">
                        <select 
                            className="w-full sm:w-auto bg-card border border-white/10 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-6 outline-none focus:border-accent/50 transition-all font-bold text-[10px] md:text-[11px] tracking-widest uppercase appearance-none cursor-pointer min-w-[160px] md:min-w-[180px]"
                            value={selectedCat}
                            onChange={(e) => setSelectedCat(e.target.value)}
                        >
                            <option>Tüm Kategoriler</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <button className="w-full sm:w-auto px-10 py-4 md:py-6 bg-accent text-black font-black rounded-[1.5rem] md:rounded-[2rem] text-[10px] md:text-[11px] tracking-widest hover:scale-105 transition-all shadow-xl uppercase">
                            BUL
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <Link href="/categories" className="flex-1 px-8 py-5 md:py-6 bg-white text-black font-black rounded-2xl md:rounded-3xl text-[10px] md:text-[11px] tracking-widest hover:bg-accent transition-all shadow-[0_20px_50px_rgba(245,158,11,0.2)] flex items-center justify-center uppercase hover:-translate-y-1">KATEGORİLERİ GEZ</Link>
                    <Link href="/#how-it-works" className="flex-1 px-8 py-5 md:py-6 glass text-white font-black rounded-2xl md:rounded-3xl text-[10px] md:text-[11px] tracking-widest hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center uppercase hover:-translate-y-1">NASIL ÇALIŞIR?</Link>
                </div>
            </section>

            {/* Scrolling Ticker (Marquee) */}
            <div className="w-full bg-accent py-4 md:py-6 overflow-hidden border-y border-black/20 rotate-[-1deg] scale-105 z-10 shadow-2xl flex items-center">
                <div className="animate-marquee whitespace-nowrap">
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="mx-8 md:mx-16 text-black font-display font-black text-xl md:text-4xl tracking-tighter uppercase italic flex items-center gap-6 md:gap-10">
                            L'ATELIER: %20 İNDİRİM
                            <span className="text-black/40">•</span>
                            ZUMA: ÖZEL TADIM MENÜSÜ
                            <span className="text-black/40">•</span>
                            SUNSET: BOĞAZ'DA %15 FIRSATI
                            <span className="text-black/40">•</span>
                            EVOLUTION AJANS AYRICALIĞI
                            <span className="text-black/40">•</span>
                            ŞEHRİN EN İYİLERİ BURADA
                            <span className="text-black/40">•</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <section className="w-full max-w-7xl px-6 py-20 md:py-40 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-20">
                {STATS.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center reveal" style={{ animationDelay: `${i * 150}ms` }}>
                        <span className="font-display text-5xl md:text-8xl font-black text-white mb-2 md:mb-4 tracking-tighter">{stat.value}</span>
                        <span className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-[0.3em] md:tracking-[0.4em]">{stat.label}</span>
                    </div>
                ))}
            </section>

            {/* Big Motto Section */}
            <section className="w-full px-6 py-20 md:py-40 flex flex-col items-center justify-center bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full mesh-gradient opacity-30" />
                <div className="relative z-10 text-center max-w-6xl">
                    <span className="text-accent font-black text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase mb-8 md:mb-10 block">Mottomuz</span>
                    <h2 className="font-display text-3xl md:text-8xl font-black italic tracking-tighter leading-[1.1] md:leading-[1] text-balance">
                        "SADECE BİR <span className="text-accent underline decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-10">REZERVASYON</span> DEĞİL, BİR ŞEHİR DENEYİMİ."
                    </h2>
                </div>
            </section>

            {/* System Logic Section */}
            <section id="how-it-works" className="w-full max-w-7xl px-6 py-20 md:py-40 relative">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="font-display text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter uppercase leading-none text-balance">SİSTEM NASIL <span className="text-accent italic">İŞLER?</span></h2>
                    <p className="text-muted font-bold text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase mt-4">Evolution Ajans ile karmaşıklığı tarihe gömdük.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                    {STEPS.map((step, idx) => (
                        <div key={idx} className="group relative p-8 md:p-12 glass rounded-[2.5rem] md:rounded-[3.5rem] border-2 md:border-4 border-accent bg-accent/[0.05] shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                            <div className="text-5xl md:text-6xl mb-6 md:mb-8 block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{step.icon}</div>
                            <div className="font-display text-6xl md:text-8xl font-black text-accent/[0.1] absolute top-8 md:top-10 right-8 md:right-10 italic leading-none">{step.number}</div>
                            <h3 className="font-display text-2xl md:text-4xl font-black mb-4 md:mb-5 tracking-tighter uppercase text-white">{step.title}</h3>
                            <p className="text-white font-bold leading-relaxed text-base md:text-xl opacity-90">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Advertisements Set 1 */}
            <section className="w-full max-w-7xl px-6 py-10 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                    {ADS.slice(0, 2).map((ad, i) => (
                        <div key={i} className="group relative flex flex-col sm:flex-row lg:aspect-[16/10] xl:aspect-[16/9] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-card min-h-[500px] sm:min-h-[400px] lg:min-h-0">
                            <div className="relative w-full sm:w-1/2 h-64 sm:h-full">
                                <Image src={ad.image} alt={ad.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />
                            </div>
                            <div className="relative w-full sm:w-1/2 p-8 md:p-10 lg:p-12 flex flex-col justify-center items-start bg-black/40 backdrop-blur-sm sm:bg-transparent">
                                <span className="px-3 md:px-4 py-1.5 md:py-2 bg-accent text-black text-[8px] md:text-[9px] font-black rounded-full uppercase tracking-widest mb-6 md:mb-8">{ad.tag}</span>
                                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-5 tracking-tighter uppercase leading-[0.9]">{ad.title}</h3>
                                <p className="text-white/70 text-xs md:text-base font-bold uppercase tracking-tight mb-8 md:mb-10 leading-relaxed max-w-xs">{ad.subtitle}</p>
                                <button className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white text-black font-black rounded-xl text-[10px] md:text-[11px] tracking-widest hover:bg-accent transition-all uppercase shadow-xl hover:-translate-y-1 active:scale-95">REZERVE ET</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Restaurants (Seçkin Masalar) */}
            <section id="restaurants" className="w-full max-w-7xl px-6 py-20 md:py-40">
                {/* Section Ad Banner */}
                <div className="w-full mb-16 md:mb-24 h-32 md:h-48 glass rounded-[2rem] border-2 border-accent/20 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 group-hover:opacity-50 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <span className="px-3 py-1 bg-accent text-black text-[8px] font-black rounded-full uppercase tracking-widest">REKLAM ALANI</span>
                        <h4 className="font-display text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic">BURADA REKLAMINIZ OLABİLİR</h4>
                        <p className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">AYLIK 45K+ GÖRÜNTÜLENME</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-24 gap-6 md:gap-10">
                    <div className="max-w-2xl text-left">
                        <h2 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-10 tracking-tighter leading-[0.9] md:leading-[0.8] uppercase text-balance">SEÇKİN <br /><span className="text-accent italic">MASALAR</span></h2>
                        <p className="text-muted text-sm md:text-xl font-bold tracking-tight uppercase opacity-60 leading-relaxed">Evolution Ajans vizyonuyla şehrin en ikonik noktaları.</p>
                    </div>
                    <Link href="/restaurants" className="w-full md:w-auto px-10 md:px-12 py-5 md:py-6 glass text-white font-black rounded-2xl md:rounded-[2rem] hover:bg-accent hover:text-black transition-all border border-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] shadow-lg flex items-center justify-center">Tümünü Gör</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
                    {MOCK_RESTAURANTS.map((res) => (
                        <Link key={res.id} href={`/restaurant/${res.id}`} className="group relative">
                            <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-2 md:border-4 border-white/10 mb-6 md:mb-10 shadow-2xl bg-card transition-all duration-700 group-hover:border-accent group-hover:shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                                <Image
                                    src={res.image}
                                    alt={res.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />

                                <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
                                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                        <span className="px-3 md:px-5 py-1.5 md:py-2 bg-accent text-black text-[8px] md:text-[9px] font-black rounded-full uppercase tracking-widest">{res.category}</span>
                                    </div>
                                    <h3 className="font-display text-3xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter group-hover:text-accent transition-colors uppercase mb-6">{res.name}</h3>
                                    
                                    <div className="flex flex-col gap-2 md:gap-3 border-t border-white/10 pt-6">
                                        <div className="flex items-center gap-3 text-white/60 group-hover:text-white transition-colors">
                                            <span className="text-xs md:text-sm">📍</span>
                                            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider line-clamp-1">{res.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/60 group-hover:text-white transition-colors">
                                            <span className="text-xs md:text-sm">📞</span>
                                            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider">{res.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-8 right-8 md:top-12 md:right-12 glass w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black text-xs md:text-sm border border-white/20 shadow-2xl group-hover:border-accent group-hover:text-accent transition-all">
                                    {res.rating}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Categories */}
            <section id="categories" className="w-full max-w-7xl px-6 py-20 md:py-40">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-24 gap-6 md:gap-10">
                    <div className="max-w-2xl text-left">
                        <h2 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-10 tracking-tighter leading-[0.9] md:leading-[0.8] uppercase text-balance">ÖNE ÇIKAN <br /><span className="text-accent italic">KATEGORİLER</span></h2>
                        <p className="text-muted text-sm md:text-xl font-bold tracking-tight uppercase opacity-60 leading-relaxed">Evolution Ajans vizyonuyla mutfak sanatının zirvesi.</p>
                    </div>
                    <Link href="/categories" className="w-full md:w-auto px-10 md:px-12 py-5 md:py-6 glass text-white font-black rounded-2xl md:rounded-[2rem] hover:bg-accent hover:text-black transition-all border border-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] shadow-lg flex items-center justify-center">Tümünü Gör</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.name} href={`/categories`} className="group relative">
                            <div className="relative aspect-[4/3] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-card transition-all duration-700 hover:border-accent/30">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8">
                                    <span className="text-4xl md:text-5xl mb-4 md:mb-6 group-hover:scale-125 transition-transform duration-500">{cat.icon}</span>
                                    <h3 className="font-display text-2xl md:text-4xl font-black text-white text-center leading-none tracking-tighter group-hover:text-accent transition-colors uppercase italic">{cat.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Advertisements Set 2 */}
            <section className="w-full max-w-7xl px-6 py-10 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                    {ADS.slice(2, 4).map((ad, i) => (
                        <div key={i} className="group relative flex flex-col sm:flex-row lg:aspect-[16/10] xl:aspect-[16/9] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-card min-h-[500px] sm:min-h-[400px] lg:min-h-0">
                            <div className="relative w-full sm:w-1/2 h-64 sm:h-full">
                                <Image src={ad.image} alt={ad.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />
                            </div>
                            <div className="relative w-full sm:w-1/2 p-8 md:p-10 lg:p-12 flex flex-col justify-center items-start bg-black/40 backdrop-blur-sm sm:bg-transparent">
                                <span className="px-3 md:px-4 py-1.5 md:py-2 bg-accent text-black text-[8px] md:text-[9px] font-black rounded-full uppercase tracking-widest mb-6 md:mb-8">{ad.tag}</span>
                                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-5 tracking-tighter uppercase leading-[0.9]">{ad.title}</h3>
                                <p className="text-white/70 text-xs md:text-base font-bold uppercase tracking-tight mb-8 md:mb-10 leading-relaxed max-w-xs">{ad.subtitle}</p>
                                <button className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white text-black font-black rounded-xl text-[10px] md:text-[11px] tracking-widest hover:bg-accent transition-all uppercase shadow-xl hover:-translate-y-1 active:scale-95">REZERVE ET</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="w-full max-w-7xl px-6 py-20 md:py-40">
                <div className="w-full glass rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-32 flex flex-col items-center text-center border border-white/10 relative overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent opacity-10 blur-[100px]" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent opacity-5 blur-[100px]" />

                    <h2 className="relative z-10 font-display text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-8 md:mb-12 italic">
                        MASANDA <br /> YERİN <span className="text-accent underline decoration-4 md:decoration-8 underline-offset-8 md:underline-offset-12">HAZIR.</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 relative z-10 w-full sm:w-auto">
                        <Link href="/login/member" className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-7 bg-white text-black font-black rounded-[1.5rem] md:rounded-[2.5rem] text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase hover:bg-accent transition-all shadow-2xl hover:scale-105 active:scale-95">
                            ÜYE OLARAK KATIL
                        </Link>
                        <Link href="/login/restaurant" className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-7 glass text-white font-black rounded-[1.5rem] md:rounded-[2.5rem] text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase border border-white/10 hover:bg-white/5 transition-all shadow-2xl hover:scale-105 active:scale-95">
                            RESTORAN GİRİŞİ
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
