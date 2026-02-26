"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register } from "../../../lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.message || "Register failed");
      return;
    }
    router.push("/auth/login");
  }

  return (
    <main>
      <h1>Create account</h1>
      <p className="meta">MVP auth registration via Supabase Auth.</p>
      <form className="card auth-form" onSubmit={onSubmit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
        </label>
        <label>
          Password (min 8)
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
        {error ? <p className="auth-error">{error}</p> : null}
      </form>
      <p className="meta">
        Already registered? <Link href="/auth/login">Login</Link>
      </p>
    </main>
  );
}
