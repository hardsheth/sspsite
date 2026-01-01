import { auth } from "@/auth"
import { NextRequest } from "next/server"

export default auth((req: NextRequest) => {
  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signin')
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')

  if (isApiAuthRoute) {
    return
  }

  if (isAuthPage) {
    if (isAuth) {
      return Response.redirect(new URL('/dashboard', req.nextUrl))
    }
    return
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return Response.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl)
    );
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
