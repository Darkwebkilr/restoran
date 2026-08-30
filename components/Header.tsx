"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { SiInstagram, SiFacebook, SiX, SiTiktok, SiTelegram } from '@icons-pack/react-simple-icons';
import { signout } from "@/app/actions/auth";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [siteLogo, setSiteLogo] = useState("");
    const [socials, setSocials] = useState({
        facebook: "#",
        instagram: "#",
        x: "#",
        tiktok: "#",
        telegram: "#"
    });
    const [whatsappNumber, setWhatsappNumber] = useState("");

    // Supabase client referansının her renderda yeniden oluşturulmasını engellemek için useState kullanıyoruz
    const [supabase] = useState(() => createClient());
    const router = useRouter();
    const pathname = usePathname();

    const checkUser = useCallback(async () => {
        try {
            // getSession client tarafında çok daha hızlı ve kararlıdır
            const { data: { session } } = await supabase.auth.getSession();
            console.log("[AuthDebug] checkUser - session:", session);
            if (session?.user) {
                setUser(session.user);
                
                // 1. Metadata rolü varsa anında arayüze yansıt ve yüklemeyi kapat
                const initialRole = session.user.user_metadata?.role || 'customer';
                setRole(initialRole);
                setLoading(false);

                // 2. Arka planda veritabanından güncel rolü sorgula
                (async () => {
                    try {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('role')
                            .eq('id', session.user.id)
                            .maybeSingle();
                        if (profile?.role) {
                            setRole(profile.role);
                        }
                    } catch (bgErr) {
                        console.error("[AuthDebug] Arka plan rol check hatası:", bgErr);
                    }
                })();
            } else {
                setUser(null);
                setRole(null);
                setLoading(false);
            }
        } catch (err) {
            console.error("Auth check hatası:", err);
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        setMounted(true);
        checkUser();

        const fetchSettings = async () => {
            try {
                const { data } = await supabase.from("settings").select("*");
                if (data) {
                    const getVal = (key: string, fallback: string) => data.find(s => s.key === key)?.value || fallback;
                    setSiteLogo(getVal("site_logo_url", ""));
                    setWhatsappNumber(getVal("whatsapp_number", ""));
                    setSocials({
                        facebook: getVal("social_facebook", "#"),
                        instagram: getVal("social_instagram", "#"),
                        x: getVal("social_x", "#"),
                        tiktok: getVal("social_tiktok", "#"),
                        telegram: getVal("social_telegram", "#")
                    });
                }
            } catch (err) {
                console.error("Error fetching settings in header mount:", err);
            }
        };
        fetchSettings();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("[AuthDebug] onAuthStateChange - event:", event, "session:", session);
            
            // Tüm event tipleri için (INITIAL_SESSION dahil) UI durumunu anında güncelle
            if (session?.user) {
                setUser(session.user);
                const initialRole = session.user.user_metadata?.role || 'customer';
                setRole(initialRole);
                setLoading(false);

                // Arka planda veritabanından en güncel rolü kontrol et
                (async () => {
                    try {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('role')
                            .eq('id', session.user.id)
                            .maybeSingle();
                        if (profile?.role) {
                            setRole(profile.role);
                        }
                    } catch (bgErr) {
                        console.error("[AuthDebug] onAuthStateChange arka plan hatası:", bgErr);
                    }
                })();
            } else {
                setUser(null);
                setRole(null);
                setLoading(false);
            }

            // Sayfa durumunu yenilemek için sadece kritik durumlarda refresh tetikle
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [checkUser, router, supabase]);

    // Sayfa değiştiğinde loading'e sokmadan sessizce kontrol et
    useEffect(() => {
        if (mounted) checkUser();
    }, [pathname, checkUser, mounted]);

    const handleSignOut = async () => {
        setLoading(true);
        try {
            // Sunucu tarafındaki çerezleri ve oturumu temizlemek için Server Action çağırıyoruz
            await signout();
            // Server Action başarılı olduysa istemci durumunu güncelle ve yönlendir
            setUser(null);
            setRole(null);
            setLoading(false);
            router.push('/');
            router.refresh();
        } catch (err) {
            console.error("Çıkış hatası:", err);
            // Sunucu tarafında hata oluşursa istemci tarafında da temizlik yapıp ana sayfaya yönlendiriyoruz
            try {
                await supabase.auth.signOut();
            } catch (clientErr) {
                console.error("İstemci tarafında çıkış hatası:", clientErr);
            }
            setUser(null);
            setRole(null);
            setLoading(false);
            router.push('/');
            router.refresh();
        }
    };

    // Hydration (flicker) hatasını önlemek için
    if (!mounted) return null;

    const dashboardLink = role === 'admin' ? '/dashboard/admin' :
        role === 'restaurant' ? '/dashboard/restaurant' :
            '/dashboard/customer';

    return (
        <>
            <nav className="fixed top-0 z-[100] w-full flex items-center justify-between px-4 py-4 glass border-b-4 border-accent md:px-12 md:py-6 transition-all duration-500">
                {/* Logo */}
                <div className="flex-1 flex justify-start lg:justify-center">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="group relative z-[110]">
                        <div className="border-[3px] border-accent px-5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center font-display text-sm md:text-lg font-black uppercase tracking-wider italic hover:border-white hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:scale-105 transition-all duration-300">
                            <span className="text-white">BODRUMUN MEKANLARI.COM</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 lg:gap-14 flex-1 justify-end">
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex flex-row gap-6 items-center">
                            <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-all"><SiFacebook color="default" size={20} /></a>
                            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-all"><SiInstagram color="default" size={20} /></a>
                            <a href={socials.x} target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-all"><SiX color="#FFFFFF" size={20} /></a>
                            <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-all"><SiTiktok color="#FFFFFF" size={20} /></a>
                            <a href={socials.telegram} target="_blank" rel="noopener noreferrer" className="hover:opacity-85 transition-all"><SiTelegram color="default" size={20} /></a>
                        </div>
                        <div className="flex items-center gap-8">
                            <Link href="/#how-it-works" className="text-[11px] font-black tracking-[0.2em] text-white/60 hover:text-accent transition-colors uppercase whitespace-nowrap">Nasıl Çalışır?</Link>
                            <Link href="/restaurants" className="text-[11px] font-black tracking-[0.2em] text-white/60 hover:text-accent transition-colors uppercase whitespace-nowrap">Mekanlar</Link>
                            <Link href="/categories" className="text-[11px] font-black tracking-[0.2em] text-white/60 hover:text-accent transition-colors uppercase whitespace-nowrap">Kategoriler</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!loading ? (
                            user ? (
                                <div className="flex items-center gap-4 animate-in fade-in duration-300">
                                    <Link href={dashboardLink} className="flex flex-col items-end group">
                                        <span className="text-[10px] font-black text-white group-hover:text-accent transition-colors uppercase tracking-widest">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                                        <span className="text-[8px] font-bold text-accent uppercase tracking-[0.2em]">Panelim →</span>
                                    </Link>
                                    <button onClick={handleSignOut} className="px-6 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-white font-black rounded-xl text-[9px] tracking-[0.1em] transition-all uppercase border border-white/10">ÇIKIŞ</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 animate-in fade-in duration-300">
                                    <Link href="/login/member" className="px-6 py-3.5 glass text-white font-black rounded-xl text-[9px] tracking-[0.1em] uppercase border border-white/10 hover:bg-white/5">ÜYE GİRİŞİ</Link>
                                    <Link href="/login/restaurant" className="px-6 py-3.5 bg-accent text-black font-black rounded-xl text-[9px] tracking-[0.1em] uppercase shadow-lg hover:scale-105 transition-transform">RESTORAN</Link>
                                </div>
                            )
                        ) : (
                            <div className="w-20 h-8 bg-white/5 animate-pulse rounded-lg" />
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex-1 flex justify-end">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative z-[110] w-10 h-10 flex flex-col items-center justify-center bg-white/5 rounded-full border border-white/10">
                        <div className="w-5 h-4 relative flex flex-col justify-between">
                            <span className={`w-5 h-0.5 bg-white transition-all duration-300 origin-left ${isMenuOpen ? "rotate-[42deg] translate-x-1" : ""}`} />
                            <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0 translate-x-2" : ""}`} />
                            <span className={`w-5 h-0.5 bg-white transition-all duration-300 origin-left ${isMenuOpen ? "-rotate-[42deg] translate-x-1" : ""}`} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl transition-all duration-500 md:hidden overflow-y-auto ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="relative flex flex-col items-center justify-center min-h-full gap-8 p-8 text-center">
                    {!loading && (
                        user ? (
                            <>
                                <Link onClick={() => setIsMenuOpen(false)} href={dashboardLink} className="font-display text-4xl font-black text-white uppercase italic mb-2 tracking-tighter">Panelim.</Link>
                                <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="w-full max-w-xs py-5 bg-red-500/10 text-red-500 font-black rounded-2xl text-[10px] tracking-[0.3em] uppercase border border-red-500/20 mb-4">ÇIKIŞ YAP</button>
                                <div className="flex gap-6 justify-center mt-4">
                                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer"><SiFacebook className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer"><SiInstagram className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                    <a href={socials.x} target="_blank" rel="noopener noreferrer"><SiX className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                    <a href={socials.tiktok} target="_blank" rel="noopener noreferrer"><SiTiktok className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                    <a href={socials.telegram} target="_blank" rel="noopener noreferrer"><SiTelegram className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col w-full max-w-xs gap-4 mt-4">
                                <Link onClick={() => setIsMenuOpen(false)} href="/login/member" className="w-full py-5 glass text-white font-black rounded-2xl text-[11px] tracking-[0.2em] uppercase border border-white/10">ÜYE GİRİŞİ</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/login/restaurant" className="w-full py-5 bg-accent text-black font-black rounded-2xl text-[11px] tracking-[0.2em] uppercase shadow-lg">RESTORAN GİRİŞİ</Link>
                                <div className="flex gap-6 justify-center mt-8">
                                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer"><SiFacebook className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer"><SiInstagram className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                    <a href={socials.x} target="_blank" rel="noopener noreferrer"><SiX className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                    <a href={socials.tiktok} target="_blank" rel="noopener noreferrer"><SiTiktok className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                    <a href={socials.telegram} target="_blank" rel="noopener noreferrer"><SiTelegram className="text-white/40 hover:text-white transition-colors" size={24} /></a>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

        </>
    );
}
