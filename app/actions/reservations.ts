"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendReservationEmail } from "@/utils/email";

function generateReservationCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "RZV-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function makeReservation(prevState: any, formData: FormData) {
  if (!formData) return { error: "Form verileri eksik." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Rezervasyon yapmak için giriş yapmalısınız." };

  const restaurantId = formData.get("restaurantId") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const partySizeStr = formData.get("partySize") as string;

  if (!restaurantId || !date || !time || !partySizeStr) {
    return { error: "Lütfen tüm alanları doldurun ve bir saat seçin." };
  }

  const partySize = parseInt(partySizeStr);

  try {
    const { data: existingReservations, error: countError } = await supabase
      .from("reservations")
      .select("party_size")
      .eq("restaurant_id", restaurantId)
      .eq("reservation_date", date)
      .eq("reservation_time", time)
      .neq("status", "cancelled");

    if (countError) throw countError;

    const currentTotal = existingReservations?.reduce((sum, res) => sum + res.party_size, 0) || 0;
    const MAX_CAPACITY = 20;

    if (currentTotal + partySize > MAX_CAPACITY) {
      return { error: "Maalesef bu saat için kapasite dolu. Lütfen başka bir saat seçin." };
    }

    const { data: reservation, error: resError } = await supabase
      .from("reservations")
      .insert({
        restaurant_id: restaurantId,
        customer_id: user.id,
        reservation_date: date,
        reservation_time: time,
        party_size: partySize,
        status: "confirmed",
        code: generateReservationCode()
      })
      .select()
      .single();

    if (resError) throw resError;

    // E-posta göndermek için gerekli restoran ve müşteri bilgilerini sorgula
    try {
      // Restoran adını al
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("name")
        .eq("id", restaurantId)
        .single();
      const restaurantName = restaurant?.name || "Seçilen Restoran";

      // Müşteri adını profil tablosundan al
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      const customerName = profile?.full_name || user.email?.split("@")[0] || "Müşteri";

      // Rezervasyon başarılı mesajını hemen dönmek için e-postayı arka planda bekletmeden gönderiyoruz
      sendReservationEmail({
        to: user.email!,
        customerName,
        restaurantName,
        date,
        time,
        partySize,
        code: reservation.code
      }).catch(err => console.error("E-posta gönderme hatası:", err));
    } catch (emailError) {
      console.error("E-posta gönderim aşamasında hata:", emailError);
    }

    revalidatePath(`/restaurant/${restaurantId}`);
    return { success: true, reservation };

  } catch (e: any) {
    console.error("Rezervasyon hatası:", e.message);
    return { error: `Rezervasyon oluşturulurken bir hata oluştu: ${e.message}` };
  }
}
