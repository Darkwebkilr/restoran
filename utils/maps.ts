export function getAddressLabel(address: string, defaultValue: string = "Harita Konumu"): string {
    if (!address) return "";
    if (!address.startsWith("http")) return address;
    
    try {
        const decodedUrl = decodeURIComponent(address);
        
        // 1. /maps/place/Restoran+Ismi/
        const placeRegex = /\/maps\/place\/([^/]+)/;
        const match = decodedUrl.match(placeRegex);
        if (match && match[1]) {
            return match[1].replace(/\+/g, " ");
        }
        
        // 2. query= veya q= veya daddr=
        const urlObj = new URL(address);
        const query = urlObj.searchParams.get("query") || urlObj.searchParams.get("q") || urlObj.searchParams.get("daddr");
        if (query) {
            return query.replace(/\+/g, " ");
        }
    } catch (e) {
        // Hata durumunda varsayılan değere dön
    }
    return defaultValue;
}

export function getAddressDistrict(address: string, databaseDistrict: string | null = null): string {
    if (databaseDistrict && databaseDistrict !== "null") return databaseDistrict;
    if (!address) return "Bodrum";
    
    // Eğer düz metin adres girilmişse doğrudan içinde arayalım
    if (!address.startsWith("http")) {
        const districts = ["Bodrum Merkez", "Yalıkavak", "Göltürkbükü", "Gümüşlük", "Turgutreis", "Bitez", "Ortakent", "Gündoğan", "Torba"];
        for (const d of districts) {
            if (address.toLowerCase().includes(d.toLowerCase())) {
                return d;
            }
        }
        return "Bodrum";
    }

    try {
        const decodedUrl = decodeURIComponent(address).toLowerCase();
        
        const districts = ["Bodrum Merkez", "Yalıkavak", "Göltürkbükü", "Gümüşlük", "Turgutreis", "Bitez", "Ortakent", "Gündoğan", "Torba"];
        for (const d of districts) {
            if (decodedUrl.includes(d.toLowerCase())) {
                return d;
            }
        }
        
        // ASCII / Türkçe karakter toleranslı eşleştirmeler
        const trDistricts: { [key: string]: string[] } = {
            "Yalıkavak": ["yalikavak"],
            "Göltürkbükü": ["golturkbuku", "turkbuku", "türkbükü"],
            "Gümüşlük": ["gumusluk"],
            "Turgutreis": ["turgutreis"],
            "Bitez": ["bitez"],
            "Ortakent": ["ortakent"],
            "Gündoğan": ["gundogan"],
            "Torba": ["torba"]
        };
        for (const [key, aliases] of Object.entries(trDistricts)) {
            for (const alias of aliases) {
                if (decodedUrl.includes(alias)) {
                    return key;
                }
            }
        }
    } catch (e) {
        console.error("Adres bölgesi ayıklanamadı:", e);
    }
    return "Bodrum";
}

export function getEmbedUrl(address: string, restaurantName: string, district: string | null = null): string {
    if (!address) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(restaurantName + ", " + (district || "Bodrum"))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Eğer link değilse doğrudan metni arat
    if (!address.startsWith("http")) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(address + ", " + (district || "Bodrum"))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    try {
        const decodedUrl = decodeURIComponent(address);
        
        // 1. Koordinatları bul: 38.381815, 27.028433 veya @38.381815,27.028433 veya /search/38.381815,+27.028433
        const coordRegex = /(-?\d+\.\d+),\s*\+?(-?\d+\.\d+)/;
        const matchCoord = decodedUrl.match(coordRegex);
        if (matchCoord && matchCoord[1] && matchCoord[2]) {
            const lat = matchCoord[1];
            const lng = matchCoord[2];
            return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        
        // 2. Yer ismi /place/ adından bul
        const placeRegex = /\/maps\/place\/([^/]+)/;
        const matchPlace = decodedUrl.match(placeRegex);
        if (matchPlace && matchPlace[1]) {
            const placeName = matchPlace[1].replace(/\+/g, " ");
            return `https://maps.google.com/maps?q=${encodeURIComponent(placeName + ", " + (district || "Bodrum"))}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
    } catch (e) {
        console.error("Embed URL oluşturulamadı:", e);
    }
    
    // Fallback: Linkin kendisini direkt sorgula
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

export function getCategoryIcon(category: string | null): string {
    if (!category) return "🍽️";
    const cat = category.toLowerCase();
    if (cat.includes("deniz") || cat.includes("balık")) return "🐟";
    if (cat.includes("italyan")) return "🍝";
    if (cat.includes("uzak") || cat.includes("asya") || cat.includes("suşi") || cat.includes("doğu")) return "🥢";
    if (cat.includes("steak") || cat.includes("et")) return "🥩";
    if (cat.includes("fransız")) return "🥐";
    if (cat.includes("türk") || cat.includes("geleneksel")) return "🥘";
    return "🍽️";
}
