import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import HomeHero from "@/components/HomeHero"; // Arama state'i için yeni bileşen gerekecek
import { getAddressLabel, getAddressDistrict, getCategoryIcon } from "@/utils/maps";

export const dynamic = "force-dynamic";

const RESTAURANT_LOGOS = [
    { name: "ZUMA", slug: "zuma-istanbul" },
    { name: "NUSR-ET", slug: "nusr-et-steakhouse" },
    { name: "MIKLA", slug: "mikla" },
    { name: "ULUS 29", slug: "ulus-29" },
    { name: "PAPER MOON", slug: "paper-moon" },
    { name: "VOGUE", slug: "vogue-restaurant" }
];

const CATEGORIES = [
    { name: "Deniz Ürünleri", icon: "🐟", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop" },
    { name: "Uzak Doğu", icon: "🥢", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop" },
    { name: "İtalyan Mutfağı", icon: "🍝", image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop" },
    { name: "Steakhouse", icon: "🥩", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop" },
    { name: "Fransız Mutfağı", icon: "🥐", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop" },
    { name: "Geleneksel Türk", icon: "🥘", image: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=800&auto=format&fit=crop" },
    { name: "Dünya Mutfağı", icon: "🌐", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop" },
];

export default async function Home() {
    const supabase = await createClient();

    // Veritabanından onaylı restoranları çek (is_featured DESC, created_at DESC)
    let restaurants: any[] = [];
    try {
        const { data } = await supabase
            .from("restaurants")
            .select("*")
            .eq("status", "approved")
            .order("is_featured", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(50);
        restaurants = data || [];
    } catch (e: any) {
        console.warn("is_featured kolonuna göre sıralama başarısız oldu, normal sıralamaya dönülüyor:", e.message);
        const { data } = await supabase
            .from("restaurants")
            .select("*")
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(50);
        restaurants = data || [];
    }

    // Paket servis veren restoranları çek
    let deliveryRestaurants: any[] = [];
    try {
        const { data } = await supabase
            .from("restaurants")
            .select("*")
            .eq("status", "approved")
            .eq("has_delivery", true)
            .order("rating", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(20);

        deliveryRestaurants = data || [];
    } catch (e: any) {
        console.warn("has_delivery kolonu bulunamadı veya sorgu başarısız oldu:", e.message);
        // Fallback: ilk 20 restoranı alıp in-memory olarak delivery listesini simüle et
        deliveryRestaurants = restaurants.slice(0, 20);
    }

    // Marquee restoran logolarını çek (Tablo yoksa veya kolon yoksa çökmesini önlemek için try-catch)
    let marqueeLogos: any[] = [];
    try {
        const { data } = await supabase
            .from("restaurants")
            .select("name, slug, show_in_marquee")
            .eq("status", "approved")
            .eq("show_in_marquee", true);

        marqueeLogos = data || [];
    } catch (e) {
        console.warn("restaurants tablosunda show_in_marquee kolonu bulunamadı, varsayılanlar kullanılacak.");
    }

    const finalMarqueeItems = marqueeLogos.length > 0 ? marqueeLogos : RESTAURANT_LOGOS;

    // Reklamları çek (Tablo yoksa çökmesini engellemek için try-catch)
    let adsList: any[] = [];
    try {
        const { data } = await supabase
            .from("ads")
            .select(`
                *,
                restaurants (
                    name,
                    slug
                )
            `)
            .order("position");
        adsList = data || [];
    } catch (e) {
        console.warn("ads tablosu bulunamadı, varsayılan reklamlarla devam ediliyor.");
    }

    // Pozisyon 1 ve 2 için reklam verilerini hazırla (varsayılanlarla birleştir)
    const ad1 = adsList.find(a => a.position === 1) || {
        title: "BURADA YERİNİZİ",
        subtitle: "ALIN",
        image_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
        restaurants: null
    };

    const ad2 = adsList.find(a => a.position === 2) || {
        title: "BURADA YERİNİZİ",
        subtitle: "ALIN",
        image_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
        restaurants: null
    };

    const finalAds = [ad1, ad2];

    const ad3 = adsList.find(a => a.position === 3) || {
        title: "BURADA YERİNİZİ",
        subtitle: "ALIN",
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        restaurants: null
    };

    const ad4 = adsList.find(a => a.position === 4) || {
        title: "BURADA YERİNİZİ",
        subtitle: "ALIN",
        image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
        restaurants: null
    };

    const secondFinalAds = [ad3, ad4];

    // Başlık ayarlarını çekelim (Tablo yoksa çökmesin diye try-catch yapıyoruz)
    let settingsList: any[] = [];
    try {
        const { data } = await supabase
            .from("settings")
            .select("*");
        settingsList = data || [];
    } catch (e) {
        console.warn("settings tablosu bulunamadı, varsayılan başlıklarla devam ediliyor.");
    }

    const getSetting = (key: string, defaultValue: string) => {
        return settingsList.find(s => s.key === key)?.value || defaultValue;
    };

    const heroTitle = getSetting("hero_title", "BODRUMUN EN İYİ MASALARI.");
    const categoriesTitle = getSetting("categories_title", "ÖNE ÇIKAN <br /><span class=\"text-accent italic\">KATEGORİLER</span>");
    const featuredTitle = getSetting("featured_title", "SEÇKİN <br /><span class=\"text-accent italic\">MASALAR</span>");
    const howItWorksTitle = getSetting("how_it_works_title", "SİSTEM NASIL <br /><span class=\"text-accent italic\">İŞLER?</span>");
    const marqueeText = getSetting("marquee_text", "EVOLUTION AJANS • %100 GERÇEK REZERVASYON • ŞEHRİN EN İYİLERİ");

    // Seçkin masalar içine reklam restoranları enjekte etme mantığı
    let finalRestaurants: any[] = [];
    try {
        const regularList = restaurants.filter(r => !r.is_featured_ad && !r.is_ad_only);
        const adList = restaurants.filter(r => r.is_featured_ad);
        const frequencyStr = getSetting("featured_ad_frequency", "3");
        const frequency = parseInt(frequencyStr, 10);

        if (regularList.length > 0 && adList.length > 0 && frequency > 0) {
            let adIndex = 0;
            for (let i = 0; i < regularList.length; i++) {
                finalRestaurants.push(regularList[i]);
                // Her N restoranda bir reklam ekle
                if ((i + 1) % frequency === 0) {
                    const adItem = adList[adIndex % adList.length];
                    finalRestaurants.push({ ...adItem });
                    adIndex++;
                }
            }
            // Eğer normal liste sıklık miktarından kısa olduğu için hiç reklam enjekte edilmediyse, reklamları sona ekle
            if (adIndex === 0 && adList.length > 0) {
                finalRestaurants.push(...adList.map(ad => ({ ...ad })));
            }
        } else {
            // Eğer normal liste boşsa, sıklık 0 ise veya hiç reklam mekan seçilmediyse normal listeyi göster
            finalRestaurants = restaurants;
        }
    } catch (e) {
        console.warn("Reklam restoran enjeksiyonu başarısız oldu, normal liste gösteriliyor:", e);
        finalRestaurants = restaurants;
    }

    return (
        <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-accent selection:text-black">

            {/* 1. TOP MARQUEE */}
            <div className="fixed top-[92px] md:top-[136px] z-50 w-full bg-gray-400/70 border-b border-black/10 py-3 md:py-4 overflow-hidden backdrop-blur-md">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            {finalMarqueeItems.map((item) => (
                                <Link key={item.slug} href={`/restaurant/${item.slug}`} className="mx-2 px-6 py-3 bg-accent rounded-xl flex items-center justify-center font-black text-black tracking-widest uppercase hover:bg-black hover:text-accent transition-all italic shadow-lg text-xs md:text-sm shrink-0">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. HERO SECTION (Client Component for search state) */}
            <HomeHero title={heroTitle} />

            {/* 3. MIDDLE TICKER (Haber Bandı) */}
            <div className="w-full bg-accent py-4 md:py-6 border-y border-black/20 z-10 shadow-2xl flex items-center overflow-hidden">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            {marqueeText.split(",").map((item: string, idx: number) => (
                                <span key={idx} className="text-black font-display font-black text-xl md:text-4xl tracking-tighter uppercase italic flex items-center">
                                    <span className="mx-8">{item.trim()}</span>
                                    <span className="opacity-30 font-sans text-sm md:text-2xl">•</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. CATEGORIES */}
            <section className="w-full max-w-7xl px-6 py-20 z-10">
                <h2
                    className="font-display text-4xl md:text-6xl font-black uppercase leading-[0.9] text-white mb-12 animate-in fade-in duration-500"
                    dangerouslySetInnerHTML={{ __html: categoriesTitle }}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.name} href={`/restaurants?category=${cat.name}`} className="group relative">
                            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-card transition-all duration-500 hover:border-accent">
                                <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                    <span className="text-2xl md:text-3xl mb-2 group-hover:scale-125 transition-transform">{cat.icon}</span>
                                    <h3 className="font-display text-xs md:text-sm font-black text-white tracking-tighter group-hover:text-accent transition-colors uppercase italic">{cat.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 5. DUAL AD BANNERS */}
            <section className="w-full max-w-[92rem] px-4 py-12 z-30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {finalAds.map((ad, idx) => {
                        const href = ad.restaurants?.slug
                            ? `/restaurant/${ad.restaurants.slug}`
                            : "/login/restaurant?mode=register";

                        return (
                            <Link key={idx} href={href} className="group relative h-48 rounded-[2.5rem] border-4 border-accent overflow-hidden bg-black shadow-xl">
                                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                                    <Image
                                        src={ad.image_url || (idx === 0 ? 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop')}
                                        alt="Ad"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-black/60" />
                                <div className="relative h-full p-8 flex flex-col justify-between">
                                    <span className="px-3 py-1 bg-accent text-black text-[8px] font-black rounded-full w-fit uppercase shadow-xl">REKLAM</span>
                                    <h4 className="font-display text-2xl font-black text-white italic uppercase leading-none">
                                        {ad.title} <br />
                                        <span className="text-accent">{ad.subtitle}</span>
                                    </h4>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 5.5. EN İYİ PAKET SERVİSLERİ (Yeni Bölüm) */}
            <section className="w-full max-w-[92rem] px-4 py-12 z-10 border-b border-white/5">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
                    <div>
                        <h2 className="font-display text-4xl md:text-6xl font-black uppercase leading-[0.8] text-white">
                            EN İYİ <br />
                            <span className="text-accent italic">PAKET SERVİSLERİ</span>
                        </h2>
                    </div>
                    <Link href="/restaurants" className="px-8 py-4 glass text-white font-black rounded-xl hover:bg-black hover:text-accent border-[3px] border-accent transition-all uppercase tracking-widest text-[9px] shadow-md">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
                    {deliveryRestaurants && deliveryRestaurants.map((res, idx) => (
                        <Link key={`${res.id}-${idx}`} href={`/restaurant/${res.slug}`} className="group bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col border-2 md:border-4 border-accent">
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                <Image src={res.photos?.[0] || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"} alt={res.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                {/* Kategori Badge (Sol Üst) */}
                                <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 bg-[#7C3AED] px-2.5 py-1 md:px-4 md:py-1.5 rounded-md md:rounded-lg shadow-lg">
                                    <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">{res.category || 'Lüks'}</span>
                                </div>
                                {/* İlçe/Bölge Badge (Sağ Alt) */}
                                <div className="absolute bottom-2.5 right-2.5 md:bottom-4 md:right-4 bg-[#FF0000] px-2.5 py-1 md:px-4 md:py-1.5 rounded-md md:rounded-lg shadow-lg">
                                    <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">{getAddressDistrict(res.address, res.district)}</span>
                                </div>
                            </div>
                            <div className="pt-6 px-3.5 pb-3.5 md:pt-8 md:px-5 md:pb-5 flex-1 flex flex-col justify-between relative">
                                {/* Siyah Daire Logo Overlay */}
                                <div className="absolute -top-6 left-3 w-12 h-12 md:-top-8 md:left-5 md:w-16 md:h-16 rounded-full bg-black flex items-center justify-center shadow-lg border-2 border-white z-20 overflow-hidden">
                                    {res.logo_url ? (
                                        <img src={res.logo_url} alt={`${res.name} Logo`} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm md:text-xl font-display font-black text-white uppercase tracking-wider">{res.name?.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="mt-1.5 flex flex-col gap-1 md:gap-2">
                                    <h3 className="font-display text-sm md:text-lg lg:text-xl font-black text-gray-900 uppercase leading-none tracking-tight group-hover:text-[#7C3AED] transition-colors truncate">{res.name}</h3>
                                    <div className="flex items-center gap-1 md:gap-1.5 text-gray-600">
                                        <span className="text-xs md:text-sm">📞</span>
                                        <span className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-wider leading-none">
                                            {res.phone || "Telefon Belirtilmedi"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 6. FEATURED RESTAURANTS (Sunucudan Gelen Veri) */}
            <section className="w-full max-w-[92rem] px-4 py-20 z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2
                            className="font-display text-5xl md:text-8xl font-black uppercase leading-[0.8] text-white animate-in fade-in duration-500"
                            dangerouslySetInnerHTML={{ __html: featuredTitle }}
                        />
                    </div>
                    <Link href="/restaurants" className="px-10 py-5 glass text-white font-black rounded-2xl hover:bg-black hover:text-accent border-[3px] border-accent transition-all uppercase tracking-widest text-[10px] shadow-lg">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
                    {finalRestaurants && finalRestaurants.map((res, idx) => (
                        <Link key={`${res.id}-${idx}`} href={`/restaurant/${res.slug}`} className={`group bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col border-2 md:border-4 border-accent ${res.is_featured_ad ? 'hover:border-accent hover:ring-2 hover:ring-accent/20' : ''}`}>
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                <Image src={res.photos?.[0] || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"} alt={res.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                {/* Kategori Badge (Sol Üst) */}
                                <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 bg-[#7C3AED] px-2.5 py-1 md:px-4 md:py-1.5 rounded-md md:rounded-lg shadow-lg">
                                    <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">{res.category || 'Lüks'}</span>
                                </div>
                                {/* İlçe/Bölge Badge (Sağ Alt) */}
                                <div className="absolute bottom-2.5 right-2.5 md:bottom-4 md:right-4 bg-[#FF0000] px-2.5 py-1 md:px-4 md:py-1.5 rounded-md md:rounded-lg shadow-lg">
                                    <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">{getAddressDistrict(res.address, res.district)}</span>
                                </div>
                            </div>
                            <div className="pt-6 px-3.5 pb-3.5 md:pt-9 md:px-6 md:pb-6 flex-1 flex flex-col justify-between relative">
                                {/* Siyah Daire Logo Overlay */}
                                <div className="absolute -top-6 left-3 w-12 h-12 md:-top-10 md:left-6 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center shadow-xl border-2 border-white z-20 overflow-hidden">
                                    {res.logo_url ? (
                                        <img src={res.logo_url} alt={`${res.name} Logo`} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm md:text-2xl font-display font-black text-white uppercase tracking-wider">{res.name?.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="mt-1.5 flex flex-col gap-1 md:gap-2.5">
                                    <h3 className="font-display text-sm md:text-xl lg:text-2xl font-black text-gray-900 uppercase leading-none tracking-tight group-hover:text-[#7C3AED] transition-colors truncate">{res.name}</h3>
                                    <div className="flex items-center gap-1 md:gap-2 text-gray-600">
                                        <span className="text-xs md:text-base">📞</span>
                                        <span className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-wider leading-none">
                                            {res.phone || "Telefon Belirtilmedi"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 6.5. SECOND DUAL AD BANNERS */}
            <section className="w-full max-w-[92rem] px-4 pt-24 pb-12 z-30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {secondFinalAds.map((ad, idx) => {
                        const href = ad.restaurants?.slug
                            ? `/restaurant/${ad.restaurants.slug}`
                            : "/login/restaurant?mode=register";

                        return (
                            <Link key={idx} href={href} className="group relative h-48 rounded-[2.5rem] border-4 border-accent overflow-hidden bg-black shadow-xl">
                                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                                    <Image
                                        src={ad.image_url || (idx === 0 ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop')}
                                        alt="Ad"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-black/60" />
                                <div className="relative h-full p-8 flex flex-col justify-between">
                                    <span className="px-3 py-1 bg-accent text-black text-[8px] font-black rounded-full w-fit uppercase shadow-xl">REKLAM</span>
                                    <h4 className="font-display text-2xl font-black text-white italic uppercase leading-none">
                                        {ad.title} <br />
                                        <span className="text-accent">{ad.subtitle}</span>
                                    </h4>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 7. HOW IT WORKS */}
            <section className="w-full max-w-7xl px-6 py-32 z-10">
                <div className="bg-black/40 backdrop-blur-3xl rounded-[4rem] border-4 border-accent p-12 md:p-24 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] -z-10" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2
                                className="font-display text-5xl md:text-7xl font-black text-white uppercase leading-none mb-8 animate-in fade-in duration-500"
                                dangerouslySetInnerHTML={{ __html: howItWorksTitle }}
                            />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs max-w-md leading-relaxed">Şehrin en seçkin masaları sadece bir tık uzağınızda. Ayrıcalıklı rezervasyon deneyimi ile tanışın.</p>
                        </div>
                        <div className="space-y-12">
                            {[
                                { step: "01", title: "KEŞFET", desc: "Şehrin en lüks ve popüler restoranlarını kategorilerine göre incele." },
                                { step: "02", title: "MASANI SEÇ", desc: "Arzu ettiğin tarih ve saat için uygun masayı anında görüntüle." },
                                { step: "03", title: "KEYFİNİ ÇIKAR", desc: "Rezervasyonun onaylandığında tek yapman gereken o anın tadını çıkarmak." }
                            ].map((item) => (
                                <div key={item.step} className="flex gap-8 group">
                                    <span className="font-display text-5xl font-black text-accent/20 group-hover:text-accent transition-colors duration-500">{item.step}</span>
                                    <div>
                                        <h4 className="text-white font-black text-xl uppercase italic mb-2 tracking-tighter">{item.title}</h4>
                                        <p className="text-zinc-300 text-xs font-bold uppercase tracking-wide leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. RESTAURANT ONBOARDING */}
            <section className="w-full px-6 py-32 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="relative group overflow-hidden rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent p-px">
                        <div className="relative bg-[#0A0A0A] rounded-[2.9rem] px-8 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
                            {/* Dekoratif Arka Plan Elemanları - Çok Hafif */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />

                            <div className="relative z-10 max-w-4xl">
                                <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black rounded-full uppercase tracking-[0.3em] mb-8 border border-accent/20">
                                    Ayrıcalıklı Dünya
                                </span>
                                <h2 className="font-display text-5xl md:text-8xl font-black text-white uppercase leading-[0.85] mb-10 tracking-tighter">
                                    MASANDA YERİN <br />HAZIR, <span className="text-accent italic text-4xl md:text-7xl">Hemen Başla</span>
                                </h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-16 max-w-xl mx-auto leading-relaxed">
                                    Sadece saniyeler içinde profilini oluştur, şehrin en seçkin <br className="hidden md:block" /> restoranları arasındaki yerini ayırt etmeye başla.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link href="/login/member?mode=register" className="w-full sm:w-auto px-12 py-6 bg-accent text-black font-black rounded-2xl hover:scale-105 transition-all duration-300 uppercase tracking-widest text-xs shadow-xl">
                                        Hemen Kayıt Ol
                                    </Link>
                                    <Link href="/login/member" className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all duration-300 uppercase tracking-widest text-xs">
                                        Giriş Yap
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
