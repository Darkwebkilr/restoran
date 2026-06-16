import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Sadece bu yollarda çalıştır:
     * - dashboard (tüm alt yollar)
     * - login (tüm alt yollar)
     * - auth/callback
     */
    '/dashboard/:path*',
    '/login/:path*',
    '/auth/:path*',
  ],
}
