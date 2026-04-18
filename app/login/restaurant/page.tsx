"use client";

import Link from "next/link";
import { useState } from "react";

export default function RestaurantLoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen noise-overlay mesh-gradient flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-12">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-display font-black text-2xl italic group-hover:rotate-12 transition-transform">E</div>
            <span className="font-display text-3xl font-black tracking-tighter uppercase">Evolution</span>
          </Link>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.2em] text-white mb-6 uppercase">
            Restoran Yönetim Portalı
          </div>
          <h1 className="font-display text-4xl font-extrabold text-center leading-tight uppercase italic">
            {isLogin ? "İşletme Girişi." : "İşletmeni Kaydet."}
          </h1>
          <p className="text-muted mt-4 text-center font-medium text-sm">
            {isLogin 
              ? "Restoran performansını ve rezervasyonlarını yönet." 
              : "Evolution vizyonuyla işletmeni dijital dünyaya taşı."}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">RESTORAN ADI</label>
                  <input 
                    type="text" 
                    placeholder="L'Atelier de L'Entrecôte"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">YETKİLİ ADI</label>
                  <input 
                    type="text" 
                    placeholder="Ahmet Yılmaz"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm placeholder:text-white/20"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">İŞLETME E-POSTASI</label>
              <input 
                type="email" 
                placeholder="isletme@restoran.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">ŞİFRE</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-black text-white hover:underline uppercase">Şifremi Unuttum</button>
                )}
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm placeholder:text-white/20"
              />
            </div>

            <button className="w-full py-5 bg-white text-black font-black rounded-2xl text-sm tracking-[0.2em] hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] mt-4 uppercase">
              {isLogin ? "İŞLETME GİRİŞİ YAP" : "BAŞVURU OLUŞTUR"}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed text-center">
            {isLogin 
              ? "Giriş yapmakta sorun mu yaşıyorsunuz? Lütfen teknik destek ekibimizle iletişime geçin." 
              : "Başvurunuz incelendikten sonra ekibimiz sizinle en kısa sürede iletişime geçecektir."}
          </p>
        </div>

        {/* Toggle Auth Mode */}
        <p className="mt-8 text-center text-muted font-bold text-[11px] uppercase tracking-widest">
          {isLogin ? "İşletmenizi henüz kaydetmediniz mi?" : "Zaten kayıtlı mısınız?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-white font-black hover:text-accent transition-colors underline decoration-2 underline-offset-4"
          >
            {isLogin ? "Hemen Kaydol" : "Giriş Yap"}
          </button>
        </p>
      </div>
    </main>
  );
}
