"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

    revalidatePath(`/restaurant/${restaurantId}`);
    return { success: true, reservation };

  } catch (e: any) {
    console.error("Rezervasyon hatası:", e.message);
    return { error: `Rezervasyon oluşturulurken bir hata oluştu: ${e.message}` };
  }
}
