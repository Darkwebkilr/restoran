"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "RZV-0000";

  return (
    <div className="max-w-md w-full animate-in zoom-in fade-in duration-700">
      <div className="flex items-center justify-center gap-3 mb-12">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-display font-black text-xl text-black italic">E</div>
        <span className="font-display text-2xl font-black tracking-tighter text-white">EVOLUTION</span>
      </div>

      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-accent rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-4xl font-black mb-3 tracking-tight text-white uppercase italic text-center">MASAN HAZIR.</h1>
        <p className="text-muted font-medium text-sm text-center">Evolution ayrıcalığıyla yerin garanti altına alındı.</p>
      </div>

      <div className="glass rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative">
        <div className="p-10 border-b border-dashed border-white/20">
          <div className="space-y-6 text-center">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">Statü</p>
            <h2 className="font-display text-2xl font-black text-white italic">ONAYLANDI</h2>
          </div>
        </div>

        <div className="p-12 flex flex-col items-center bg-white/[0.02]">
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6">GİRİŞ KODUNUZ</p>
          <div className="relative group">
             <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
             <p className="relative text-5xl md:text-6xl font-display font-black tracking-[0.2em] text-accent">
              {code}
            </p>
          </div>
          <p className="mt-8 text-center text-[10px] font-bold text-muted uppercase leading-relaxed max-w-[220px]">
            KAPI GİRİŞİNDE BU KODU GÖREVLİYE BELİRTMENİZ YETERLİDİR.
          </p>
        </div>

        <div className="absolute left-0 top-[38%] -translate-x-1/2 w-8 h-8 bg-[#030303] rounded-full border border-white/10"></div>
        <div className="absolute right-0 top-[38%] translate-x-1/2 w-8 h-8 bg-[#030303] rounded-full border border-white/10"></div>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <Link 
          href="/dashboard/customer"
          className="w-full py-5 bg-white text-black font-black rounded-2xl text-[11px] tracking-widest hover:bg-accent transition-all shadow-xl active:scale-95 uppercase text-center"
        >
          BİLETİ PANELE GİDİP GÖR
        </Link>
        <Link 
          href="/" 
          className="text-center text-[10px] font-black text-muted hover:text-accent transition-colors tracking-widest uppercase"
        >
          ANA SAYFAYA DÖN
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen noise-overlay mesh-gradient flex flex-col items-center justify-center p-6">
      <Suspense fallback={<div className="text-white font-black tracking-widest uppercase italic">İşleniyor...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
