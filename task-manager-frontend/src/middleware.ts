import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Récupérer le token depuis les cookies
  const token = request.cookies.get('auth_token')?.value
  
  // Vérifier si l'utilisateur est sur une page d'authentification
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')
  
  // Si l'utilisateur n'est pas connecté et n'est pas sur une page d'authentification
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Si l'utilisateur est connecté et essaie d'accéder à une page d'authentification
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 