"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

  if (!name || !address) {
      return { error: "İşletme adı ve adres alanları zorunludur." };
  }

  const photos = JSON.parse(photosJson || "[]") as string[];

  try {
    const { error } = await supabase
      .from("restaurants")
      .update({
        name,
        description,
        address,
        phone,
        category,
        features,
        photos,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      })
      .eq("owner_id", user.id);

    if (error) throw error;

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

  if (!restaurantId || !name || !address) {
    return { error: "Gerekli alanlar eksik." };
  }

  const photos = JSON.parse(photosJson || "[]") as string[];

  try {
    const { error } = await supabase
      .from("restaurants")
      .update({
        name,
        description,
        address,
        phone,
        category,
        features,
        photos,
        status: status || undefined,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      })
      .eq("id", restaurantId);

    if (error) throw error;

    revalidatePath("/dashboard/admin");
    revalidatePath(`/restaurant/${name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`);
    return { success: true };

  } catch (e: any) {
    console.error("Admin restoran güncelleme hatası:", e.message);
    return { error: `Kaydederken hata oluştu: ${e.message}` };
  }
}
