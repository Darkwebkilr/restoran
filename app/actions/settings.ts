"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettingsByAdmin(prevState: any, formData: FormData) {
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

  const keys = [
    "hero_title", 
    "categories_title", 
    "featured_title", 
    "how_it_works_title", 
    "marquee_text",
    "site_logo_url",
    "social_facebook",
    "social_instagram",
    "social_x",
    "social_tiktok",
    "social_telegram",
    "whatsapp_number"
  ];

  try {
    for (const key of keys) {
      const value = formData.get(key) as string;
      if (value !== null) {
        const { error } = await supabase
          .from("settings")
          .upsert({ key, value });
        if (error) throw error;
      }
    }

    const marqueeIdsJson = formData.get("marquee_restaurant_ids") as string;
    if (marqueeIdsJson) {
      try {
        const selectedIds = JSON.parse(marqueeIdsJson) as string[];
        // 1. Reset all show_in_marquee to false
        await supabase
          .from("restaurants")
          .update({ show_in_marquee: false })
          .eq("status", "approved");
        
        // 2. Set show_in_marquee = true for selected ones
        if (selectedIds.length > 0) {
          const { error: marqueeError } = await supabase
            .from("restaurants")
            .update({ show_in_marquee: true })
            .in("id", selectedIds);
          if (marqueeError) throw marqueeError;
        }
      } catch (err: any) {
        console.warn("restaurants tablosunda show_in_marquee güncellemesi başarısız oldu:", err.message);
      }
    }

    revalidatePath("/");
    revalidatePath("/dashboard/admin/settings");
    return { success: true };

  } catch (e: any) {
    console.error("Başlık güncellenirken hata:", e.message);
    return { error: `Kaydederken hata oluştu: ${e.message}` };
  }
}

export async function updateAdFrequency(frequency: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Yetkisiz erişim." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { error: "Bu işlem için admin yetkisi gerekiyor." };
    }

    const { error } = await supabase
        .from("settings")
        .upsert({ key: "featured_ad_frequency", value: frequency });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/dashboard/admin/featured-ads");
    return { success: true };
}
