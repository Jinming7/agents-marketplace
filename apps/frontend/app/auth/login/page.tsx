"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { login } from "../../../lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    setNextPath(url.searchParams.get("next") || "/");
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok || !result.accessToken) {
      setError(result.message || "Login failed");
      return;
    }

    document.cookie = `auth_token=${result.accessToken}; Path=/; Max-Age=86400; SameSite=Lax`;
    router.push(nextPath);
  }

  return (
    <main>
      <h1>Login</h1>
      <p className="meta">Sign in to access protected app detail pages.</p>
      <form className="card" onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        {error ? <p style={{ color: "#b42318" }}>{error}</p> : null}
      </form>
      <p className="meta">
        No account? <Link href="/auth/register">Create one</Link>
      </p>
    </main>
  );
}
