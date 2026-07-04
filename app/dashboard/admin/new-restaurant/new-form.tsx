"use client";

import { useState, useActionState } from "react";
import { createRestaurantByAdmin } from "@/app/actions/restaurant";
import { createClient } from "@/utils/supabase/client";
import { compressImage } from "@/utils/image";
import { Eye, EyeOff } from "lucide-react";

const CATEGORIES = ["Deniz Ürünleri", "Uzak Doğu", "İtalyan Mutfağı", "Steakhouse", "Fransız Mutfağı", "Geleneksel Türk", "Dünya Mutfağı"];
const FEATURES = ["Vale Park", "Dış Mekan", "Wi-Fi", "Alkol Servisi", "Teras", "Canlı Müzik", "VIP Oda"];
const STATUSES = [
  { value: "approved", label: "ONAYLI (APPROVED) - Hemen Yayınla", color: "text-green-500 bg-green-500/10 border-green-500/20" },
  { value: "pending", label: "BEKLEMEDE (PENDING)", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  { value: "rejected", label: "REDDEDİLDİ (REJECTED)", color: "text-red-500 bg-red-500/10 border-red-500/20" }
];

export default function AdminRestaurantNewForm() {
    const [state, action, isPending] = useActionState(createRestaurantByAdmin, null);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [videos, setVideos] = useState<string[]>([]);
    const [uploadingVideo, setUploadingVideo] = useState(false);
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
            
            // Benzersiz dosya yolu oluştur (Geçici/Rastgele klasör ismi olacak şekilde)
            const fileExt = "jpg";
            const fileName = `manual_admin/${Date.now()}.${fileExt}`;

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

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Video boyutu sınırı (maksimum 30MB)
        const MAX_SIZE = 30 * 1024 * 1024; // 30MB
        if (file.size > MAX_SIZE) {
            alert("Video boyutu en fazla 30MB olmalıdır.");
            return;
        }

        setUploadingVideo(true);
        try {
            const fileExt = file.name.split('.').pop() || 'mp4';
            const fileName = `manual_admin/${Date.now()}.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from('restaurant-photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: file.type || 'video/mp4'
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

            setVideos(prev => [...prev, publicUrl]);
        } catch (err: any) {
            console.error("Video yükleme hatası:", err);
            alert("Video yüklenirken bir hata oluştu: " + err.message);
        } finally {
            setUploadingVideo(false);
        }
    };

    const removeVideo = (videoUrl: string) => {
        setVideos(videos.filter(v => v !== videoUrl));
    };

    return (
        <form action={action} className="space-y-10">
            <input type="hidden" name="photosJson" value={JSON.stringify(photos)} />
            <input type="hidden" name="videosJson" value={JSON.stringify(videos)} />

            <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
                
                {/* Giriş Bilgileri (Hesap Oluşturma) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-white/5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme E-postası</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="isletme@restoran.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white placeholder:text-white/20"
                        />
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider ml-1 mt-1">
                          Restoran sahibinin panele giriş yapacağı e-posta adresi.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme Şifresi</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-12 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white placeholder:text-white/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider ml-1 mt-1">
                          En az 6 karakter olmalıdır.
                        </p>
                    </div>
                </div>

                <input type="hidden" name="status" value="approved" />

                {/* Temel Bilgiler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme Adı</label>
                        <input
                            name="name"
                            required
                            placeholder="Örn. Zuma İstanbul"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Mutfak Türü</label>
                        <select
                            name="category"
                            defaultValue="Dünya Mutfağı"
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
                        rows={4}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 outline-none focus:border-accent transition-all font-medium text-sm text-white leading-relaxed"
                        placeholder="İşletmenin konseptini, hikayesini ve sunduğu hizmetleri yazın..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Harita Konum Linki</label>
                        <input
                            type="url"
                            name="address"
                            required
                            placeholder="https://maps.app.goo.gl/..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white placeholder:text-white/20"
                        />
                        <p className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider ml-1 mt-1">
                          Haritalar paylaşım linki.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Bölge (İlçe)</label>
                        <select
                            name="district"
                            defaultValue=""
                            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white appearance-none cursor-pointer uppercase tracking-widest"
                        >
                            <option value="">Bölge Seçilmedi</option>
                            {["Bodrum Merkez", "Yalıkavak", "Göltürkbükü", "Gümüşlük", "Turgutreis", "Bitez", "Ortakent", "Gündoğan", "Torba"].map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Telefon Numarası</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+90 532 000 00 00"
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

                {/* Videolar Galeri Yönetimi */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Tanıtım Videoları</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {videos.map((url, index) => (
                            <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-white/5">
                                <video src={url} controls className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeVideo(url)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg text-xs font-bold z-10"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {uploadingVideo ? (
                            <div className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center animate-pulse">
                                <span className="text-xl mb-2">⏳</span>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">YÜKLENİYOR...</span>
                            </div>
                        ) : (
                            <label className="aspect-video bg-white/5 border border-dashed border-white/10 hover:border-accent/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/[0.08] group">
                                <input 
                                    type="file" 
                                    accept="video/*" 
                                    onChange={handleVideoUpload} 
                                    className="hidden" 
                                />
                                <span className="text-2xl mb-1 text-zinc-400 group-hover:text-accent group-hover:scale-110 transition-all">+</span>
                                <span className="text-[9px] font-black text-zinc-400 group-hover:text-accent uppercase tracking-widest">Video Yükle</span>
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
                    İşletme ve Sahibi Başarıyla Oluşturuldu
                </div>
            )}

            {state?.error && (
                <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-red-500 text-[10px] font-black uppercase italic tracking-widest">
                    {state.error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
                <button
                    type="submit"
                    name="actionType"
                    value="create_featured"
                    disabled={isPending}
                    className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl text-[10px] tracking-widest uppercase hover:scale-105 transition-all disabled:opacity-50 italic border-2 border-white"
                >
                    {isPending ? "İŞLENİYOR..." : "⭐ ÖNE ÇIKARILANLARA EKLE VE KAYDET"}
                </button>
                <button
                    type="submit"
                    name="actionType"
                    value="create"
                    disabled={isPending}
                    className="w-full sm:w-auto px-12 py-5 bg-accent text-black font-black rounded-2xl text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] disabled:opacity-50 italic border-2 border-accent"
                >
                    {isPending ? "KAYDEDİLİYOR..." : "İŞLETMEYİ OLUŞTUR"}
                </button>
            </div>
        </form>
    );
}
