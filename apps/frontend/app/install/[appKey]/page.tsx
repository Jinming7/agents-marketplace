"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstallPage({ params }: { params: { appKey: string } }) {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is logged in by checking for auth token
    const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
    
    if (!token) {
      // Not logged in - redirect to login with return URL
      router.push(`/auth/login?next=/install/${params.appKey}`);
      return;
    }
    
    // For now, show "Installation coming soon" - actual install flow would connect to backend
    // This is where you'd call the actual install API
  }, [params.appKey, router]);

  return (
    <main>
      <h1>Installing App</h1>
      <p>Preparing installation for {params.appKey}...</p>
      <p className="meta">Installation functionality coming soon.</p>
    </main>
  );
}
