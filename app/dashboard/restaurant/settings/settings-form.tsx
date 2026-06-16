"use client";

import { useState, useActionState } from "react";
import { updateRestaurantProfile } from "@/app/actions/restaurant";

const CATEGORIES = ["İtalyan", "Japon", "Fransız", "Steakhouse", "Uzak Doğu", "Deniz Ürünleri", "Dünya Mutfağı"];
const FEATURES = ["Vale Park", "Dış Mekan", "Wi-Fi", "Alkol Servisi", "Teras", "Canlı Müzik", "VIP Oda"];

export default function RestaurantSettingsForm({ restaurant }: { restaurant: any }) {
    const [state, action, isPending] = useActionState(updateRestaurantProfile, null);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(restaurant.features || []);

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    return (
        <form action={action} className="space-y-12">
            {/* Status Banner */}
            {restaurant.status !== 'approved' && (
                <div className="glass p-8 rounded-[2.5rem] border-2 border-accent/20 bg-accent/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
                    <div>
                        <h4 className="font-display text-xl font-black text-accent uppercase italic mb-1">Başvuru Durumu: Beklemede</h4>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">İşletme bilgileriniz güncel olduğunda onay için kontrol edilecektir.</p>
                    </div>
                    <button 
                        type="submit"
                        disabled={isPending}
                        className="px-10 py-4 bg-accent text-black font-black rounded-2xl text-[10px] tracking-[0.2em] uppercase hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                    >
                        {isPending ? "GÖNDERİLİYOR..." : "ONAY İÇİN BAŞVUR"}
                    </button>
                </div>
            )}

            <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
                {/* Temel Bilgiler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme Adı</label>
                        <input name="name" defaultValue={restaurant.name} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Mutfak Türü</label>
                        <select name="category" defaultValue={restaurant.category} className="w-full bg-card border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white appearance-none cursor-pointer uppercase tracking-widest">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Hakkında / Hikayeniz</label>
                    <textarea name="description" defaultValue={restaurant.description} rows={4} required className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 outline-none focus:border-accent transition-all font-medium text-sm text-white leading-relaxed" placeholder="Müşterilerinize işletmenizi en iyi şekilde anlatın..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Lokasyon / Adres</label>
                        <input name="address" defaultValue={restaurant.address} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İletişim Numarası</label>
                        <input name="phone" defaultValue={restaurant.phone} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white" />
                    </div>
                </div>

                {/* Özellikler */}
                <div className="space-y-6 pt-4 border-t border-white/5">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Sunulan Olanaklar</label>
                    <div className="flex flex-wrap gap-3">
                        {FEATURES.map(f => (
                            <label key={f} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer ${selectedFeatures.includes(f) ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:border-white/20 text-white/40"}`}>
                                <input 
                                    type="checkbox" 
                                    name="features" 
                                    value={f} 
                                    checked={selectedFeatures.includes(f)} 
                                    onChange={() => toggleFeature(f)}
                                    className="hidden" 
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest">{f}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {state?.success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center text-green-500 text-[10px] font-black uppercase italic tracking-widest animate-in slide-in-from-top-4">PROFİLİNİZ BAŞARIYLA GÜNCELLENDİ</div>
            )}

            {state?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-red-500 text-[10px] font-black uppercase italic tracking-widest">{state.error}</div>
            )}

            <div className="flex justify-end pt-4">
                <button 
                    type="submit" 
                    disabled={isPending}
                    className="px-20 py-6 bg-accent text-black font-black rounded-[1.5rem] text-[11px] tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-[0_0_50px_rgba(245,158,11,0.2)] disabled:opacity-50"
                >
                    {isPending ? "KAYDEDİLİYOR..." : "BİLGİLERİ KAYDET"}
                </button>
            </div>
        </form>
    );
}
