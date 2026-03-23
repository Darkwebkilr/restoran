"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen noise-overlay mesh-gradient flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-12">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center font-display font-black text-2xl text-black italic group-hover:rotate-12 transition-transform">D</div>
            <span className="font-display text-3xl font-black tracking-tighter">D-RESTORAN</span>
          </Link>
          <h1 className="font-display text-4xl font-extrabold text-center leading-tight">
            {isLogin ? "Tekrar Hoş Geldin." : "Aramıza Katıl."}
          </h1>
          <p className="text-muted mt-2 text-center">
            {isLogin 
              ? "En iyi masalar senin için ayrıldı." 
              : "Seçkin restoranlar dünyasına adım at."}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Ad Soyad</label>
                <input 
                  type="text" 
                  placeholder="Can Dostum"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-medium placeholder:text-white/20"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">E-posta</label>
              <input 
                type="email" 
                placeholder="dostum@restoran.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-medium placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-muted uppercase tracking-widest">Şifre</label>
                {isLogin && (
                  <button type="button" className="text-xs font-bold text-accent hover:underline">Şifremi Unuttum</button>
                )}
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-medium placeholder:text-white/20"
              />
            </div>

            <button className="w-full py-5 bg-accent text-black font-black rounded-2xl text-lg hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.2)] mt-4">
              {isLogin ? "GİRİŞ YAP" : "HESAP OLUŞTUR"}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-transparent px-4 text-muted font-bold">Veya</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 glass rounded-2xl hover:bg-white/5 transition-colors font-bold text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-4 glass rounded-2xl hover:bg-white/5 transition-colors font-bold text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        {/* Toggle Auth Mode */}
        <p className="mt-8 text-center text-muted font-medium">
          {isLogin ? "Henüz hesabın yok mu?" : "Zaten hesabın var mı?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-white font-black hover:text-accent transition-colors"
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </div>
    </main>
  );
}
