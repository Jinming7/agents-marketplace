export type AuthResult = {
  ok: boolean;
  message?: string;
  accessToken?: string;
};

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? process.env.BACKEND_BASE_URL ?? "http://localhost:3001";

export async function register(email: string, password: string): Promise<AuthResult> {
  const response = await fetch(`${backendBaseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const payload = await response.json();
  if (!response.ok) return { ok: false, message: payload?.error?.message ?? "Register failed" };
  return { ok: true };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const response = await fetch(`${backendBaseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const payload = await response.json();
  if (!response.ok) return { ok: false, message: payload?.error?.message ?? "Login failed" };
  return { ok: true, accessToken: payload?.session?.accessToken };
}
