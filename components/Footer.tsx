"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/5 py-32 px-6 glass relative mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
                <div className="max-w-md">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center font-display font-black text-3xl text-black italic">E</div>
                        <span className="font-display text-4xl font-black tracking-tighter uppercase leading-none">Evolution <br /><span className="text-accent text-sm tracking-[0.5em]">Ajans</span></span>
                    </div>
                    <p className="text-muted font-medium text-lg leading-relaxed text-balance opacity-80">
                        Gastronomi dünyasında dijital dönüşümün öncüsü, Evolution Ajans. Sınırları zorlayan, cesur ve akıllı deneyimler için buradayız.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-32">
                    <div className="flex flex-col gap-8">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Platform</span>
                        <Link href="/categories" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Kategoriler</Link>
                        <Link href="/restaurants" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Mekanlar</Link>
                        <Link href="/#how-it-works" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Nasıl Çalışır</Link>
                    </div>
                    <div className="flex flex-col gap-8">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Evolution</span>
                        <a href="#" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors font-bold">Ajans</a>
                        <a href="#" className="text-muted hover:text-accent text-[12px] font-black uppercase tracking-widest transition-colors font-bold">İletişim</a>
                    </div>
                    <div className="flex flex-col gap-8">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Sosyal Medya</span>
                        <div className="flex flex-col gap-4">
                            <a href="#" className="text-muted hover:text-accent text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-3">
                                <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded-lg">📸</span> Instagram
                            </a>
                            <a href="#" className="text-muted hover:text-accent text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-3">
                                <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded-lg">🐦</span> Twitter
                            </a>
                            <a href="#" className="text-muted hover:text-accent text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-3">
                                <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded-lg">📘</span> Facebook
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-muted uppercase tracking-[0.5em]">
                <span>© 2026 Evolution Ajans. Tüm hakları saklıdır.</span>
                <div className="flex gap-16">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    );
}
