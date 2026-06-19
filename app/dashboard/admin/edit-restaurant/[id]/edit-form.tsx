"use client";

import { useState, useActionState } from "react";
import { updateRestaurantByAdmin } from "@/app/actions/restaurant";
import { createClient } from "@/utils/supabase/client";
import { compressImage } from "@/utils/image";

const CATEGORIES = ["İtalyan", "Japon", "Fransız", "Steakhouse", "Uzak Doğu", "Deniz Ürünleri", "Dünya Mutfağı"];
const FEATURES = ["Vale Park", "Dış Mekan", "Wi-Fi", "Alkol Servisi", "Teras", "Canlı Müzik", "VIP Oda"];
const STATUSES = [
  { value: "pending", label: "BEKLEMEDE (PENDING)", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  { value: "approved", label: "ONAYLI (APPROVED)", color: "text-green-500 bg-green-500/10 border-green-500/20" },
  { value: "rejected", label: "REDDEDİLDİ (REJECTED)", color: "text-red-500 bg-red-500/10 border-red-500/20" }
];

export default function AdminRestaurantEditForm({ restaurant }: { restaurant: any }) {
    const [state, action, isPending] = useActionState(updateRestaurantByAdmin, null);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(restaurant.features || []);
    const [status, setStatus] = useState<string>(restaurant.status || "pending");
    const [photos, setPhotos] = useState<string[]>(restaurant.photos || []);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [supabase] = useState(() => createClient());

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            // Görseli istemci tarafında sıkıştır (1200px genişlik limiti, 0.8 kalite)
            const compressedBlob = await compressImage(file, 1200, 0.8);
            
            // Benzersiz dosya yolu oluştur (Restoran sahibi id'si alt klasör olacak şekilde)
            const fileExt = "jpg"; // Sıkıştırdıktan sonra JPEG formatına dönüyor
            const fileName = `${restaurant.id}/${Date.now()}.${fileExt}`;

            // Supabase Storage 'restaurant-photos' bucket'ına yükle
            const { data, error: uploadError } = await supabase.storage
                .from('restaurant-photos')
                .upload(fileName, compressedBlob, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: 'image/jpeg'
                });

            if (uploadError) {
                throw new Error(uploadError.message.includes("not found") 
                    ? "restaurant-photos isimli Storage Bucket bulunamadı. Lütfen Supabase panelinizden bu isimde PUBLIC bir bucket oluşturun."
                    : uploadError.message
                );
            }

            // Görselin genel erişim linkini (Public URL) al
            const { data: { publicUrl } } = supabase.storage
                .from('restaurant-photos')
                .getPublicUrl(fileName);

            setPhotos(prev => [...prev, publicUrl]);
        } catch (err: any) {
            console.error("Görsel yükleme hatası:", err);
            alert("Görsel yüklenirken bir hata oluştu: " + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const removePhoto = (photoUrl: string) => {
        setPhotos(photos.filter(p => p !== photoUrl));
    };

    return (
        <form action={action} className="space-y-10">
            <input type="hidden" name="restaurantId" value={restaurant.id} />
            <input type="hidden" name="photosJson" value={JSON.stringify(photos)} />

            <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
                
                {/* Durum Yönetimi */}
                <div className="space-y-3 pb-6 border-b border-white/5">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme Durumu</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {STATUSES.map((item) => (
                            <label
                                key={item.value}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all cursor-pointer ${
                                    status === item.value
                                        ? `${item.color} font-black border-2 scale-[1.02] shadow-lg`
                                        : "bg-white/5 border-white/10 hover:border-white/20 text-white/50"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value={item.value}
                                    checked={status === item.value}
                                    onChange={() => setStatus(item.value)}
                                    className="hidden"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Temel Bilgiler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme Adı</label>
                        <input
                            name="name"
                            defaultValue={restaurant.name}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Mutfak Türü</label>
                        <select
                            name="category"
                            defaultValue={restaurant.category}
                            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white appearance-none cursor-pointer uppercase tracking-widest"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme Açıklaması</label>
                    <textarea
                        name="description"
                        defaultValue={restaurant.description}
                        rows={4}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 outline-none focus:border-accent transition-all font-medium text-sm text-white leading-relaxed"
                        placeholder="İşletme detaylarını girin..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Adres / Konum</label>
                        <input
                            name="address"
                            defaultValue={restaurant.address}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Telefon Numarası</label>
                        <input
                            name="phone"
                            defaultValue={restaurant.phone}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                </div>

                {/* Fotoğraflar Galeri Yönetimi */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme Fotoğrafları</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {photos.map((url, index) => (
                            <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-white/5">
                                <img src={url} alt={`Restoran Fotoğrafı ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(url)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg text-xs font-bold z-10"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {uploadingImage ? (
                            <div className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center animate-pulse">
                                <span className="text-xl mb-2">⏳</span>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">YÜKLENİYOR...</span>
                            </div>
                        ) : (
                            <label className="aspect-video bg-white/5 border border-dashed border-white/10 hover:border-accent/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/[0.08] group">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    className="hidden" 
                                />
                                <span className="text-2xl mb-1 text-zinc-400 group-hover:text-accent group-hover:scale-110 transition-all">+</span>
                                <span className="text-[9px] font-black text-zinc-400 group-hover:text-accent uppercase tracking-widest">Görsel Yükle</span>
                            </label>
                        )}
                    </div>
                </div>

                {/* Özellikler */}
                <div className="space-y-6 pt-4 border-t border-white/5">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Sunulan Olanaklar</label>
                    <div className="flex flex-wrap gap-3">
                        {FEATURES.map(f => (
                            <label
                                key={f}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer ${
                                    selectedFeatures.includes(f)
                                        ? "bg-white text-black border-white font-black"
                                        : "bg-white/5 border-white/10 hover:border-white/20 text-white/40"
                                }`}
                            >
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
                <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-center text-green-500 text-[10px] font-black uppercase italic tracking-widest animate-in slide-in-from-top-4">
                    İşletme Bilgileri Başarıyla Güncellendi
                </div>
            )}

            {state?.error && (
                <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-red-500 text-[10px] font-black uppercase italic tracking-widest">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-16 py-5 bg-accent text-black font-black rounded-2xl text-[10px] tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] disabled:opacity-50 italic"
                >
                    {isPending ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}
                </button>
            </div>
        </form>
    );
}
