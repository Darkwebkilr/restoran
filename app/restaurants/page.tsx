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
    {
        id: "4",
        name: "Nusr-Et Steakhouse",
        category: "Steakhouse",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
        location: "Yalıkavak Marina",
    },
    {
        id: "5",
        name: "Mikla",
        category: "Yeni Anadolu",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
        location: "Beyoğlu",
    },
    {
        id: "6",
        name: "Paper Moon",
        category: "İtalyan",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop",
        location: "Bodrum",
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
                        Evolution Ajans kürasyonuyla şehrin en seçkin ve ikonik noktalarını tek bir listede keşfedin.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
                    {MOCK_RESTAURANTS.map((res) => (
                        <Link key={res.id} href={`/restaurant/${res.id}`} className="group relative">
                            <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-white/10 mb-10 shadow-2xl bg-card transition-all duration-700 hover:border-accent/30">
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
                                        <span className="px-5 py-2 glass text-white text-[9px] font-black rounded-full uppercase tracking-widest border border-white/10">{res.location}</span>
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
            </div>
        </main>
    );
}
