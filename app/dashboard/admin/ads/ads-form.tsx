"use client";

import { useState, useActionState } from "react";
import { updateAdByAdmin } from "@/app/actions/ads";
import { createClient } from "@/utils/supabase/client";
import { compressImage } from "@/utils/image";

interface Restaurant {
  id: string;
  name: string;
}

interface Ad {
  position: number;
  title: string;
  subtitle: string;
  image_url: string;
  restaurant_id: string | null;
}

export default function AdminAdForm({
  initialAd,
  restaurants
}: {
  initialAd: Ad;
  restaurants: Restaurant[];
}) {
    const [state, action, isPending] = useActionState(updateAdByAdmin, null);
    const [imageUrl, setImageUrl] = useState<string>(initialAd.image_url || "");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [supabase] = useState(() => createClient());

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            // İstemci tarafında görseli sıkıştır
            const compressedBlob = await compressImage(file, 1600, 0.7); // Reklam bannerı için genişliği 1600px yaptık
            
            const fileExt = "jpg";
            const fileName = `ads/banner_${initialAd.position}_${Date.now()}.${fileExt}`;

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

            const { data: { publicUrl } } = supabase.storage
                .from('restaurant-photos')
                .getPublicUrl(fileName);

            setImageUrl(publicUrl);
        } catch (err: any) {
            console.error("Reklam görsel yükleme hatası:", err);
            alert("Görsel yüklenirken bir hata oluştu: " + err.message);
        } finally {
            setImageUrl(prev => prev); // refresh state
            setUploadingImage(false);
        }
    };

    return (
        <form action={action} className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6">
            <input type="hidden" name="position" value={initialAd.position} />
            <input type="hidden" name="imageUrl" value={imageUrl} />

            {/* Slogan */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Ana Slogan (Büyük Yazı)</label>
                <input
                    name="title"
                    required
                    defaultValue={initialAd.title}
                    placeholder="Örn. BURADA YERİNİZİ"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Alt Slogan */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Alt Slogan (Alt Satır)</label>
                <input
                    name="subtitle"
                    defaultValue={initialAd.subtitle}
                    placeholder="Örn. ALIN"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Yönlendirilecek Restoran */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Tıklanınca Açılacak İşletme (Opsiyonel)</label>
                <select
                    name="restaurantId"
                    defaultValue={initialAd.restaurant_id || "null"}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white appearance-none cursor-pointer uppercase tracking-widest"
                >
                    <option value="null">Yönlendirme Yok (Varsayılan Kayıt Sayfası)</option>
                    {restaurants.map(rest => (
                        <option key={rest.id} value={rest.id}>{rest.name}</option>
                    ))}
                </select>
            </div>

            {/* Reklam Görseli */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Reklam Arka Plan Görseli</label>
                {imageUrl ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-white/5">
                        <img src={imageUrl} alt="Reklam Bannerı" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => setImageUrl("")}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg text-xs font-bold z-10"
                        >
                            ✕
                        </button>
                    </div>
                ) : uploadingImage ? (
                    <div className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center animate-pulse">
                        <span className="text-xl mb-2">⏳</span>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">GÖRSEL SIKIŞTIRILIYOR...</span>
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
                        <span className="text-[9px] font-black text-zinc-400 group-hover:text-accent uppercase tracking-widest">Görsel Seç & Sıkıştır</span>
                    </label>
                )}
            </div>

            {state?.success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center text-green-500 text-[10px] font-black uppercase italic tracking-widest">
                    Reklam Kaydedildi.
                </div>
            )}

            {state?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-500 text-[10px] font-black uppercase italic tracking-widest">
                    {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-accent hover:bg-white hover:text-black text-black font-black rounded-2xl text-[9px] tracking-widest uppercase transition-colors"
            >
                {isPending ? "KAYDEDİLİYOR..." : "REKLAMI KAYDET"}
            </button>
        </form>
    );
}
