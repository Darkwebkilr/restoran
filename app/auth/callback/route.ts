import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      // Profil bilgisini çekerek rolüne bak
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const role = profile?.role || user.user_metadata?.role || 'customer'
      
      // Role göre yönlendir
      const dashboardPath = role === 'admin' ? '/dashboard/admin' : 
                          role === 'restaurant' ? '/dashboard/restaurant' : 
                          '/dashboard/customer'
      
      return NextResponse.redirect(`${origin}${dashboardPath}`)
    }
  }

  // Hata durumunda giriş sayfasına geri gönder
  return NextResponse.redirect(`${origin}/login?error=auth-code-exchange-failed`)
}
