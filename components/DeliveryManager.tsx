"use client";

import { useState } from "react";
import { toggleDeliveryStatus, toggleDeliveryAdStatus } from "@/app/actions/restaurant";
import { useRouter } from "next/navigation";

interface RestaurantDeliveryInfo {
  id: string;
  name: string;
  slug: string;
  has_delivery: boolean;
  is_delivery_ad: boolean;
  category?: string;
  district?: string;
}

interface DeliveryManagerProps {
  initialRestaurants: RestaurantDeliveryInfo[];
}

export default function DeliveryManager({ initialRestaurants }: DeliveryManagerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [loadingAdId, setLoadingAdId] = useState<string | null>(null);
    const router = useRouter();

    const filtered = initialRestaurants.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.district && r.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.category && r.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleToggleDelivery = async (id: string, current: boolean) => {
        setLoadingId(id);
        try {
            await toggleDeliveryStatus(id, current);
            router.refresh();
        } catch (e: any) {
            console.error("Delivery toggle error:", e);
            alert("Paket servis ayarı değiştirilemedi. Lütfen veritabanınızda 'has_delivery' kolonunun tanımlanmış olduğundan emin olun (Sorguyu çalıştırın). Hata: " + e.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleToggleDeliveryAd = async (id: string, current: boolean) => {
        setLoadingAdId(id);
        try {
            await toggleDeliveryAdStatus(id, current);
            router.refresh();
        } catch (e: any) {
            console.error("Delivery ad toggle error:", e);
            alert("Paket servis sponsorluk ayarı değiştirilemedi. Lütfen veritabanınızda 'is_delivery_ad' kolonunun tanımlanmış olduğundan emin olun (Sorguyu çalıştırın). Hata: " + e.message);
        } finally {
            setLoadingAdId(null);
        }
    };

    return (
        <div className="space-y-12">
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mekan adı, kategori veya bölgeye göre ara..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 outline-none focus:border-accent transition-all font-bold text-sm text-white placeholder:text-white/20 shadow-lg"
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filtered.map((res) => (
                    <div 
                        key={res.id} 
                        className={`glass p-6 rounded-[2rem] border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                            res.has_delivery 
                                ? "border-accent/30 bg-accent/[0.02]" 
                                : "border-white/10"
                        }`}
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h4 className="font-display text-lg font-black uppercase tracking-tight text-white">{res.name}</h4>
                                <span className="text-[8px] bg-white/5 px-2.5 py-1 rounded-full text-zinc-400 font-bold uppercase tracking-widest">
                                    {res.category || "Genel"}
                                </span>
                                {res.district && (
                                    <span className="text-[8px] bg-red-500/10 px-2.5 py-1 rounded-full text-red-400 font-bold uppercase tracking-widest">
                                        {res.district}
                                    </span>
                                )}
                            </div>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                {res.has_delivery 
                                    ? "Paket servis veren mekanlar arasında listeleniyor" 
                                    : "Paket servis listesinde yer almıyor"}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto shrink-0">
                            {/* Toggle 1: Paket Serviste Göster */}
                            <button
                                onClick={() => handleToggleDelivery(res.id, res.has_delivery)}
                                disabled={loadingId === res.id}
                                className={`px-6 py-3.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex-1 sm:flex-initial text-center cursor-pointer ${
                                    res.has_delivery
                                        ? "bg-accent text-black hover:scale-105 shadow-lg"
                                        : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                                }`}
                            >
                                {loadingId === res.id ? "İŞLENİYOR..." : (res.has_delivery ? "✓ PAKET SERVİSTE" : "+ PAKET SERVİSE EKLE")}
                            </button>

                            {/* Toggle 2: Sponsorlu Yap */}
                            <button
                                onClick={() => handleToggleDeliveryAd(res.id, res.is_delivery_ad)}
                                disabled={loadingAdId === res.id}
                                className={`px-6 py-3.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex-1 sm:flex-initial text-center cursor-pointer ${
                                    res.is_delivery_ad
                                        ? "bg-yellow-500 text-black hover:scale-105 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                                        : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                                }`}
                            >
                                {loadingAdId === res.id ? "İŞLENİYOR..." : (res.is_delivery_ad ? "★ SPONSORLU (AKTİF)" : "★ SPONSORLU YAP")}
                            </button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-20 bg-white/5 border border-white/10 border-dashed rounded-[2.5rem]">
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs italic">Kriterlere uygun restoran bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
