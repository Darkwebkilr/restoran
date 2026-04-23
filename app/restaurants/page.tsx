"use client";

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
        name: "Nusr-Et Steakhouse",
        category: "Steakhouse",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
        location: "Yalıkavak Marina",
        address: "Yalıkavak Marina, Bodrum",
        phone: "+90 (252) 385 44 94"
    },
    {
        id: "5",
        name: "Mikla",
        category: "Yeni Anadolu",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
        location: "Beyoğlu",
        address: "The Marmara Pera, Meşrutiyet Cad. No:15",
        phone: "+90 (212) 293 56 56"
    },
    {
        id: "6",
        name: "Paper Moon",
        category: "İtalyan",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop",
        location: "Bodrum",
        address: "Milta Bodrum Marina",
        phone: "+90 (252) 316 74 74"
    },
    {
        id: "7",
        name: "Ulus 29",
        category: "Dünya Mutfağı",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop",
        location: "Ulus",
        address: "Adnan Saygun Cad. Ulus Parkı İçi",
        phone: "+90 (212) 358 29 29"
    },
    {
        id: "8",
        name: "Vogue Restaurant",
        category: "Modern Avrupa",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
        location: "Beşiktaş",
        address: "BJK Plaza, Süleyman Seba Cad. No:48",
        phone: "+90 (212) 227 44 04"
    },
    {
        id: "9",
        name: "Lucca",
        category: "Bistro & Bar",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop",
        location: "Bebek",
        address: "Cevdet Paşa Cad. No:51, Bebek",
        phone: "+90 (212) 257 12 55"
    },
    {
        id: "10",
        name: "Mürver",
        category: "Ateş Mutfağı",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
        location: "Karaköy",
        address: "Novotel Istanbul Bosphorus, Kemankeş Cad. No:57",
        phone: "+90 (212) 372 07 50"
    },
    {
        id: "11",
        name: "Karaköy Lokantası",
        category: "Meyhane",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=800&auto=format&fit=crop",
        location: "Karaköy",
        address: "Kemankeş Cad. No:37, Karaköy",
        phone: "+90 (212) 292 44 55"
    },
    {
        id: "12",
        name: "Spago",
        category: "Kaliforniya",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
        location: "Nişantaşı",
        address: "The St. Regis Istanbul, Mim Kemal Öke Cad. No:35",
        phone: "+90 (212) 377 01 01"
    }
];

export default function RestaurantsPage() {
    return (
        <main className="relative min-h-screen noise-overlay mesh-gradient pt-48 pb-32 px-6 flex flex-col items-center">
            <div className="max-w-7xl w-full">
                <div className="mb-24 text-center md:text-left">
                    <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-6 block">Kürasyonumuz</span>
                    <h1 className="font-display text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-10">
                        TÜM <br /><span className="text-accent italic">MEKANLAR.</span>
                    </h1>
                    <p className="text-muted text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                        Evolution Ajans vizyonuyla şehrin en seçkin ve ikonik noktalarını tek bir listede keşfedin.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14">
                    {MOCK_RESTAURANTS.map((res) => (
                        <Link key={res.id} href={`/restaurant/${res.id}`} className="group relative">
                            <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-2 md:border-4 border-white/10 mb-6 shadow-2xl bg-card transition-all duration-700 group-hover:border-accent group-hover:shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                                <Image
                                    src={res.image}
                                    alt={res.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />

                                <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
                                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                                        <span className="px-4 py-1.5 md:px-5 md:py-2 bg-accent text-black text-[8px] md:text-[9px] font-black rounded-full uppercase tracking-widest">{res.category}</span>
                                    </div>
                                    <h3 className="font-display text-3xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter group-hover:text-accent transition-colors uppercase mb-4 md:mb-6">{res.name}</h3>

                                    <div className="flex flex-col gap-2 md:gap-3 border-t border-white/10 pt-4 md:pt-6">
                                        <div className="flex items-center gap-3 text-white/70 group-hover:text-white transition-colors">
                                            <span className="text-xs md:text-sm">📍</span>
                                            <span className="text-[11px] md:text-[13px] font-bold uppercase tracking-wider line-clamp-1">{res.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/90 group-hover:text-white transition-colors">
                                            <span className="text-xs md:text-sm">📞</span>
                                            <span className="text-[14px] md:text-[18px] font-black uppercase tracking-widest text-accent">{res.phone}</span>
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
            </div>
        </main>
    );
}
