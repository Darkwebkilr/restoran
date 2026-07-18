"use client";

import { useState } from "react";
import { toggleMarquee } from "@/app/actions/restaurant";
import { useRouter } from "next/navigation";

interface RestaurantMarqueeInfo {
  id: string;
  name: string;
  slug: string;
  show_in_marquee: boolean;
  category?: string;
  district?: string;
}

export default function MarqueeManager({ initialRestaurants }: { initialRestaurants: RestaurantMarqueeInfo[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const filtered = initialRestaurants.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.district && r.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.category && r.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleToggle = async (id: string, current: boolean) => {
        setLoadingId(id);
        try {
            await toggleMarquee(id, current);
            router.refresh();
        } catch (e: any) {
            console.error("Marquee toggle error:", e);
            alert("Kayan bant ayarı değiştirilemedi. Lütfen veritabanınızda 'show_in_marquee' kolonunun tanımlanmış olduğundan emin olun (Sorguyu çalıştırın). Hata: " + e.message);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mekan ara..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 outline-none focus:border-accent transition-all font-bold text-sm text-white placeholder:text-white/20 shadow-lg"
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm("")}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider"
                    >
                        Temizle
                    </button>
                )}
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white/5 border border-white/10 rounded-[2rem] text-zinc-500 font-bold uppercase tracking-wider text-xs italic">
                        Aradığınız kriterlere uygun mekan bulunamadı.
                    </div>
                ) : (
                    filtered.map((restaurant) => {
                        const isSelected = restaurant.show_in_marquee;
                        const isLoading = loadingId === restaurant.id;

                        return (
                            <div 
                                key={restaurant.id} 
                                className={`glass p-6 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between gap-6 ${
                                    isSelected 
                                        ? "border-accent/30 bg-accent/[0.02]" 
                                        : "border-white/10 hover:border-white/20"
                                }`}
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-display text-lg md:text-xl font-black uppercase italic tracking-tight text-white leading-tight">
                                            {restaurant.name}
                                        </h3>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shrink-0 ${
                                            isSelected 
                                                ? "bg-accent/10 text-accent border border-accent/20" 
                                                : "bg-white/5 text-zinc-500 border border-white/5"
                                        }`}>
                                            {isSelected ? "⭐ Kayan Bantta" : "Pasif"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {restaurant.category && (
                                            <span className="text-[8px] font-black uppercase tracking-wider bg-white/5 text-zinc-400 px-2.5 py-1 rounded-md border border-white/5">
                                                {restaurant.category}
                                            </span>
                                        )}
                                        {restaurant.district && (
                                            <span className="text-[8px] font-black uppercase tracking-wider bg-white/5 text-zinc-400 px-2.5 py-1 rounded-md border border-white/5">
                                                📍 {restaurant.district}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleToggle(restaurant.id, isSelected)}
                                    disabled={isLoading}
                                    className={`w-full py-3.5 rounded-xl font-black text-[9px] tracking-widest uppercase transition-all duration-300 italic flex items-center justify-center gap-2 ${
                                        isLoading
                                            ? "bg-white/5 text-zinc-500 cursor-not-allowed animate-pulse"
                                            : isSelected
                                                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
                                                : "bg-accent text-black hover:scale-[1.02] shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                                    }`}
                                >
                                    {isLoading ? (
                                        "GÜNCELLENİYOR..."
                                    ) : isSelected ? (
                                        <>✕ Banttan Çıkar</>
                                    ) : (
                                        <>⭐ Kayan Banda Ekle</>
                                    )}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
