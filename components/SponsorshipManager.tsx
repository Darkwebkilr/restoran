"use client";

import { useState, useEffect } from "react";
import { 
    toggleMarquee, 
    toggleFeaturedAd, 
    toggleDeliveryStatus, 
    toggleDeliveryAdStatus,
    toggleFeaturedStatus,
    toggleAdOnlyStatus
} from "@/app/actions/restaurant";
import { updateAdFrequency } from "@/app/actions/settings";
import { useRouter } from "next/navigation";
import AdminAdForm from "@/app/dashboard/admin/ads/ads-form";

interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
  show_in_marquee: boolean;
  is_featured: boolean;
  is_featured_ad: boolean;
  has_delivery: boolean;
  is_delivery_ad: boolean;
  is_ad_only: boolean;
  category?: string;
  district?: string;
}

interface Ad {
  position: number;
  title: string;
  subtitle: string;
  image_url: string;
  restaurant_id: string | null;
}

interface SponsorshipManagerProps {
  initialRestaurants: RestaurantInfo[];
  adsList: Ad[];
  currentFrequency: string;
}

export default function SponsorshipManager({ initialRestaurants, adsList, currentFrequency }: SponsorshipManagerProps) {
    const [restaurants, setRestaurants] = useState(initialRestaurants);
    const [activeTab, setActiveTab] = useState<"restaurants" | "banners">("restaurants");
    const [searchTerm, setSearchTerm] = useState("");
    
    // Toggling state tracker for loading spinner
    const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
    const [frequency, setFrequency] = useState(currentFrequency);
    const [savingFrequency, setSavingFrequency] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setRestaurants(initialRestaurants);
    }, [initialRestaurants]);

    const filtered = restaurants.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.district && r.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.category && r.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleToggle = async (id: string, field: "marquee" | "featured" | "featured_ad" | "delivery" | "delivery_ad" | "ad_only", currentValue: boolean) => {
        const actionKey = `${id}-${field}`;
        setLoadingIds(prev => ({ ...prev, [actionKey]: true }));
        
        // Optimistically/instantly update local state to reflect change in UI
        setRestaurants(prev => prev.map(r => {
            if (r.id === id) {
                const updated = { ...r };
                if (field === "marquee") updated.show_in_marquee = !currentValue;
                else if (field === "featured") updated.is_featured = !currentValue;
                else if (field === "featured_ad") updated.is_featured_ad = !currentValue;
                else if (field === "delivery") updated.has_delivery = !currentValue;
                else if (field === "ad_only") updated.is_ad_only = !currentValue;
                return updated;
            }
            return r;
        }));

        try {
            if (field === "marquee") await toggleMarquee(id, currentValue);
            else if (field === "featured") await toggleFeaturedStatus(id, currentValue);
            else if (field === "featured_ad") await toggleFeaturedAd(id, currentValue);
            else if (field === "delivery") await toggleDeliveryStatus(id, currentValue);
            else if (field === "delivery_ad") await toggleDeliveryAdStatus(id, currentValue);
            else if (field === "ad_only") await toggleAdOnlyStatus(id, currentValue);
            router.refresh();
        } catch (e: any) {
            console.error("Toggle error:", e);
            alert("İşlem başarısız oldu. Lütfen veritabanınızda ilgili sütunların tanımlandığından emin olun. Hata: " + e.message);
            // Revert state if error
            setRestaurants(initialRestaurants);
        } finally {
            setLoadingIds(prev => ({ ...prev, [actionKey]: false }));
        }
    };

    const handleFrequencyChange = async (newVal: string) => {
        setFrequency(newVal);
        setSavingFrequency(true);
        try {
            await updateAdFrequency(newVal);
            router.refresh();
        } catch (e: any) {
            console.error("Frequency update error:", e);
            alert("Sıklık ayarı güncellenemedi: " + e.message);
        } finally {
            setSavingFrequency(false);
        }
    };

    const ad1 = adsList.find(a => a.position === 1) || {
        position: 1,
        title: "BURADA YERİNİZİ",
        subtitle: "ALIN",
        image_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
        restaurant_id: null
    };

    const ad2 = adsList.find(a => a.position === 2) || {
        position: 2,
        title: "BURADA YERİNİZİ",
        subtitle: "ALIN",
        image_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
        restaurant_id: null
    };

    return (
        <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10 gap-6 pb-px">
                <button
                    onClick={() => setActiveTab("restaurants")}
                    className={`pb-4 text-xs font-black tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
                        activeTab === "restaurants" 
                            ? "border-accent text-accent" 
                            : "border-transparent text-zinc-400 hover:text-white"
                    }`}
                >
                    📋 Mekan Listeleme & Reklam Ayarları
                </button>
                <button
                    onClick={() => setActiveTab("banners")}
                    className={`pb-4 text-xs font-black tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
                        activeTab === "banners" 
                            ? "border-accent text-accent" 
                            : "border-transparent text-zinc-400 hover:text-white"
                    }`}
                >
                    🖼️ Sabit Reklam Afişleri & Sıklık Ayarları
                </button>
            </div>

            {activeTab === "restaurants" ? (
                <div className="space-y-6">


                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Mekan adı, kategori veya bölgeye göre ara..."
                            className="w-full bg-white/5 border-2 border-white/10 rounded-3xl px-8 py-5.5 outline-none focus:border-accent transition-all font-black text-base text-white placeholder:text-white/20 shadow-xl"
                        />
                    </div>

                    {/* Master List */}
                    <div className="grid grid-cols-1 gap-6">
                        {filtered.map((res) => (
                            <div 
                                key={res.id} 
                                className="glass p-6 md:p-8 rounded-[2.5rem] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                {/* Left Side: Details */}
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h4 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-white">{res.name}</h4>
                                        <span className="text-[11px] bg-white/10 border-2 border-white/20 px-4 py-1.5 rounded-full text-white font-black uppercase tracking-widest">
                                            {res.category || "Genel"}
                                        </span>
                                        {res.district && (
                                            <span className="text-[11px] bg-red-500/15 border-2 border-red-500/30 px-4 py-1.5 rounded-full text-white font-black uppercase tracking-widest">
                                                {res.district}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs md:text-sm text-zinc-400 font-black uppercase tracking-widest mt-3">
                                        {res.show_in_marquee ? "✓ Kayan Bant " : ""}
                                        {res.is_featured ? "✓ Seçkin Masalar " : ""}
                                        {res.has_delivery ? "✓ Paket Servis " : ""}
                                        
                                        {(!res.show_in_marquee && !res.is_featured && !res.has_delivery) && "Herhangi bir reklam/listeleme grubu aktif değil."}
                                    </p>
                                </div>

                                {/* Right Side: 3 Simple Toggles */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 lg:max-w-xl w-full md:w-auto">
                                    {/* 1. Seçkin Masa */}
                                    <button
                                        onClick={() => handleToggle(res.id, "featured", res.is_featured)}
                                        disabled={loadingIds[`${res.id}-featured`]}
                                        className={`px-4 py-4 rounded-[1.25rem] text-[11px] md:text-xs font-black tracking-widest uppercase transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 min-w-[120px] md:min-w-[140px] ${
                                            res.is_featured
                                                ? "bg-yellow-400 text-black border-[3px] border-yellow-400 hover:scale-105 shadow-lg font-black"
                                                : "bg-white/5 border-[3px] border-white/15 hover:bg-white/10 text-zinc-300"
                                        }`}
                                    >
                                        <span className="text-xs md:text-sm">{res.is_featured ? "🏆 Seçkin Masa" : "Seçkin Masa"}</span>
                                        <span className="text-[8px] md:text-[9px] opacity-75 font-bold tracking-wider">Anasayfa Vitrini</span>
                                    </button>

                                    {/* 2. Paket Servis */}
                                    <button
                                        onClick={() => handleToggle(res.id, "delivery", res.has_delivery)}
                                        disabled={loadingIds[`${res.id}-delivery`]}
                                        className={`px-4 py-4 rounded-[1.25rem] text-[11px] md:text-xs font-black tracking-widest uppercase transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 min-w-[120px] md:min-w-[140px] ${
                                            res.has_delivery
                                                ? "bg-yellow-400 text-black border-[3px] border-yellow-400 hover:scale-105 shadow-lg font-black"
                                                : "bg-white/5 border-[3px] border-white/15 hover:bg-white/10 text-zinc-300"
                                        }`}
                                    >
                                        <span className="text-xs md:text-sm">{res.has_delivery ? "🚀 Paket Servis" : "Paket Servis"}</span>
                                        <span className="text-[8px] md:text-[9px] opacity-75 font-bold tracking-wider">Paket Servis Grubu</span>
                                    </button>

                                    {/* 4. Kayan Yazılar */}
                                    <button
                                        onClick={() => handleToggle(res.id, "marquee", res.show_in_marquee)}
                                        disabled={loadingIds[`${res.id}-marquee`]}
                                        className={`px-4 py-4 rounded-[1.25rem] text-[11px] md:text-xs font-black tracking-widest uppercase transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 min-w-[120px] md:min-w-[140px] ${
                                            res.show_in_marquee
                                                ? "bg-yellow-400 text-black border-[3px] border-yellow-400 hover:scale-105 shadow-lg font-black"
                                                : "bg-white/5 border-[3px] border-white/15 hover:bg-white/10 text-zinc-300"
                                        }`}
                                    >
                                        <span className="text-xs md:text-sm">{res.show_in_marquee ? "✨ Kayan Yazı" : "Kayan Yazı"}</span>
                                        <span className="text-[8px] md:text-[9px] opacity-75 font-bold tracking-wider">En Üst Kayan Şerit</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="text-center py-20 bg-white/5 border border-white/10 border-dashed rounded-[2.5rem]">
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs italic">Kriterlere uygun mekan bulunamadı.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-12 animate-in fade-in duration-300">
                    {/* Frequency settings */}
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
                                disabled={savingFrequency}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer"
                            >
                                <option value="2" className="bg-neutral-950 text-white">Her 2 restoranda bir (1 Adet Sponsorlu)</option>
                                <option value="3" className="bg-neutral-950 text-white">Her 3 restoranda bir (1 Adet Sponsorlu)</option>
                                <option value="4" className="bg-neutral-950 text-white">Her 4 restoranda bir (1 Adet Sponsorlu)</option>
                                <option value="5" className="bg-neutral-950 text-white">Her 5 restoranda bir (1 Adet Sponsorlu)</option>
                                <option value="0" className="bg-neutral-950 text-white">Devre Dışı (Sponsorlu Mekan Gösterme)</option>
                            </select>
                            {savingFrequency && (
                                <span className="text-[10px] text-accent font-black uppercase tracking-widest animate-pulse shrink-0">
                                    KAYDEDİLİYOR...
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Static Banner Ads */}
                    <div>
                        <h3 className="font-display text-xl md:text-2xl font-black uppercase italic tracking-tight text-white mb-6">Sabit Reklam Afişleri (1. ve 2. Sıralar)</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-display text-xs font-black text-accent uppercase tracking-widest ml-1">1. Sıradaki Büyük Banner Reklamı</h4>
                                <AdminAdForm initialAd={ad1} restaurants={initialRestaurants} />
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-display text-xs font-black text-accent uppercase tracking-widest ml-1">2. Sıradaki Büyük Banner Reklamı</h4>
                                <AdminAdForm initialAd={ad2} restaurants={initialRestaurants} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
