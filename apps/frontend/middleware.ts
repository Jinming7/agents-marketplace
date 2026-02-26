import { NextRequest, NextResponse } from "next/server";

// Atlassian Marketplace pattern:
// - Browse apps: NO login required
// - View app details: NO login required  
// - Install app: LOGIN required

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Only protect the /install route (actual installation action)
  const installPath = pathname.startsWith("/install");
  if (installPath) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // All other paths (including /apps/*) are public - no login needed to browse
  return NextResponse.next();
}

export const config = {
  matcher: ["/install/:path*"]
};
