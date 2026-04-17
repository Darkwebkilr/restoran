"use client";

import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
    { name: "Deniz Ürünleri", icon: "🐟", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop" },
    { name: "Uzak Doğu", icon: "🥢", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop" },
    { name: "İtalyan Mutfağı", icon: "🍝", image: "https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop" },
    { name: "Geleneksel", icon: "🥘", image: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=800&auto=format&fit=crop" },
    { name: "Steakhouse", icon: "🥩", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop" },
    { name: "Fransız Mutfağı", icon: "🥐", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop" },
    { name: "Akdeniz Mutfağı", icon: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop" },
    { name: "Sushi & Bar", icon: "🍣", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop" }
];

export default function CategoriesPage() {
    return (
        <main className="relative min-h-screen noise-overlay mesh-gradient pt-48 pb-32 px-6 flex flex-col items-center">
            <div className="max-w-7xl w-full">
                <div className="mb-24 text-center md:text-left">
                    <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-6 block">Gastronomi</span>
                    <h1 className="font-display text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-10">
                        MUTFAK <br /><span className="text-accent italic">KÜLTÜRLERİ.</span>
                    </h1>
                    <p className="text-muted text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                        Denizden gelen tazelikten, Uzak Doğu'nun gizemli baharatlarına kadar dünya mutfaklarını keşfedin.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.name} href={`/restaurants`} className="group relative">
                            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-card transition-all duration-700 hover:border-accent/30">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                                    <span className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">{cat.icon}</span>
                                    <h3 className="font-display text-4xl md:text-5xl font-black text-white text-center leading-none tracking-tighter group-hover:text-accent transition-colors uppercase italic">{cat.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
