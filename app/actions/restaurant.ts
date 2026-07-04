"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createBasicClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function resolveMapsUrl(url: string): Promise<string> {
    if (!url || !url.startsWith("http")) return url;
    
    // Yalnızca kısa linkleri çözümleyelim
    if (url.includes("maps.app.goo.gl") || url.includes("g.co/maps") || url.includes("tinyurl.com") || url.includes("bit.ly")) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 3000); // 3 saniye timeout
            
            const res = await fetch(url, {
                method: "HEAD",
                redirect: "manual",
                signal: controller.signal
            });
            clearTimeout(id);
            
            const location = res.headers.get("location");
            if (location) {
                return location;
            }
        } catch (e) {
            console.error("Maps URL çözümlenemedi:", e);
        }
    }
    return url;
}

async function enforceFeaturedLimit(supabase: any) {
  try {
    const { data: featuredList } = await supabase
      .from("restaurants")
      .select("id")
      .eq("is_featured", true)
      .order("created_at", { ascending: true });

    if (featuredList && featuredList.length >= 50) {
      const overflowCount = featuredList.length - 49;
      const idsToUnfeature = featuredList.slice(0, overflowCount).map((r: any) => r.id);
      
      await supabase
        .from("restaurants")
        .update({ is_featured: false })
        .in("id", idsToUnfeature);
    }
  } catch (e: any) {
    console.warn("Featured limiti uygulanamadı:", e.message);
  }
}

export async function updateRestaurantProfile(prevState: any, formData: FormData) {
  if (!formData) return { error: "Form verileri eksik." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Yetkisiz erişim." };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const category = formData.get("category") as string;
  const features = formData.getAll("features") as string[];
  const photosJson = formData.get("photosJson") as string;
  const videosJson = formData.get("videosJson") as string;

  const district = formData.get("district") as string || null;

  let resolvedAddress = address;
  if (address && address.startsWith("http")) {
      resolvedAddress = await resolveMapsUrl(address);
  }

  if (!name || !address) {
      return { error: "İşletme adı ve adres alanları zorunludur." };
  }

  const photos = JSON.parse(photosJson || "[]") as string[];
  const videos = JSON.parse(videosJson || "[]") as string[];

  try {
    const payload = {
      name,
      description,
      address: resolvedAddress,
      phone,
      category,
      features,
      photos,
      videos,
      district: district === "null" || !district ? null : district,
      slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    };

    const { error } = await supabase
      .from("restaurants")
      .update(payload)
      .eq("owner_id", user.id);

    if (error) {
      if (error.message.includes('column "district"') || error.message.includes('does not exist')) {
        delete (payload as any).district;
        const { error: retryError } = await supabase
          .from("restaurants")
          .update(payload)
          .eq("owner_id", user.id);
        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }

    revalidatePath("/dashboard/restaurant");
    revalidatePath("/dashboard/restaurant/settings");
    return { success: true };

  } catch (e: any) {
    console.error("Profil güncelleme hatası:", e.message);
    return { error: `Bilgiler kaydedilirken bir hata oluştu: ${e.message}` };
  }
}

export async function updateRestaurantByAdmin(prevState: any, formData: FormData) {
  if (!formData) return { error: "Form verileri eksik." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Yetkisiz erişim." };

  // Admin kontrolü
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Bu işlem için admin yetkisi gerekiyor." };
  }

  const restaurantId = formData.get("restaurantId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const features = formData.getAll("features") as string[];
  const photosJson = formData.get("photosJson") as string;
  const videosJson = formData.get("videosJson") as string;

  const district = formData.get("district") as string || null;

  const isFeatured = formData.get("isFeatured") === "true";

  let resolvedAddress = address;
  if (address && address.startsWith("http")) {
      resolvedAddress = await resolveMapsUrl(address);
  }

  if (!restaurantId || !name || !address) {
    return { error: "Gerekli alanlar eksik." };
  }

  const photos = JSON.parse(photosJson || "[]") as string[];
  const videos = JSON.parse(videosJson || "[]") as string[];

  if (isFeatured) {
    await enforceFeaturedLimit(supabase);
  }

  try {
    const payload = {
      name,
      description,
      address: resolvedAddress,
      phone,
      category,
      features,
      photos,
      videos,
      status: status || undefined,
      district: district === "null" || !district ? null : district,
      is_featured: isFeatured,
      slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    };

    const { error } = await supabase
      .from("restaurants")
      .update(payload)
      .eq("id", restaurantId);

    if (error) {
      if (error.message.includes('column "is_featured"') || error.message.includes('column "district"') || error.message.includes('does not exist')) {
        delete (payload as any).is_featured;
        if (error.message.includes('column "district"')) {
          delete (payload as any).district;
        }
        const { error: retryError } = await supabase
          .from("restaurants")
          .update(payload)
          .eq("id", restaurantId);
        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }

    revalidatePath("/dashboard/admin");
    revalidatePath(`/restaurant/${name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`);
    return { success: true };

  } catch (e: any) {
    console.error("Admin restoran güncelleme hatası:", e.message);
    return { error: `Kaydederken hata oluştu: ${e.message}` };
  }
}

export async function createRestaurantByAdmin(prevState: any, formData: FormData) {
  if (!formData) return { error: "Form verileri eksik." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Yetkisiz erişim." };

  // Admin kontrolü
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Bu işlem için admin yetkisi gerekiyor." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string || "approved";
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const features = formData.getAll("features") as string[];
  const photosJson = formData.get("photosJson") as string;

  let resolvedAddress = address;
  if (address && address.startsWith("http")) {
      resolvedAddress = await resolveMapsUrl(address);
  }

  if (!name || !address) {
    return { error: "İşletme adı ve harita konum linki zorunludur." };
  }

  if (!email || !password) {
    return { error: "İşletme e-postası ve şifre alanları zorunludur." };
  }

  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır." };
  }

  const photos = JSON.parse(photosJson || "[]") as string[];
  const videosJson = formData.get("videosJson") as string;
  const videos = JSON.parse(videosJson || "[]") as string[];
  const district = formData.get("district") as string || null;
  const actionType = formData.get("actionType") as string;
  const isFeatured = actionType === "create_featured";
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  try {
    // Admin oturumunu korumak için çerezsiz bağımsız bir Supabase istemcisi kullanıyoruz.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { error: "Supabase çevre değişkenleri sunucuda eksik." };
    }

    const clientWithoutCookies = createBasicClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // Kullanıcıyı auth sistemine kaydet
    const { data: authData, error: authError } = await clientWithoutCookies.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: "restaurant",
        }
      }
    });

    if (authError) {
      return { error: `Kullanıcı oluşturulurken hata: ${authError.message}` };
    }

    const ownerId = authData.user?.id;
    if (!ownerId) {
      return { error: "Kullanıcı oluşturuldu ancak ID bilgisi alınamadı." };
    }

    if (isFeatured) {
      await enforceFeaturedLimit(supabase);
    }

    const payload = {
      owner_id: ownerId,
      name,
      description,
      address: resolvedAddress,
      phone,
      category,
      features,
      photos,
      videos,
      status,
      district: district === "null" || !district ? null : district,
      is_featured: isFeatured,
      slug
    };

    // Restoran tablosuna ekle
    const { error: insertError } = await supabase
      .from("restaurants")
      .insert(payload);

    if (insertError) {
      if (insertError.message.includes('column "is_featured"') || insertError.message.includes('column "district"') || insertError.message.includes('does not exist')) {
        delete (payload as any).is_featured;
        if (insertError.message.includes('column "district"')) {
          delete (payload as any).district;
        }
        const { error: retryError } = await supabase
          .from("restaurants")
          .insert(payload);
        if (retryError) throw retryError;
      } else {
        throw insertError;
      }
    }

    revalidatePath("/dashboard/admin");
    revalidatePath("/restaurants");
    return { success: true };

  } catch (e: any) {
    console.error("Admin manuel restoran ekleme hatası:", e.message);
    return { error: `Ekleme sırasında hata oluştu: ${e.message}` };
  }
}
