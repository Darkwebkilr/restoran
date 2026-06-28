"use client";

import Link from "next/link";
import { useState, useEffect, Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login, signup } from "@/app/actions/auth";

function RestaurantLoginContent() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);

  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null);

  const state = isLogin ? loginState : signupState;

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setIsLogin(false);
    }
  }, [searchParams]);

  return (
    <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col items-center mb-12">
        <Link href="/" className="flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-display font-black text-2xl italic group-hover:rotate-12 transition-transform">E</div>
          <span className="font-display text-3xl font-black tracking-tighter uppercase text-white">Evolution</span>
        </Link>
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.2em] text-white mb-6 uppercase">
          Restoran Yönetim Portalı
        </div>
        <h1 className="font-display text-4xl font-extrabold text-center leading-tight uppercase italic text-white">
          {isLogin ? "İşletme Girişi." : "İşletmeni Kaydet."}
        </h1>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <form className="space-y-5" action={isLogin ? loginAction : signupAction}>
          {!isLogin && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">RESTORAN ADI</label>
                <input 
                  type="text" 
                  name="restaurantName"
                  required
                  defaultValue={(signupState as any)?.restaurantName || ""}
                  placeholder="L'Atelier de L'Entrecôte"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm text-white placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">YETKİLİ ADI</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  defaultValue={(signupState as any)?.fullName || ""}
                  placeholder="Ahmet Yılmaz"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm text-white placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">MUTFAK TÜRÜ</label>
                <select 
                  name="category"
                  required
                  defaultValue={(signupState as any)?.category || "Dünya Mutfağı"}
                  className="w-full bg-card border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm text-white appearance-none cursor-pointer uppercase tracking-widest"
                >
                  <option value="Deniz Ürünleri">Deniz Ürünleri</option>
                  <option value="Uzak Doğu">Uzak Doğu</option>
                  <option value="İtalyan Mutfağı">İtalyan Mutfağı</option>
                  <option value="Steakhouse">Steakhouse</option>
                  <option value="Fransız Mutfağı">Fransız Mutfağı</option>
                  <option value="Geleneksel Türk">Geleneksel Türk</option>
                  <option value="Dünya Mutfağı">Dünya Mutfağı</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">İLETİŞİM NUMARASI</label>
                <input 
                  type="text" 
                  name="phone"
                  required
                  defaultValue={(signupState as any)?.phone || ""}
                  placeholder="+90 (555) 555 55 55"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm text-white placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">LOKASYON / ADRES</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  defaultValue={(signupState as any)?.address || ""}
                  placeholder="Bebek, Cevdet Paşa Cd. No:12, Beşiktaş/İstanbul"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm text-white placeholder:text-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">HAKKINDA / HİKAYENİZ</label>
                <textarea 
                  name="description"
                  required
                  defaultValue={(signupState as any)?.description || ""}
                  placeholder="Misafirlerinize işletmenizi kısaca anlatın..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm text-white placeholder:text-white/20 resize-none leading-relaxed"
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">İŞLETME E-POSTASI</label>
            <input 
              type="email" 
              name="email"
              required
              defaultValue={state?.email || ""}
              placeholder="isletme@restoran.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm text-white placeholder:text-white/20"
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
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white transition-colors font-bold text-sm text-white placeholder:text-white/20"
            />
          </div>

          <input type="hidden" name="role" value="restaurant" />

          {(state as any)?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-500 text-[10px] font-black uppercase text-center">{(state as any).error}</p>
            </div>
          )}

          {(state as any)?.success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-500 text-[10px] font-black uppercase text-center">{(state as any).message}</p>
            </div>
          )}

          <button disabled={isLoginPending || isSignupPending} className="w-full py-5 bg-white text-black font-black rounded-2xl text-sm tracking-[0.2em] hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] mt-4 uppercase disabled:opacity-50">
            {isLoginPending || isSignupPending ? "İŞLENİYOR..." : (isLogin ? "İŞLETME GİRİŞİ YAP" : "BAŞVURU OLUŞTUR")}
          </button>
        </form>
      </div>

      <div className="mt-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
        <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest leading-relaxed text-center">
          {isLogin 
            ? "Giriş yapmakta sorun mu yaşıyorsunuz? Lütfen teknik destek ekibimizle iletişime geçin." 
            : "Başvurunuz incelendikten sonra ekibimiz sizinle en kısa sürede iletişime geçecektir."}
        </p>
      </div>

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
  );
}

export default function RestaurantLoginPage() {
  return (
    <main className="min-h-screen noise-overlay mesh-gradient flex items-center justify-center p-6 pt-24">
      <Suspense fallback={<div className="text-white font-black tracking-widest uppercase">Yükleniyor...</div>}>
        <RestaurantLoginContent />
      </Suspense>
    </main>
  );
}
