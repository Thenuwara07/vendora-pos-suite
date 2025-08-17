// src/pages/AuthCallback.tsx
import React, { useEffect } from "react";
import { handleMosipCallback } from "@/auth/mosipAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthCallback: React.FC = () => {
  const { loginWithMosip } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Only works in REAL mode; mock mode never redirects here.
        const { id_token, access_token, claims } = await handleMosipCallback();

        const res = await fetch("/api/auth/mosip/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id_token, access_token, claims }),
        });
        if (!res.ok) throw new Error("MOSIP verification failed");

        const session = await res.json(); // { ok, role, user, token? }
        await loginWithMosip(session);

        const roleRouteMap: Record<string, string> = {
          admin: "/admin",
          cashier: "/cashier",
          salesman: "/sales",
        };
        navigate(roleRouteMap[session.role] ?? "/dashboard", { replace: true });
      } catch (e) {
        console.error(e);
        navigate("/login?error=mosip", { replace: true });
      }
    })();
  }, [loginWithMosip, navigate]);

  return <div className="min-h-screen grid place-items-center text-white">Processing MOSIP login…</div>;
};

export default AuthCallback;
