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

  if (!name || !address) {
      return { error: "İşletme adı ve adres alanları zorunludur." };
  }

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
