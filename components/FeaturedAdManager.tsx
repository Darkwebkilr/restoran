"use client";

import { useState, useTransition } from "react";
import { toggleFeaturedAd } from "@/app/actions/restaurant";
import { updateAdFrequency } from "@/app/actions/settings";
import { useRouter } from "next/navigation";

interface RestaurantAdInfo {
  id: string;
  name: string;
  slug: string;
  is_featured_ad: boolean;
  category?: string;
  district?: string;
}

interface FeaturedAdManagerProps {
  initialRestaurants: RestaurantAdInfo[];
  currentFrequency: string;
}

export default function FeaturedAdManager({ initialRestaurants, currentFrequency }: FeaturedAdManagerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [frequency, setFrequency] = useState(currentFrequency);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const filtered = initialRestaurants.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.district && r.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.category && r.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleToggle = async (id: string, current: boolean) => {
        setLoadingId(id);
        try {
            await toggleFeaturedAd(id, current);
            router.refresh();
        } catch (e: any) {
            console.error("Ad toggle error:", e);
            alert("Sponsorlu mekan ayarı değiştirilemedi. Lütfen veritabanınızda 'is_featured_ad' kolonunun tanımlanmış olduğundan emin olun (Sorguyu çalıştırın). Hata: " + e.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleFrequencyChange = async (newVal: string) => {
        setFrequency(newVal);
        startTransition(async () => {
            try {
                await updateAdFrequency(newVal);
                router.refresh();
            } catch (e: any) {
                console.error("Frequency update error:", e);
                alert("Sıklık ayarı güncellenemedi: " + e.message);
            }
        });
    };

    return (
        <div className="space-y-12">
            {/* Frequency Setting */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 space-y-4">
                <div>
                    <h3 className="font-display text-lg md:text-xl font-black uppercase italic tracking-tight text-white">Sponsorlu Mekan Enjeksiyon Sıklığı</h3>
                    <p className="text-zinc-400 font-medium uppercase tracking-widest text-[9px] mt-1">
                        Seçkin Masalar listesinde kaç restoranda bir sponsorlu (reklam) mekan yerleştirileceğini seçin.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md pt-2">
                    <select
                        value={frequency}
                        onChange={(e) => handleFrequencyChange(e.target.value)}
                        disabled={isPending}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer"
                    >
                        <option value="2" className="bg-neutral-950 text-white">Her 2 restoranda bir (1 Adet Sponsorlu)</option>
                        <option value="3" className="bg-neutral-950 text-white">Her 3 restoranda bir (1 Adet Sponsorlu)</option>
                        <option value="4" className="bg-neutral-950 text-white">Her 4 restoranda bir (1 Adet Sponsorlu)</option>
                        <option value="5" className="bg-neutral-950 text-white">Her 5 restoranda bir (1 Adet Sponsorlu)</option>
                        <option value="0" className="bg-neutral-950 text-white">Devre Dışı (Sponsorlu Mekan Gösterme)</option>
                    </select>
                    {isPending && (
                        <span className="text-[10px] text-accent font-black uppercase tracking-widest animate-pulse shrink-0">
                            KAYDEDİLİYOR...
                        </span>
                    )}
                </div>
            </div>

            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mekan adı, kategori veya bölgeye göre ara..."
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
                        const isSelected = restaurant.is_featured_ad;
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
                                            {isSelected ? "★ Sponsorlu" : "Pasif"}
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
                                        <>✕ Sponsorluğu Kaldır</>
                                    ) : (
                                        <>★ Sponsorlu Yap</>
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
