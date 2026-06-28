"use client";

import { useState, useActionState } from "react";
import { updateRestaurantProfile } from "@/app/actions/restaurant";
import { createClient } from "@/utils/supabase/client";
import { compressImage } from "@/utils/image";

const CATEGORIES = ["Deniz Ürünleri", "Uzak Doğu", "İtalyan Mutfağı", "Steakhouse", "Fransız Mutfağı", "Geleneksel Türk", "Dünya Mutfağı"];
const FEATURES = ["Vale Park", "Dış Mekan", "Wi-Fi", "Alkol Servisi", "Teras", "Canlı Müzik", "VIP Oda"];

export default function RestaurantSettingsForm({ restaurant }: { restaurant: any }) {
    const [state, action, isPending] = useActionState(updateRestaurantProfile, null);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(restaurant.features || []);
    const [photos, setPhotos] = useState<string[]>(restaurant.photos || []);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [videos, setVideos] = useState<string[]>(restaurant.videos || []);
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
            const compressedBlob = await compressImage(file, 1200, 0.8);
            
            const fileExt = "jpg";
            const fileName = `${restaurant.id}/${Date.now()}.${fileExt}`;

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

        const MAX_SIZE = 30 * 1024 * 1024; // 30MB
        if (file.size > MAX_SIZE) {
            alert("Video boyutu en fazla 30MB olmalıdır.");
            return;
        }

        setUploadingVideo(true);
        try {
            const fileExt = file.name.split('.').pop() || 'mp4';
            const fileName = `${restaurant.id}/${Date.now()}.${fileExt}`;

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
        <form action={action} className="space-y-12">
            <input type="hidden" name="photosJson" value={JSON.stringify(photos)} />
            <input type="hidden" name="videosJson" value={JSON.stringify(videos)} />

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
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">İşletme Tanıtım Videoları</label>
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
                            <label key={f} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all cursor-pointer ${selectedFeatures.includes(f) ? "bg-white text-black border-white" : "bg-white/5 border-white/10 hover:border-white/20 text-zinc-300"}`}>
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
