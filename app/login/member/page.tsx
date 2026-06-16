"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { login, signup, loginWithGoogle } from "@/app/actions/auth";

export default function MemberLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null);

  const state = isLogin ? loginState : signupState;

  return (
    <main className="min-h-screen noise-overlay mesh-gradient flex items-center justify-center p-6 pt-24">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-12">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center font-display font-black text-2xl text-black italic group-hover:rotate-12 transition-transform">E</div>
            <span className="font-display text-3xl font-black tracking-tighter uppercase text-white">Evolution</span>
          </Link>
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-[9px] font-black tracking-[0.2em] text-accent mb-6 uppercase">
            Üye Giriş Portalı
          </div>
          <h1 className="font-display text-4xl font-extrabold text-center leading-tight uppercase italic text-white">
            {isLogin ? "Tekrar Hoş Geldin." : "Aramıza Katıl."}
          </h1>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form className="space-y-5" action={isLogin ? loginAction : signupAction}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">ADINIZ SOYADINIZ</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  defaultValue={(signupState as any)?.fullName || ""}
                  placeholder="Can Dostum"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-bold text-sm text-white placeholder:text-white/20"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">E-POSTA ADRESİ</label>
              <input 
                type="email" 
                name="email"
                required
                defaultValue={state?.email || ""}
                placeholder="can@ajans.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-bold text-sm text-white placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest">ŞİFRE</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-black text-accent hover:underline uppercase">Şifremi Unuttum</button>
                )}
              </div>
              <input 
                type="password" 
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-bold text-sm text-white placeholder:text-white/20"
              />
            </div>

            <input type="hidden" name="role" value="customer" />

            {state?.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-500 text-[10px] font-black uppercase text-center">{state.error}</p>
              </div>
            )}

            <button disabled={isLoginPending || isSignupPending} className="w-full py-5 bg-accent text-black font-black rounded-2xl text-sm tracking-[0.2em] hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_40px_rgba(245,158,11,0.2)] mt-4 uppercase disabled:opacity-50">
              {isLoginPending || isSignupPending ? "İŞLENİYOR..." : (isLogin ? "GİRİŞ YAP" : "HESAP OLUŞTUR")}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative bg-black px-4 text-[10px] text-muted font-black uppercase tracking-widest">VEYA</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-2 py-4 glass rounded-2xl hover:bg-white/5 transition-colors font-black text-[10px] uppercase tracking-widest text-white"
            >
              GOOGLE
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-4 glass rounded-2xl hover:bg-white/5 transition-colors font-black text-[10px] uppercase tracking-widest text-white">
              FACEBOOK
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-muted font-bold text-[11px] uppercase tracking-widest">
          {isLogin ? "Henüz hesabın yok mu?" : "Zaten hesabın var mı?"}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-white font-black hover:text-accent transition-colors underline decoration-2 underline-offset-4"
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </div>
    </main>
  );
}
