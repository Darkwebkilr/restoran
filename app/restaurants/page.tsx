import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { getAddressLabel, getAddressDistrict, getCategoryIcon } from "@/utils/maps";
import DistrictSelect from "@/components/DistrictSelect";

const CATEGORIES = [
    { name: "Hepsi", icon: "🍽️" },
    { name: "Deniz Ürünleri", icon: "🐟" },
    { name: "Uzak Doğu", icon: "🥢" },
    { name: "İtalyan Mutfağı", icon: "🍝" },
    { name: "Steakhouse", icon: "🥩" },
    { name: "Fransız Mutfağı", icon: "🥐" },
    { name: "Geleneksel Türk", icon: "🥘" },
    { name: "Dünya Mutfağı", icon: "🌐" },
];

export default async function RestaurantsPage({
    searchParams
}: {
    searchParams: Promise<{ query?: string, category?: string, district?: string }>
}) {
    const { query, category, district } = await searchParams;
    const supabase = await createClient();

    let restaurants: any[] = [];
    try {
        let dbQuery = supabase
            .from("restaurants")
            .select("*")
            .eq("status", "approved");

        if (query) {
            dbQuery = dbQuery.ilike("name", `%${query}%`);
        }

        if (category && category !== "Hepsi") {
            if (category === "İtalyan Mutfağı") {
                dbQuery = dbQuery.in("category", ["İtalyan Mutfağı", "İtalyan"]);
            } else if (category === "Fransız Mutfağı") {
                dbQuery = dbQuery.in("category", ["Fransız Mutfağı", "Fransız"]);
            } else {
                dbQuery = dbQuery.eq("category", category);
            }
        }

        if (district) {
            dbQuery = dbQuery.or(`address.ilike.%${district}%,district.eq.${district}`);
        }

        const { data, error } = await dbQuery.order("created_at", { ascending: false });
        if (error) throw error;
        restaurants = data || [];
    } catch (e: any) {
        console.warn("District sorgusu başarısız oldu, sadece adres aramasıyla tekrar deneniyor:", e.message);
        let fallbackQuery = supabase
            .from("restaurants")
            .select("*")
            .eq("status", "approved");

        if (query) {
            fallbackQuery = fallbackQuery.ilike("name", `%${query}%`);
        }

        if (category && category !== "Hepsi") {
            if (category === "İtalyan Mutfağı") {
                fallbackQuery = fallbackQuery.in("category", ["İtalyan Mutfağı", "İtalyan"]);
            } else if (category === "Fransız Mutfağı") {
                fallbackQuery = fallbackQuery.in("category", ["Fransız Mutfağı", "Fransız"]);
            } else {
                fallbackQuery = fallbackQuery.eq("category", category);
            }
        }

        if (district) {
            fallbackQuery = fallbackQuery.ilike("address", `%${district}%`);
        }

        const { data } = await fallbackQuery.order("created_at", { ascending: false });
        restaurants = data || [];
    }

    return (
        <main className="relative min-h-screen noise-overlay mesh-gradient pt-32 md:pt-48 pb-32 px-4 md:px-6 flex flex-col items-center text-white">
            <div className="max-w-7xl w-full">
                {/* Header Section */}
                <div className="mb-20 text-center md:text-left">
                    <Link
                        href="/"
                        className="inline-flex px-5 py-2.5 glass text-white/70 hover:text-white font-black rounded-xl text-[9px] tracking-widest uppercase border-4 border-accent hover:bg-white/5 transition-all italic mb-6"
                    >
                        ← ANASAYFAYA GERİ DÖN
                    </Link>
                    <span className="text-accent font-black text-[10px] tracking-[0.5em] uppercase mb-4 block italic">Kürasyonumuz</span>
                    <h1 className="font-display text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-12">
                        KEŞFETMEYE <br /><span className="text-accent italic">BAŞLA.</span>
                    </h1>

                    <form action="/restaurants" className="w-full max-w-4xl glass p-2 md:p-3 rounded-[2rem] md:rounded-[3rem] border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-2 mx-auto md:mx-0">
                        <div className="flex-[2] w-full relative flex items-center">
                            <span className="absolute left-6 text-lg">🔍</span>
                            <input
                                type="text"
                                name="query"
                                defaultValue={query}
                                placeholder="Mekan adı ara..."
                                className="w-full bg-white/5 border-4 border-accent rounded-[1.5rem] md:rounded-[2rem] pl-14 pr-6 py-4 md:py-6 outline-none focus:border-accent transition-all font-bold text-sm placeholder:text-white/20 text-white"
                            />
                        </div>
                        <div className="flex-1 w-full relative">
                            <DistrictSelect
                                name="district"
                                defaultValue={district || ""}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button type="submit" className="flex-1 md:flex-initial px-8 py-4 md:py-6 bg-accent text-black font-black rounded-[1.5rem] md:rounded-[2rem] text-[10px] tracking-widest hover:bg-black hover:text-accent border-2 border-accent transition-all uppercase whitespace-nowrap">FİLTRELE</button>
                            <Link 
                                href="/restaurants"
                                className="flex-1 md:flex-initial px-6 py-4 md:py-6 bg-white/5 border-[3px] border-accent text-white font-black rounded-[1.5rem] md:rounded-[2rem] text-[10px] tracking-widest hover:bg-white/10 transition-all uppercase text-center whitespace-nowrap flex items-center justify-center"
                            >
                                TEMİZLE
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-20">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.name === "Hepsi" ? "/restaurants" : `/restaurants?category=${cat.name}`}
                            className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border-[3px] transition-all ${
                                (category === cat.name || (!category && cat.name === "Hepsi"))
                                ? "bg-white text-black border-accent scale-105 shadow-xl" 
                                : "bg-white/5 border-white/25 hover:border-white/50 text-zinc-300"
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
                        <div className="col-span-full py-32 text-center glass rounded-[3rem] border-4 border-accent">
                            <p className="text-zinc-300 font-black uppercase tracking-[0.5em] text-sm italic">Aradığınız kriterlerde bir mekan bulunamadı.</p>
                        </div>
                    ) : (
                        restaurants.map((res) => (
                            <Link key={res.id} href={`/restaurant/${res.slug}`} className={`group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col border-4 border-accent ${res.is_featured_ad ? 'hover:border-accent hover:ring-2 hover:ring-accent/20' : ''}`}>
                                <div className="relative aspect-[4/3.3] w-full overflow-hidden bg-gray-100">
                                    <Image src={res.photos?.[0] || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"} alt={res.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    {/* Kategori Badge (Sol Üst) - Mor arka plan */}
                                    <div className="absolute top-4 left-4 bg-[#7C3AED] px-4 py-1.5 rounded-lg shadow-lg">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{res.category || 'Lüks'}</span>
                                    </div>
                                    {/* İlçe/Bölge Badge (Sağ Alt) - Kırmızı arka plan */}
                                    <div className="absolute bottom-4 right-4 bg-[#FF0000] px-4 py-1.5 rounded-lg shadow-lg">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{getAddressDistrict(res.address, res.district)}</span>
                                    </div>
                                </div>
                                <div className="pt-7 px-5 pb-5 flex-1 flex flex-col justify-between relative">
                                    {/* Siyah Daire Logo Overlay (Sol Alt, resmin altına taşacak şekilde konumlandırıldı) */}
                                    <div className="absolute -top-7 left-5 w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg border-4 border-accent z-20 overflow-hidden">
                                        {res.logo_url ? (
                                            <img src={res.logo_url} alt={`${res.name} Logo`} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl font-display font-black text-white uppercase tracking-wider">{res.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex flex-col gap-2">
                                        <h3 className="font-display text-lg font-black text-gray-900 uppercase leading-none tracking-tight group-hover:text-[#7C3AED] transition-colors truncate">{res.name}</h3>
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <span className="text-sm">📞</span>
                                            <span className="text-xs md:text-sm font-black uppercase tracking-wider leading-none">
                                                {res.phone || "Telefon Belirtilmedi"}
                                            </span>
                                        </div>
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
