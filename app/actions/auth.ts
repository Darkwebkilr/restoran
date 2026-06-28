"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const translateError = (message: string) => {
  if (message.includes("Invalid login credentials")) return "E-posta veya şifre hatalı.";
  if (message.includes("User already registered")) return "Bu e-posta adresi zaten kullanımda.";
  if (message.includes("Password should be at least")) return "Şifre en az 6 karakter olmalıdır.";
  if (message.includes("valid email")) return "Lütfen geçerli bir e-posta adresi girin.";
  return `Hata: ${message}`;
};

export async function loginWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google Login Hatası:", error.message);
    return redirect("/login?error=google-failed");
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return { error: translateError(error.message), email };
  }

  revalidatePath("/", "layout");
  return redirect("/");
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const restaurantName = formData.get("restaurantName") as string;
  const role = (formData.get("role") as string) || "customer";
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  let redirectUrl = "";
  try {
    const supabase = await createClient();
    const password = formData.get("password") as string;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: role } },
    });

    if (error) return { error: translateError(error.message), email, fullName, restaurantName };

    if (role === "restaurant" && data.user) {
      await supabase.from("restaurants").insert({
        owner_id: data.user.id,
        name: restaurantName || "Yeni Restoran",
        status: "pending",
        category: category || "Dünya Mutfağı",
        description: description || "",
        address: address || "Belirtilmedi",
        phone: phone || "Belirtilmedi",
        slug: (restaurantName || "Yeni Restoran").toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      });
    }

    if (data.session) {
      // E-posta onayı kapalıysa (direkt giriş yaptıysa) yönlendir
      redirectUrl = role === "restaurant" ? "/dashboard/restaurant" : "/";
    } else {
      // E-posta onayı gerekiyorsa bilgi mesajı dön
      return { 
        success: true, 
        message: "Başvurunuz alındı. E-posta adresinize gönderilen doğrulama bağlantısına tıklayarak hesabınızı aktif edin.", 
        email, 
        fullName, 
        restaurantName 
      };
    }
  } catch (e: any) {
    return { error: `Kayıt sırasında bir hata oluştu: ${e.message}`, email, fullName, restaurantName };
  }

  if (redirectUrl) {
    revalidatePath("/", "layout");
    redirect(redirectUrl);
  }
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
