"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { SiInstagram, SiFacebook } from '@icons-pack/react-simple-icons';
import { signout } from "@/app/actions/auth";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    
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
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .maybeSingle();
                console.log("[AuthDebug] checkUser - profiles DB query result:", profile, "Error:", error);
                const resolvedRole = profile?.role || session.user.user_metadata?.role || 'customer';
                console.log("[AuthDebug] checkUser - resolvedRole:", resolvedRole);
                setRole(resolvedRole);
            } else {
                setUser(null);
                setRole(null);
            }
        } catch (err) {
            console.error("Auth check hatası:", err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        setMounted(true);
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("[AuthDebug] onAuthStateChange - event:", event, "session:", session);
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                try {
                    if (session?.user) {
                        setUser(session.user);
                        const { data: profile, error } = await supabase
                            .from('profiles')
                            .select('role')
                            .eq('id', session.user.id)
                            .maybeSingle();
                        console.log("[AuthDebug] onAuthStateChange - profiles DB query result:", profile, "Error:", error);
                        const resolvedRole = profile?.role || session.user.user_metadata?.role || 'customer';
                        console.log("[AuthDebug] onAuthStateChange - resolvedRole:", resolvedRole);
                        setRole(resolvedRole);
                    } else {
                        setUser(null);
                        setRole(null);
                    }
                } catch (err) {
                    console.error("Auth state change hatası:", err);
                } finally {
                    setLoading(false);
                    router.refresh();
                }
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
            <nav className="fixed top-0 z-[100] w-full flex items-center justify-between px-4 py-4 glass border-b border-white/5 md:px-12 md:py-6 transition-all duration-500">
                {/* Logo */}
                <div className="flex-1 flex justify-start lg:justify-center">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 group relative z-[110]">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-xl flex items-center justify-center font-display font-black text-lg md:text-xl text-black italic group-hover:scale-110 transition-transform">E</div>
                        <div className="flex flex-col">
                            <span className="font-display text-base md:text-lg font-black tracking-tighter uppercase text-white leading-none">Evolution</span>
                            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-accent uppercase leading-none mt-1">Ajans</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 lg:gap-14 flex-1 justify-end">
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex flex-row gap-6 items-center">
                            <SiFacebook color="default" className="cursor-pointer hover:text-accent transition-all" size={20} />
                            <SiInstagram color="default" className="cursor-pointer hover:text-accent transition-all" size={20} />
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
                                <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="w-full max-w-xs py-5 bg-red-500/10 text-red-500 font-black rounded-2xl text-[10px] tracking-[0.3em] uppercase border border-red-500/20">ÇIKIŞ YAP</button>
                            </>
                        ) : (
                            <div className="flex flex-col w-full max-w-xs gap-4 mt-4">
                                <Link onClick={() => setIsMenuOpen(false)} href="/login/member" className="w-full py-5 glass text-white font-black rounded-2xl text-[11px] tracking-[0.2em] uppercase border border-white/10">ÜYE GİRİŞİ</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/login/restaurant" className="w-full py-5 bg-accent text-black font-black rounded-2xl text-[11px] tracking-[0.2em] uppercase shadow-lg">RESTORAN GİRİŞİ</Link>
                                <div className="flex gap-6 justify-center mt-8">
                                    <SiFacebook className="text-white/40 hover:text-white transition-colors" size={24} />
                                    <SiInstagram className="text-white/40 hover:text-white transition-colors" size={24} />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
