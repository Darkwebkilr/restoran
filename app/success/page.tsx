"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [ticketCode, setTicketCode] = useState("");

  useEffect(() => {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setTicketCode(code);
  }, []);

  return (
    <main className="min-h-screen noise-overlay mesh-gradient flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full animate-in zoom-in fade-in duration-700">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-display font-black text-xl text-black italic">E</div>
          <span className="font-display text-2xl font-black tracking-tighter">EVOLUTION</span>
        </div>

        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-accent rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-4xl font-black mb-3 tracking-tight">MASAN HAZIR.</h1>
          <p className="text-muted font-medium">Evolution ayrıcalığıyla yerin garanti altına alındı.</p>
        </div>

        {/* The Ticket (Re-designed for Code Only) */}
        <div className="glass rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative">
          <div className="p-10 border-b border-dashed border-white/20">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">Restoran</p>
                  <h2 className="font-display text-2xl font-black">L'Atelier de L'Entrecôte</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">Misafir</p>
                  <p className="font-black text-xl">2 KİŞİ</p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">Tarih & Saat</p>
                  <p className="font-black text-xl italic text-white/90">BUGECE • 20:30</p>
                </div>
                <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">VIP PASS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Central Code Section */}
          <div className="p-12 flex flex-col items-center bg-white/[0.02]">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6">GİRİŞ KODUNUZ</p>
            <div className="relative group">
               <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               <p className="relative text-6xl md:text-7xl font-display font-black tracking-[0.3em] text-accent ml-6">
                {ticketCode}
              </p>
            </div>
            <p className="mt-8 text-center text-[10px] font-bold text-muted uppercase leading-relaxed max-w-[200px]">
              KAPI GİRİŞİNDE BU KODU GÖREVLİYE BELİRTMENİZ YETERLİDİR.
            </p>
          </div>

          {/* Perforation Details */}
          <div className="absolute left-0 top-[42%] -translate-x-1/2 w-8 h-8 bg-[#030303] rounded-full border border-white/10 shadow-inner"></div>
          <div className="absolute right-0 top-[42%] translate-x-1/2 w-8 h-8 bg-[#030303] rounded-full border border-white/10 shadow-inner"></div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col gap-4">
          <button className="w-full py-5 bg-white text-black font-black rounded-2xl text-sm tracking-widest hover:bg-accent transition-all shadow-xl active:scale-95 uppercase">
            BİLETİ CÜZDANA KAYDET
          </button>
          <Link 
            href="/" 
            className="text-center text-xs font-black text-muted hover:text-white transition-colors tracking-widest uppercase"
          >
            ANA SAYFAYA DÖN
          </Link>
        </div>
      </div>
    </main>
  );
}
