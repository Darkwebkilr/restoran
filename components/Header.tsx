"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SiInstagram, SiFacebook } from '@icons-pack/react-simple-icons';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Menü açıkken sayfa kaydırmayı engelle
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    return (
        <>
            <nav className="fixed top-0 z-[70] w-full flex items-center justify-between px-6 py-6 glass border-b border-white/5 md:px-12 transition-all duration-500">
                <div className="flex flex-row gap-10 items-center justify-center">
                    <SiFacebook color="default" className="cursor-pointer" size={24} />
                    <SiInstagram color="default" className="cursor-pointer" size={24} />
                </div>
                <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 group relative z-[80]"
                >
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-display font-black text-xl text-black italic group-hover:scale-110 transition-transform duration-500">E</div>
                    <div className="flex flex-col">
                        <span className="font-display text-lg font-black tracking-tighter leading-none uppercase">Evolution</span>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase leading-none mt-1">Ajans</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/#how-it-works" className="text-[10px] font-black tracking-[0.2em] text-muted hover:text-accent transition-colors uppercase">Nasıl Çalışır?</Link>
                    <Link href="/restaurants" className="text-[10px] font-black tracking-[0.2em] text-muted hover:text-accent transition-colors uppercase">Mekanlar</Link>
                    <Link href="/categories" className="text-[10px] font-black tracking-[0.2em] text-muted hover:text-accent transition-colors uppercase">Kategoriler</Link>
                    <div className="flex items-center gap-3 ml-4">
                        <Link href="/login" className="px-5 py-2.5 glass text-white font-black rounded-xl text-[9px] tracking-[0.1em] hover:bg-white/10 transition-all uppercase border border-white/5">ÜYE GİRİŞİ</Link>
                        <Link href="/login" className="px-5 py-2.5 bg-accent text-black font-black rounded-xl text-[9px] tracking-[0.1em] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all active:scale-95 uppercase">RESTORAN GİRİŞİ</Link>
                    </div>
                </div>

                {/* Mobile Menu Button - Morphing Hamburger to X */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden relative z-[80] w-12 h-12 flex flex-col items-center justify-center bg-white/5 rounded-full border border-white/10"
                    aria-label="Menü"
                >
                    <div className="w-6 h-5 relative flex flex-col justify-between">
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 origin-left ${isMenuOpen ? "rotate-[42deg] translate-x-1" : ""}`} />
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0 translate-x-2" : ""}`} />
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 origin-left ${isMenuOpen ? "-rotate-[42deg] translate-x-1" : ""}`} />
                    </div>
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[65] bg-background/95 backdrop-blur-2xl transition-all duration-500 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full noise-overlay opacity-20 pointer-events-none" />
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full" />

                <div className="relative flex flex-col items-center justify-center h-full gap-8 p-6 text-center">
                    <Link
                        onClick={() => setIsMenuOpen(false)}
                        href="/#how-it-works"
                        className="font-display text-4xl font-black tracking-tighter hover:text-accent transition-colors uppercase italic"
                    >
                        Nasıl Çalışır?
                    </Link>
                    <Link
                        onClick={() => setIsMenuOpen(false)}
                        href="/restaurants"
                        className="font-display text-4xl font-black tracking-tighter hover:text-accent transition-colors uppercase italic"
                    >
                        Mekanlar
                    </Link>
                    <Link
                        onClick={() => setIsMenuOpen(false)}
                        href="/categories"
                        className="font-display text-4xl font-black tracking-tighter hover:text-accent transition-colors uppercase italic"
                    >
                        Kategoriler
                    </Link>
                    
                    <div className="flex flex-col w-full max-w-xs gap-4 mt-4">
                        <Link
                            onClick={() => setIsMenuOpen(false)}
                            href="/login"
                            className="w-full py-5 glass text-white font-black rounded-2xl text-[10px] tracking-[0.3em] uppercase border border-white/10"
                        >
                            ÜYE GİRİŞİ
                        </Link>
                        <Link
                            onClick={() => setIsMenuOpen(false)}
                            href="/login"
                            className="w-full py-5 bg-accent text-black font-black rounded-2xl text-[10px] tracking-[0.3em] uppercase shadow-[0_0_50px_rgba(245,158,11,0.3)]"
                        >
                            RESTORAN GİRİŞİ
                        </Link>
                    </div>

                    <div className="mt-16 flex flex-col gap-3 animate-in fade-in duration-1000 delay-500">
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Evolution Ajans</span>
                        <div className="flex gap-6 justify-center">
                            <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Instagram</span>
                            <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Twitter</span>
                        </div>
                        <span className="text-[9px] font-bold text-muted/30 uppercase tracking-[0.3em] mt-4">© 2026 Tüm Hakları Saklıdır</span>
                    </div>
                </div>
            </div>
        </>
    );
}
