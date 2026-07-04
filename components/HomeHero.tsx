"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SLIDER_IMAGES = [
    { image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop", title: "ZUMA BODRUM AÇILIYOR" },
    { image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop", title: "EŞSİZ LEZZET DENEYİMİ" }
];

const DISTRICTS = [
    "Bodrum Merkez",
    "Yalıkavak",
    "Göltürkbükü",
    "Gümüşlük",
    "Turgutreis",
    "Bitez",
    "Ortakent",
    "Gündoğan",
    "Torba"
];

export default function HomeHero({ title }: { title: string }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [district, setDistrict] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("query", searchQuery);
        if (district) params.set("district", district);
        router.push(`/restaurants?${params.toString()}`);
    };

    return (
        <section className="relative w-full h-screen overflow-hidden group">
            {SLIDER_IMAGES.map((slide, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
                    <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={index === 0} />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                </div>
            ))}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
                <div className="max-w-6xl w-full flex flex-col items-center text-center">
                    <h1 
                        className="font-display text-5xl md:text-9xl font-black tracking-tighter mb-12 uppercase leading-[0.8] text-white"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                    <form onSubmit={handleSearch} className="w-full max-w-5xl glass p-2 md:p-3 rounded-[2.5rem] md:rounded-[3rem] border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-2">
                        <div className="flex-[2] w-full relative flex items-center">
                            <span className="absolute left-6 text-lg">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Restoran veya mutfak ara..." 
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] pl-14 pr-6 py-5 md:py-6 outline-none focus:border-accent transition-all font-bold text-sm placeholder:text-white/20 text-white" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </div>
                        <div className="flex-1 w-full relative">
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] px-6 py-5 md:py-6 outline-none focus:border-accent transition-all font-bold text-sm text-white appearance-none cursor-pointer uppercase tracking-widest text-left"
                            >
                                <option value="" className="bg-neutral-950 text-white font-bold">Tüm Bölgeler</option>
                                {DISTRICTS.map(d => (
                                    <option key={d} value={d} className="bg-neutral-950 text-white font-bold">{d}</option>
                                ))}
                            </select>
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[10px]">▼</span>
                        </div>
                        <button type="submit" className="w-full md:w-auto px-12 py-5 md:py-6 bg-accent text-black font-black rounded-[1.5rem] md:rounded-[2rem] text-[10px] tracking-widest hover:bg-black hover:text-accent border-2 border-accent transition-all uppercase">BUL</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
