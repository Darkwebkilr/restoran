"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const RESTAURANT_LOGOS = [
    "ZUMA", "NUSR-ET", "MIKLA", "ULUS 29", "PAPER MOON", "VOGUE"
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
    { 
        title: "ZUMA: ÖZEL TADIM MENÜSÜ", 
        logo: "ZUMA", 
        subtitle: "Uzak Doğu'nun gizemli tatlarını keşfedin.", 
        location: "İSTİNYE", 
        address: "İstinye Park AVM, No: 461",
        phone: "+90 (212) 345 67 89",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop", 
        tag: "SPONSORLU" 
    },
    { 
        title: "NUSR-ET VIP GEÇİŞ", 
        logo: "NUSR-ET", 
        subtitle: "Evolution Ajans üyelerine özel beklemeden geçiş.", 
        location: "ETİLER", 
        address: "Etiler, Nispetiye Cad. No:87",
        phone: "+90 (212) 335 45 00",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop", 
        tag: "SPONSORLU" 
    },
    { 
        title: "PAPER MOON: BODRUM GECELERİ", 
        logo: "PAPER MOON", 
        subtitle: "Marinada unutulmaz bir akşam.", 
        location: "BODRUM", 
        address: "Milta Bodrum Marina",
        phone: "+90 (252) 316 74 74",
        image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=1200&auto=format&fit=crop", 
        tag: "ÖNE ÇIKAN" 
    }
];

const MOCK_RESTAURANTS = [
    {
        id: "2",
        name: "Zuma Istanbul",
        logo: "ZUMA",
        category: "Modern Japon",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
        location: "İstinye Park",
        address: "İstinye Park AVM, No: 461",
        phone: "+90 (212) 345 67 89"
    },
    {
        id: "4",
        name: "Mikla",
        logo: "MIKLA",
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
        logo: "ULUS 29",
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
        logo: "PAPER MOON",
        category: "İtalyan Mutfağı",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop",
        location: "Bodrum",
        address: "Milta Bodrum Marina",
        phone: "+90 (252) 316 74 74"
    },
];

const SLIDER_IMAGES = [
    {
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop",
        title: "ZUMA BODRUM AÇILIYOR",
        tag: "YENİ MEKAN"
    },
    {
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop",
        title: "EŞSİZ LEZZET DENEYİMİ",
        tag: "ÖNE ÇIKAN"
    },
    {
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop",
        title: "BODRUM'UN EN İYİ MANZARASI",
        tag: "RESERVASYON"
    }
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCat, setSelectedCat] = useState("Tüm Kategoriler");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? SLIDER_IMAGES.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-accent selection:text-black">

            <div className="fixed top-20 md:top-28 z-40 w-full bg-gray-400/70 border-y border-black/10 py-2 md:py-3 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            {RESTAURANT_LOGOS.map((logo) => (
                                <div key={logo} className="mx-1 md:mx-2 px-3 md:px-6 py-2 md:py-3 bg-accent border border-black/20 rounded-xl flex items-center justify-center hover:bg-black hover:border-accent transition-all group cursor-pointer">
                                    <span className="text-[10px] md:text-[14px] font-black text-black tracking-[0.3em] uppercase group-hover:text-accent transition-colors">
                                        {logo}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Screen Slider Hero */}
            <section className="relative w-full h-screen overflow-hidden group touch-pan-y">
                {SLIDER_IMAGES.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-[10s]"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-card" />
                    </div>
                ))}

                {/* Hero Content Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pt-20">
                    <div className="max-w-6xl w-full flex flex-col items-center text-center">
                        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[0.9] md:leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase text-balance">
                            BODRUMUN EN İYİ <br />
                            <span className="text-accent italic">
                                MASALARI.
                            </span>
                        </h1>

                        {/* Search Bar */}
                        <div className="w-full max-w-4xl glass p-2 md:p-3 rounded-[2rem] md:rounded-[3rem] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 mb-8">
                            <div className="flex-1 w-full relative flex items-center">
                                <span className="absolute left-6 text-lg">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Restoran veya mutfak ara..."
                                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] pl-14 pr-6 py-4 md:py-5 outline-none focus:border-accent/50 transition-all font-bold text-sm placeholder:text-white/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
                                <select
                                    className="w-full sm:w-auto bg-card border border-white/10 rounded-[1.5rem] md:rounded-[2rem] px-6 py-4 md:py-5 outline-none focus:border-accent/50 transition-all font-black text-[10px] tracking-widest uppercase appearance-none cursor-pointer min-w-[160px]"
                                    value={selectedCat}
                                    onChange={(e) => setSelectedCat(e.target.value)}
                                >
                                    <option>Tüm Kategoriler</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                                <button className="w-full sm:w-auto px-10 py-4 md:py-5 bg-accent text-black font-black rounded-[1.5rem] md:rounded-[2rem] text-[10px] tracking-widest hover:bg-black hover:text-accent border-2 border-accent transition-all uppercase">
                                    BUL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 glass rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-accent hover:text-black"
                >
                    ←
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 glass rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-accent hover:text-black"
                >
                    →
                </button>

                {/* Navigation Dots */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {SLIDER_IMAGES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full border border-white/50 transition-all ${index === currentSlide ? "bg-accent w-8" : "bg-white/20 hover:bg-white/50"}`}
                        />
                    ))}
                </div>
            </section>

            {/* Shrunk Ad Banner */}
            <section className="w-full max-w-6xl px-6 -mt-10 md:-mt-14 relative z-30">
                <div className="w-full h-20 md:h-28 glass rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-accent/50 flex items-center justify-center relative overflow-hidden group cursor-pointer mb-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 group-hover:opacity-50 transition-opacity" />
                    <div className="relative z-10 flex flex-row items-center gap-6">
                        <span className="px-3 py-1 bg-accent text-black text-[8px] font-black rounded-full uppercase tracking-widest">REKLAM</span>
                        <h4 className="font-display text-lg md:text-2xl font-black text-white tracking-tighter uppercase italic">BURADA REKLAMINIZ OLABİLİR</h4>
                        <p className="hidden md:block text-accent text-[9px] font-black uppercase tracking-widest">AYLIK 45K+ GÖRÜNTÜLENME</p>
                    </div>
                </div>
            </section>

            {/* Advertisements Set 1 - Moved here */}
            <section className="w-full max-w-7xl px-6 py-10 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {ADS.slice(0, 2).map((ad, i) => (
                        <div key={i} className="group relative flex flex-col sm:flex-row rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-card min-h-[400px]">
                            <div className="relative w-full sm:w-1/2 h-64 sm:h-auto">
                                <Image src={ad.image} alt={ad.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />
                                
                                {/* Logo Overlay (Circular) */}
                                <div className="absolute bottom-6 left-6 z-20">
                                    <div className="w-14 h-14 md:w-20 md:h-20 bg-accent rounded-full border-4 border-white/10 flex items-center justify-center font-display font-black text-[10px] md:text-xs text-black italic shadow-2xl group-hover:scale-110 transition-transform duration-500 text-center px-2 overflow-hidden leading-tight">
                                        {ad.logo}
                                    </div>
                                </div>

                                {/* District Horizontal Badge */}
                                <div className="absolute top-6 right-6 z-20">
                                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 group-hover:border-accent transition-colors">
                                        <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase whitespace-nowrap">
                                            {ad.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full sm:w-1/2 p-8 flex flex-col justify-center items-start bg-black/40 backdrop-blur-sm sm:bg-transparent">
                                <span className="px-3 py-1.5 bg-accent text-black text-[8px] font-black rounded-full uppercase tracking-widest mb-6">{ad.tag}</span>
                                <h3 className="font-display text-3xl font-black text-white mb-2 tracking-tighter uppercase leading-[0.9] italic">{ad.title}</h3>
                                
                                <div className="mb-6 flex flex-col gap-1">
                                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{ad.address}</span>
                                    <span className="text-[12px] text-accent font-black tracking-widest">{ad.phone}</span>
                                </div>

                                <p className="text-white/70 text-xs font-bold uppercase tracking-tight mb-8 leading-relaxed max-w-xs">{ad.subtitle}</p>
                                <button className="w-full sm:w-auto px-10 py-4 bg-white text-black font-black rounded-xl text-[10px] tracking-widest hover:bg-black hover:text-accent border-2 border-white transition-all uppercase shadow-xl">REZERVE ET</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Categories - Moved below Slider/Ad */}
            <section id="categories" className="w-full max-w-7xl px-6 py-10 md:py-20 z-10">

                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-6">
                    <div className="max-w-2xl text-left">
                        <h2 className="font-display text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-[0.9]">ÖNE ÇIKAN <br /><span className="text-accent italic">KATEGORİLER</span></h2>
                    </div>
                    <Link href="/categories" className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-accent hover:text-black border-2 border-white/40 transition-all uppercase tracking-widest text-[10px]">Tümünü Gör</Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.name} href={`/categories`} className="group relative">
                            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-card transition-all duration-500 hover:border-accent">
                                <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                    <span className="text-2xl md:text-3xl mb-2 group-hover:scale-125 transition-transform">{cat.icon}</span>
                                    <h3 className="font-display text-xs md:text-sm font-black text-white text-center tracking-tighter group-hover:text-accent transition-colors uppercase italic">{cat.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Restaurants (Seçkin Masalar) - Moved up for early visibility */}
            <section id="restaurants" className="w-full max-w-7xl px-6 py-10 md:py-20 z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-16 gap-6">
                    <div className="max-w-2xl text-left">
                        <h2 className="font-display text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.8] uppercase">SEÇKİN <br /><span className="text-accent italic">MASALAR</span></h2>
                        <p className="text-muted text-xs md:text-sm font-black uppercase opacity-60 tracking-widest">Şehrin en ikonik noktaları.</p>
                    </div>
                    <Link href="/restaurants" className="px-10 py-5 glass text-white font-black rounded-2xl hover:bg-black hover:text-accent border-2 border-white/40 transition-all uppercase tracking-widest text-[10px] shadow-lg">Tümünü Gör</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {MOCK_RESTAURANTS.map((res) => (
                        <Link key={res.id} href={`/restaurant/${res.id}`} className="group bg-white rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                            {/* Image Section */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden">
                                <Image
                                    src={res.image}
                                    alt={res.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                
                                {/* Category Badge - Purple */}
                                <div className="absolute top-4 left-4 bg-[#7C3AED] px-4 py-1.5 rounded-lg shadow-lg">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{res.category}</span>
                                </div>

                                {/* Location Badge - Red */}
                                <div className="absolute bottom-4 right-4 bg-[#EF4444] px-4 py-1.5 rounded-lg shadow-lg">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{res.location}</span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="relative p-6 pt-10 flex-1 flex flex-col">
                                {/* Logo Overlay (Circular) */}
                                <div className="absolute -top-10 left-6 w-20 h-20 bg-white rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                                    <div className="w-full h-full bg-accent flex items-center justify-center font-display font-black text-black italic text-sm">
                                        {res.logo}
                                    </div>
                                </div>

                                {/* Rating Section */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-[#FBBF24] text-sm">★</span>
                                        ))}
                                    </div>
                                    <span className="text-gray-400 text-[10px] font-bold">(120 Yorum)</span>
                                </div>

                                {/* Title */}
                                <h3 className="font-display text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-accent transition-colors uppercase italic">
                                    {res.name}
                                </h3>

                                {/* Address Section */}
                                <div className="mt-auto flex items-start gap-2 pt-4 border-t border-gray-100">
                                    <span className="text-gray-400 text-sm">📍</span>
                                    <p className="text-gray-600 text-[11px] font-medium leading-relaxed line-clamp-2 uppercase">
                                        {res.address}
                                    </p>
                                </div>
                                
                                {/* Phone (Added for completeness as per previous request) */}
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">📞</span>
                                    <span className="text-accent font-black text-xs tracking-widest">{res.phone}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Scrolling Ticker (Marquee) - Reduced Gaps */}
            <div className="w-full bg-accent py-4 md:py-6 border-y border-black/20 z-10 shadow-2xl flex items-center">
                <div className="animate-marquee whitespace-nowrap">
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="mx-4 md:mx-8 text-black font-display font-black text-xl md:text-4xl tracking-tighter uppercase italic flex items-center gap-4 md:gap-6">
                            ZUMA: ÖZEL TADIM MENÜSÜ
                            <span className="opacity-40">•</span>
                            PAPER MOON: BODRUM GECELERİ
                            <span className="opacity-40">•</span>
                            EVOLUTION AJANS AYRICALIĞI
                            <span className="opacity-40">•</span>
                            ŞEHRİN EN İYİLERİ BURADA
                            <span className="opacity-40">•</span>
                        </span>
                    ))}
                </div>
            </div>


            {/* System Logic Section */}
            <section id="how-it-works" className="w-full max-w-7xl px-6 py-20 md:py-32 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-none">SİSTEM NASIL <span className="text-accent italic">İŞLER?</span></h2>
                    <p className="text-muted font-bold text-[9px] tracking-[0.2em] uppercase mt-4">Evolution Ajans ile karmaşıklığı tarihe gömdük.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {STEPS.map((step, idx) => (
                        <div key={idx} className="group relative p-8 md:p-10 glass rounded-[2.5rem] border-2 border-accent bg-accent/[0.05] shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                            <div className="text-5xl mb-6 block">{step.icon}</div>
                            <div className="font-display text-6xl font-black text-accent/[0.1] absolute top-8 right-8 italic leading-none">{step.number}</div>
                            <h3 className="font-display text-2xl font-black mb-4 tracking-tighter uppercase text-white">{step.title}</h3>
                            <p className="text-white font-bold leading-relaxed text-sm opacity-90">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="w-full max-w-7xl px-6 py-20 md:py-32 z-10">
                <div className="w-full glass rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 flex flex-col items-center text-center border border-white/10 relative overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent opacity-10 blur-[100px]" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent opacity-5 blur-[100px]" />

                    <h2 className="relative z-10 font-display text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-8 italic">
                        MASANDA <br /> YERİN <span className="text-accent underline decoration-4 underline-offset-8">HAZIR.</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
                        <Link href="/login/member" className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-[1.5rem] text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-accent border-2 border-white transition-all shadow-2xl">
                            ÜYE OLARAK KATIL
                        </Link>
                        <Link href="/login/restaurant" className="w-full sm:w-auto px-10 py-5 glass text-white font-black rounded-[1.5rem] text-xs tracking-[0.2em] uppercase border border-white/10 hover:bg-black hover:border-accent transition-all shadow-2xl">
                            RESTORAN GİRİŞİ
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
