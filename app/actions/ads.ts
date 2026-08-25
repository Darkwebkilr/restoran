"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAdByAdmin(prevState: any, formData: FormData) {
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

  const position = parseInt(formData.get("position") as string);
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const restaurantId = formData.get("restaurantId") as string || null;

  if (!title || isNaN(position)) {
    return { error: "Reklam başlığı ve pozisyonu zorunludur." };
  }

  try {
    // Önce bu pozisyonda bir reklam var mı kontrol edelim
    const { data: existingAd } = await supabase
      .from("ads")
      .select("id")
      .eq("position", position)
      .maybeSingle();

    let resultError;
    if (existingAd) {
      // Güncelle
      const { error } = await supabase
        .from("ads")
        .update({
          title,
          subtitle,
          image_url: imageUrl,
          restaurant_id: restaurantId === "null" || !restaurantId ? null : restaurantId
        })
        .eq("position", position);
      resultError = error;
    } else {
      // Yeni ekle
      const { error } = await supabase
        .from("ads")
        .insert({
          position,
          title,
          subtitle,
          image_url: imageUrl,
          restaurant_id: restaurantId === "null" || !restaurantId ? null : restaurantId
        });
      resultError = error;
    }

    if (resultError) throw resultError;

    revalidatePath("/");
    revalidatePath("/dashboard/admin/sponsorships");
    return { success: true };

  } catch (e: any) {
    console.error("Reklam güncelleme hatası:", e.message);
    return { error: `Reklam kaydedilirken hata oluştu: ${e.message}` };
  }
}
