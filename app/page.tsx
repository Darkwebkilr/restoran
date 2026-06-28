import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import HomeHero from "@/components/HomeHero"; // Arama state'i için yeni bileşen gerekecek

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
    
    // Veritabanından onaylı restoranları çek
    const { data: restaurants } = await supabase
        .from("restaurants")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(4);

    return (
        <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-accent selection:text-black">
            
            {/* 1. TOP MARQUEE */}
            <div className="fixed top-20 md:top-28 z-40 w-full bg-gray-400/70 border-y border-black/10 py-2 md:py-3 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            {RESTAURANT_LOGOS.map((item) => (
                                <Link key={item.slug} href={`/restaurant/${item.slug}`} className="mx-2 px-6 py-3 bg-accent rounded-xl flex items-center justify-center font-black text-black tracking-widest uppercase hover:bg-black hover:text-accent transition-all italic shadow-lg">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. HERO SECTION (Client Component for search state) */}
            <HomeHero />

            {/* 3. MIDDLE TICKER (Haber Bandı) */}
            <div className="w-full bg-accent py-4 md:py-6 border-y border-black/20 z-10 shadow-2xl flex items-center">
                <div className="animate-marquee whitespace-nowrap">
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="text-black font-display font-black text-xl md:text-4xl tracking-tighter uppercase italic mx-8">
                            EVOLUTION AJANS • %100 GERÇEK REZERVASYON • ŞEHRİN EN İYİLERİ
                        </span>
                    ))}
                </div>
            </div>

            {/* 4. CATEGORIES */}
            <section className="w-full max-w-7xl px-6 py-20 z-10">
                <h2 className="font-display text-4xl md:text-6xl font-black uppercase leading-[0.9] text-white mb-12">ÖNE ÇIKAN <br /><span className="text-accent italic">KATEGORİLER</span></h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <section className="w-full max-w-7xl px-6 py-12 z-30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <Link key={i} href="/login/restaurant?mode=register" className="group relative h-48 rounded-[2.5rem] border-2 border-accent/40 overflow-hidden bg-black shadow-xl">
                            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                                <Image src={`https://images.unsplash.com/photo-${i === 1 ? '1514362545857-3bc16c4c7d1b' : '1552566626-52f8b828add9'}?q=80&w=800&auto=format&fit=crop`} alt="Ad" fill className="object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-black/60" />
                            <div className="relative h-full p-8 flex flex-col justify-between">
                                <span className="px-3 py-1 bg-accent text-black text-[8px] font-black rounded-full w-fit uppercase shadow-xl">REKLAM</span>
                                <h4 className="font-display text-2xl font-black text-white italic uppercase leading-none">BURADA YERİNİZİ <br /><span className="text-accent">ALIN</span></h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 6. FEATURED RESTAURANTS (Sunucudan Gelen Veri) */}
            <section className="w-full max-w-7xl px-6 py-20 z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="font-display text-5xl md:text-8xl font-black uppercase leading-[0.8] text-white">SEÇKİN <br /><span className="text-accent italic">MASALAR</span></h2>
                    </div>
                    <Link href="/restaurants" className="px-10 py-5 glass text-white font-black rounded-2xl hover:bg-black hover:text-accent border-2 border-white/40 transition-all uppercase tracking-widest text-[10px] shadow-lg">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {restaurants && restaurants.map((res) => (
                        <Link key={res.id} href={`/restaurant/${res.slug}`} className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                            <div className="relative aspect-video overflow-hidden">
                                <Image src={res.photos?.[0] || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"} alt={res.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-accent px-4 py-1.5 rounded-lg shadow-lg">
                                    <span className="text-[10px] font-black text-black uppercase tracking-widest">{res.category || 'Lüks'}</span>
                                </div>
                            </div>
                            <div className="p-8 flex-1">
                                <h3 className="font-display text-2xl font-black text-gray-900 uppercase italic mb-3 group-hover:text-accent transition-colors leading-none tracking-tighter">{res.name}</h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">📍 {res.address}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 7. HOW IT WORKS */}
            <section className="w-full max-w-7xl px-6 py-32 z-10">
                <div className="bg-black/40 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-12 md:p-24 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] -z-10" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="font-display text-5xl md:text-7xl font-black text-white uppercase leading-none mb-8">SİSTEM NASIL <br /><span className="text-accent italic">İŞLER?</span></h2>
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
