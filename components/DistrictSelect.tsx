"use client";

import { useState, useEffect, useRef } from "react";

const DISTRICTS = [
    "Bodrum Merkez",
    "Yalıkavak",
    "Göltürkbükü",
    "Gümüşlük",
    "Turgutreis",
    "Bitez",
    "Ortakent",
    "Gündoğan",
    "Torba"
];

interface DistrictSelectProps {
    name: string;
    defaultValue?: string;
    onChange?: (val: string) => void;
}

export default function DistrictSelect({ name, defaultValue = "", onChange }: DistrictSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelected(defaultValue);
    }, [defaultValue]);

    // Dropdown dışına tıklandığında kapatma
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        setSelected(val);
        setIsOpen(false);
        if (onChange) onChange(val);
    };

    const displayText = selected || "Tüm Bölgeler";

    return (
        <div ref={containerRef} className="relative w-full z-50">
            {/* Hidden Input for Form Submissions */}
            <input type="hidden" name={name} value={selected} />

            {/* Select Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] px-6 py-4 md:py-5 outline-none focus:border-accent hover:border-white/20 transition-all font-bold text-xs text-white flex items-center justify-between cursor-pointer uppercase tracking-widest text-left"
            >
                <span className="truncate">{displayText}</span>
                <span className={`text-[10px] text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>▼</span>
            </button>

            {/* Dropdown Menu (2-Column Grid Positioned Below the Trigger) */}
            {isOpen && (
                <div className="absolute right-0 mt-3 bg-neutral-950/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[999] animate-in fade-in slide-in-from-top-2 duration-200 p-4 w-[280px] sm:w-[350px]">
                    <div className="grid grid-cols-2 gap-2">
                        {/* Option: Tüm Bölgeler */}
                        <button
                            type="button"
                            onClick={() => handleSelect("")}
                            className={`col-span-2 py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center block ${
                                selected === "" 
                                    ? "bg-accent text-black border-accent font-black" 
                                    : "bg-white/5 border-white/5 text-white hover:border-accent hover:text-accent"
                            }`}
                        >
                            Tüm Bölgeler
                        </button>

                        {/* Options: Districts */}
                        {DISTRICTS.map(d => {
                            const isChecked = selected === d;
                            return (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => handleSelect(d)}
                                    className={`py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center block ${
                                        isChecked 
                                            ? "bg-accent text-black border-accent font-black" 
                                            : "bg-white/5 border-white/5 text-white hover:border-accent hover:text-accent"
                                    }`}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
