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

  const keys = ["hero_title", "categories_title", "featured_title", "how_it_works_title", "marquee_text"];

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

    revalidatePath("/");
    revalidatePath("/dashboard/admin/settings");
    return { success: true };

  } catch (e: any) {
    console.error("Başlık güncellenirken hata:", e.message);
    return { error: `Kaydederken hata oluştu: ${e.message}` };
  }
}
