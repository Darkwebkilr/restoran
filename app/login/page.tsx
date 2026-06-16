"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { login, signup, loginWithGoogle } from "@/app/actions/auth";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null);

  const state = isLogin ? loginState : signupState;

  return (
    <main className="min-h-screen noise-overlay mesh-gradient flex items-center justify-center p-6 pt-24">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-12">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center font-display font-black text-2xl text-black italic group-hover:rotate-12 transition-transform">D</div>
            <span className="font-display text-3xl font-black tracking-tighter">D-RESTORAN</span>
          </Link>
          <h1 className="font-display text-4xl font-extrabold text-center leading-tight text-white">
            {isLogin ? "Tekrar Hoş Geldin." : "Aramıza Katıl."}
          </h1>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form className="space-y-5" action={isLogin ? loginAction : signupAction}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Ad Soyad</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  defaultValue={(signupState as any)?.fullName || ""}
                  placeholder="Can Dostum"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-medium text-white placeholder:text-white/20"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">E-posta</label>
              <input 
                type="email" 
                name="email"
                required
                defaultValue={(state as any)?.email || ""}
                placeholder="dostum@restoran.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-medium text-white placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-muted uppercase tracking-widest text-muted">Şifre</label>
                {isLogin && (
                  <button type="button" className="text-xs font-bold text-accent hover:underline">Şifremi Unuttum</button>
                )}
              </div>
              <input 
                type="password" 
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-accent transition-colors font-medium text-white placeholder:text-white/20"
              />
            </div>

            {state?.error && (
              <p className="text-red-500 text-sm font-medium text-center">{state.error}</p>
            )}

            <button disabled={isLoginPending || isSignupPending} className="w-full py-5 bg-accent text-black font-black rounded-2xl text-lg hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.2)] mt-4 disabled:opacity-50">
              {isLoginPending || isSignupPending ? "İŞLENİYOR..." : (isLogin ? "GİRİŞ YAP" : "HESAP OLUŞTUR")}
            </button>
          </form>

          <div className="relative my-8 text-center border-t border-white/5">
            <span className="relative -top-3 bg-black px-4 text-xs font-bold text-muted uppercase tracking-widest">VEYA</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-2 py-4 glass rounded-2xl hover:bg-white/5 transition-colors font-bold text-sm text-white"
            >
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-4 glass rounded-2xl hover:bg-white/5 transition-colors font-bold text-sm text-white">
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-muted font-medium">
          {isLogin ? "Henüz hesabın yok mu?" : "Zaten hesabın var mı?"}
          <button 
            type="button"
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
