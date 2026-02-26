import { NextRequest, NextResponse } from "next/server";

// Atlassian Marketplace pattern:
// - Browse apps: NO login required
// - View app details: NO login required  
// - Install app: LOGIN required

export function middleware(req: NextRequest) {
  // All browsing is public - no authentication needed
  return NextResponse.next();
}

export const config = {
  matcher: []
};
