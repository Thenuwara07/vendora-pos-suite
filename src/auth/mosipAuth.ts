// src/auth/mosipAuth.ts
import { UserManager, WebStorageStateStore, Log } from "oidc-client-ts";

const isMock = String(import.meta.env.VITE_MOSIP_MOCK).toLowerCase() === "true";
const authority = import.meta.env.VITE_MOSIP_ISSUER as string | undefined;
const client_id = import.meta.env.VITE_MOSIP_CLIENT_ID as string | undefined;
const redirect_uri = import.meta.env.VITE_MOSIP_REDIRECT_URI as string | undefined;
const scope = (import.meta.env.VITE_MOSIP_SCOPE as string) || "openid profile email";

function isValidUrl(u?: string) {
  try {
    if (!u) return false;
    new URL(u);
    return !u.includes("<"); // block placeholders like <domain>
  } catch {
    return false;
  }
}

let userManager: UserManager | null = null;
if (!isMock && isValidUrl(authority) && client_id && redirect_uri) {
  Log.setLogger(console);
  Log.setLevel(Log.ERROR); // or DEBUG while testing

  userManager = new UserManager({
    authority: authority!,
    client_id: client_id!,
    redirect_uri: redirect_uri!,
    response_type: "code",
    scope,
    loadUserInfo: true,
    automaticSilentRenew: true,
    monitorSession: true,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  });
}

/** Unified API: starts login (real or mock). */
export async function startMosipLogin(): Promise<
  | { mode: "mock"; session: { ok: boolean; role: "admin" | "cashier" | "salesman"; user: any; token?: string } }
  | { mode: "real"; redirected: true }
> {
  if (!userManager) {
    // MOCK path: fabricate a MOSIP-like session
    const fake = {
      ok: true,
      role: "admin" as const, // pick any or randomize if you want
      user: {
        id: "mosip-sub-123",
        email: "john@pos.com",
        name: "John Cashier",
        phone: "+9477XXXXXXX",
      },
      // token: "your-app-jwt-if-you-want-to-simulate",
    };
    return { mode: "mock", session: fake };
  }

  // REAL path
  await userManager.clearStaleState();
  await userManager.signinRedirect();
  return { mode: "real", redirected: true };
}

/** For your /auth/callback page (REAL only). */
export async function handleMosipCallback(): Promise<{
  id_token: string;
  access_token: string;
  claims: any;
}> {
  if (!userManager) {
    throw new Error("MOSIP is in mock mode; no real callback available.");
  }
  const user = await userManager.signinRedirectCallback();
  return {
    id_token: user.id_token!,
    access_token: user.access_token!,
    claims: user.profile,
  };
}
