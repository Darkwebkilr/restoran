"use client";

import { useState, useActionState } from "react";
import { updateSettingsByAdmin } from "@/app/actions/settings";
import { createClient } from "@/utils/supabase/client";

interface Settings {
  hero_title: string;
  categories_title: string;
  featured_title: string;
  how_it_works_title: string;
  marquee_text: string;
  site_logo_url: string;
  social_facebook: string;
  social_instagram: string;
  social_x: string;
  social_tiktok: string;
  social_telegram: string;
  whatsapp_number: string;
}

interface RestaurantMarqueeInfo {
  id: string;
  name: string;
  show_in_marquee: boolean;
}

export default function AdminSettingsForm({
  initialSettings,
  allRestaurants = []
}: {
  initialSettings: Settings;
  allRestaurants?: RestaurantMarqueeInfo[];
}) {
    const [state, action, isPending] = useActionState(updateSettingsByAdmin, null);
    const [logoUrl, setLogoUrl] = useState(initialSettings.site_logo_url || "");
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [selectedMarqueeIds, setSelectedMarqueeIds] = useState<string[]>(
        allRestaurants.filter(r => r.show_in_marquee).map(r => r.id)
    );
    const [supabase] = useState(() => createClient());

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingLogo(true);
        try {
            // Benzersiz dosya ismi oluştur
            const fileExt = file.name.split('.').pop() || 'png';
            const fileName = `site_assets/logo_${Date.now()}.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from('restaurant-photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                throw new Error(uploadError.message);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('restaurant-photos')
                .getPublicUrl(fileName);

            setLogoUrl(publicUrl);
        } catch (err: any) {
            console.error("Logo yükleme hatası:", err);
            alert("Logo yüklenirken bir hata oluştu: " + err.message);
        } finally {
            setUploadingLogo(false);
        }
    };

    return (
        <form action={action} className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
            
            {/* Hero Sloganı */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Hero Alanı Sloganı (Girişteki Büyük Yazı)</label>
                <textarea
                    name="hero_title"
                    required
                    defaultValue={initialSettings.hero_title}
                    placeholder="Örn. BODRUMUN EN İYİ MASALARI."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider ml-1">Satır kesmesi yapmak için metin içerisine &lt;br /&gt; yazabilirsiniz.</p>
            </div>

            {/* Marquee Metni */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Orta Kayar Metin (Haber Bandu)</label>
                <input
                    name="marquee_text"
                    required
                    defaultValue={initialSettings.marquee_text}
                    placeholder="Metinleri aralarına • koyarak girin."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Üst Kayan Bant Restoranları */}
            <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1 block">Üst Kayan Bant Restoranları</label>
                <input type="hidden" name="marquee_restaurant_ids" value={JSON.stringify(selectedMarqueeIds)} />
                {allRestaurants.length === 0 ? (
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-wider ml-1">Kayıtlı onaylı restoran bulunamadı.</p>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-h-60 overflow-y-auto space-y-3">
                        <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider mb-2">Üst kayan bantta gösterilmesini istediğiniz mekanları seçin:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {allRestaurants.map(r => {
                                const isChecked = selectedMarqueeIds.includes(r.id);
                                return (
                                    <label key={r.id} className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all cursor-pointer ${
                                        isChecked 
                                            ? "bg-white/10 border-accent text-accent" 
                                            : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/10"
                                    }`}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedMarqueeIds([...selectedMarqueeIds, r.id]);
                                                } else {
                                                    setSelectedMarqueeIds(selectedMarqueeIds.filter(id => id !== r.id));
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-white/10 bg-black text-accent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                        />
                                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{r.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Kategoriler Başlığı */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Öne Çıkan Kategoriler Başlığı</label>
                <input
                    name="categories_title"
                    required
                    defaultValue={initialSettings.categories_title}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Seçkin Masalar Başlığı */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Seçkin Masalar Başlığı</label>
                <input
                    name="featured_title"
                    required
                    defaultValue={initialSettings.featured_title}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Sistem Nasıl İşler Başlığı */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Sistem Nasıl İşler Başlığı</label>
                <input
                    name="how_it_works_title"
                    required
                    defaultValue={initialSettings.how_it_works_title}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                />
            </div>

            {/* Site Logosu */}
            <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Site Logosu</label>
                <input type="hidden" name="site_logo_url" value={logoUrl} />
                <div className="flex items-center gap-6">
                    {logoUrl ? (
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center p-2">
                            <img src={logoUrl} alt="Site Logo" className="max-w-full max-h-full object-contain animate-in fade-in" />
                            <button
                                type="button"
                                onClick={() => setLogoUrl("")}
                                className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg text-[10px] font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        uploadingLogo ? (
                            <div className="w-24 h-24 bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center animate-pulse">
                                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">YÜKLENİYOR...</span>
                            </div>
                        ) : (
                            <label className="w-24 h-24 bg-white/5 border border-dashed border-white/10 hover:border-accent/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/[0.08] group">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleLogoUpload} 
                                    className="hidden" 
                                />
                                <span className="text-xl mb-1 text-zinc-400 group-hover:text-accent group-hover:scale-110 transition-all">+</span>
                                <span className="text-[8px] font-black text-zinc-400 group-hover:text-accent uppercase tracking-widest text-center px-1">Logo Yükle</span>
                            </label>
                        )
                    )}
                    <div className="flex-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                        Site logosunu buradan yükleyebilirsiniz. Yüklenen logo başlık alanında ve alt bilgide gösterilecektir.
                    </div>
                </div>
            </div>

            {/* Sosyal Medya Linkleri */}
            <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1 block">Sosyal Medya Linkleri</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">Instagram</span>
                        <input
                            type="text"
                            name="social_instagram"
                            defaultValue={initialSettings.social_instagram}
                            placeholder="https://instagram.com/kullaniciadi"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">X (Twitter)</span>
                        <input
                            type="text"
                            name="social_x"
                            defaultValue={initialSettings.social_x}
                            placeholder="https://x.com/kullaniciadi"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">TikTok</span>
                        <input
                            type="text"
                            name="social_tiktok"
                            defaultValue={initialSettings.social_tiktok}
                            placeholder="https://tiktok.com/@kullaniciadi"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">Telegram</span>
                        <input
                            type="text"
                            name="social_telegram"
                            defaultValue={initialSettings.social_telegram}
                            placeholder="https://t.me/kanaladi"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">Facebook</span>
                        <input
                            type="text"
                            name="social_facebook"
                            defaultValue={initialSettings.social_facebook}
                            placeholder="https://facebook.com/sayfaadi"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                        />
                    </div>
                </div>
            </div>

            {/* İletişim & WhatsApp */}
            <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1 block">İletişim & WhatsApp Numarası</label>
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">WhatsApp Numarası (Ülke kodu ile, örn: 905321234567)</span>
                    <input
                        type="text"
                        name="whatsapp_number"
                        defaultValue={initialSettings.whatsapp_number}
                        placeholder="905321234567"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold text-sm text-white"
                    />
                </div>
            </div>

            {state?.success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center text-green-500 text-[10px] font-black uppercase italic tracking-widest animate-pulse">
                    Ayarlar Başarıyla Güncellendi!
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
                className="w-full py-5 bg-accent hover:bg-white hover:text-black text-black font-black rounded-2xl text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
            >
                {isPending ? "KAYDEDİLİYOR..." : "TÜM AYARLARI KAYDET"}
            </button>
        </form>
    );
}
