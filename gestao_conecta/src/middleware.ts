import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isTransparenciaRoute = request.nextUrl.pathname.startsWith('/transparencia')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  const isDocsRoute = request.nextUrl.pathname.startsWith('/desenvolvedores/docs')

  if (!user && !isAuthRoute && !isTransparenciaRoute && !isApiRoute && !isDocsRoute && request.nextUrl.pathname !== '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // ---- INACTIVITY CHECK START ----
    const lastActivityCookie = request.cookies.get('last_activity')
    const now = Date.now()
    const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
    
    if (lastActivityCookie) {
      const lastActivity = parseInt(lastActivityCookie.value, 10)
      if (now - lastActivity > INACTIVITY_TIMEOUT_MS) {
        // Log out user due to inactivity
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'session_expired')
        
        const redirectResponse = NextResponse.redirect(url)
        redirectResponse.cookies.delete('last_activity')
        return redirectResponse
      }
    }
    
    // Update last_activity cookie
    supabaseResponse.cookies.set('last_activity', now.toString(), {
      path: '/',
      maxAge: 30 * 60, // 30 minutes
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    // ---- INACTIVITY CHECK END ----

    // Fetch user role
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select(`
        roles (
          name,
          access_level
        )
      `)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Middleware role query error:', error)
    }

    const roleObj = Array.isArray(roleData?.roles) ? roleData?.roles[0] : roleData?.roles
    const role = roleObj?.name || 'USER'
    const accessLevel = roleObj?.access_level || 0

    if (request.nextUrl.pathname.startsWith('/dashboard/auditoria') && accessLevel < 3) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      url.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(url)
    }

    if (role === 'USER' && !isAuthRoute && !isTransparenciaRoute) {
      // Redireciona cidadãos normais para fora ou desloga
      // Como o portal web é só para admin, manda para login com erro
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'unauthorized')
      // Pode ser necessário fazer signout aqui, mas no middleware é apenas redirect
      return NextResponse.redirect(url)
    }

    if (isAuthRoute && role !== 'USER') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    
    if (request.nextUrl.pathname === '/' && role !== 'USER') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
