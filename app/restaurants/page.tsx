import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
    { name: "Hepsi", icon: "🍽️" },
    { name: "Deniz Ürünleri", icon: "🐟" },
    { name: "Uzak Doğu", icon: "🥢" },
    { name: "İtalyan Mutfağı", icon: "🍝" },
    { name: "Steakhouse", icon: "🥩" },
    { name: "Fransız Mutfağı", icon: "🥐" },
];

export default async function RestaurantsPage({
    searchParams
}: {
    searchParams: Promise<{ query?: string, category?: string }>
}) {
    const { query, category } = await searchParams;
    const supabase = await createClient();

    let dbQuery = supabase
        .from("restaurants")
        .select("*")
        .eq("status", "approved");

    if (query) {
        dbQuery = dbQuery.ilike("name", `%${query}%`);
    }

    if (category && category !== "Hepsi") {
        dbQuery = dbQuery.eq("category", category);
    }

    const { data: restaurants } = await dbQuery.order("created_at", { ascending: false });

    return (
        <main className="relative min-h-screen noise-overlay mesh-gradient pt-32 md:pt-48 pb-32 px-4 md:px-6 flex flex-col items-center text-white">
            <div className="max-w-7xl w-full">
                {/* Header Section */}
                <div className="mb-20 text-center md:text-left">
                    <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-4 block italic">Kürasyonumuz</span>
                    <h1 className="font-display text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-12">
                        KEŞFETMEYE <br /><span className="text-accent italic">BAŞLA.</span>
                    </h1>

                    <div className="w-full max-w-4xl glass p-2 md:p-3 rounded-[2rem] md:rounded-[3rem] border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-2 mx-auto md:mx-0">
                        <form action="/restaurants" className="flex-1 w-full relative flex items-center">
                            <span className="absolute left-6 text-lg">🔍</span>
                            <input
                                type="text"
                                name="query"
                                defaultValue={query}
                                placeholder="Mekan adı ara..."
                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] pl-14 pr-6 py-4 md:py-6 outline-none focus:border-accent transition-all font-bold text-sm placeholder:text-white/20 text-white"
                            />
                            <button type="submit" className="hidden">Ara</button>
                        </form>
                        <div className="w-full md:w-auto">
                            <Link 
                                href="/restaurants"
                                className="w-full md:w-auto px-10 py-4 md:py-6 bg-accent text-black font-black rounded-[1.5rem] md:rounded-[2rem] text-[10px] tracking-widest hover:bg-black hover:text-accent border-2 border-accent transition-all uppercase text-center block"
                            >
                                TÜMÜNÜ GÖR
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-20">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.name === "Hepsi" ? "/restaurants" : `/restaurants?category=${cat.name}`}
                            className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                (category === cat.name || (!category && cat.name === "Hepsi"))
                                ? "bg-white text-black border-white scale-105 shadow-xl" 
                                : "bg-white/5 border-white/10 hover:border-white/30 text-white/40"
                            }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {!restaurants || restaurants.length === 0 ? (
                        <div className="col-span-full py-32 text-center glass rounded-[3rem] border border-white/10">
                            <p className="text-white/20 font-black uppercase tracking-[0.5em] text-sm italic">Aradığınız kriterlerde bir mekan bulunamadı.</p>
                        </div>
                    ) : (
                        restaurants.map((res) => (
                            <Link key={res.id} href={`/restaurant/${res.slug}`} className="group relative">
                                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-white/10 mb-6 shadow-2xl transition-all duration-700 group-hover:border-accent group-hover:scale-[1.02] bg-black">
                                    <Image
                                        src={res.photos?.[0] || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"}
                                        alt={res.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <h3 className="font-display text-4xl md:text-5xl font-black text-white leading-none uppercase group-hover:text-accent transition-colors italic tracking-tighter">{res.name}</h3>
                                        <p className="text-accent text-[9px] font-black uppercase tracking-[0.3em] mt-6 flex items-center gap-2">
                                            <span>📍</span> {res.address}
                                        </p>
                                    </div>
                                    <div className="absolute top-10 right-10 glass w-16 h-16 rounded-full flex items-center justify-center font-display font-black text-white border border-white/20 shadow-2xl group-hover:border-accent group-hover:text-accent transition-all italic">
                                        {res.rating || '4.9'}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
