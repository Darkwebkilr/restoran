import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RestaurantDetailClient from "./detail-client";

export default async function RestaurantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Restoran verisini sunucuda çek
  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !restaurant) {
    redirect("/restaurants");
  }

  // 2. Kullanıcı rolünü sunucuda çek
  const { data: { user } } = await supabase.auth.getUser();
  let userRole = null;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    userRole = profile?.role;
  }

  return <RestaurantDetailClient restaurant={restaurant} userRole={userRole} />;
}
