import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Check if locale cookie exists, if not set default to 'en'
  const locale = request.cookies.get('locale')?.value || 'en';
  
  const response = NextResponse.next();
  
  // Ensure locale cookie is set
  if (!request.cookies.get('locale')) {
    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)']
};
