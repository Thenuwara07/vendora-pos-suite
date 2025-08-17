// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/pos";
import { dummyUsers } from "@/data/dummyData";

type SessionPayload = {
  ok: boolean;
  role: UserRole; // "admin" | "cashier" | "salesman"
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
  };
  token?: string; // optional app JWT if you issue one
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithMosip: (session: SessionPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// Map MOSIP session payload -> your app's User type
function mapMosipToUser(session: SessionPayload): User {
  const name =
    session.user.name ||
    (session.user.email ? session.user.email.split("@")[0] : "MOSIP User");

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name,                              // ✅ User requires `name`
    role: session.role,
    isActive: true,
    createdAt: new Date() // ✅ User requires `createdAt` as Date
  };
}
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load saved user
  useEffect(() => {
    const saved = localStorage.getItem("posUser");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("posUser");
      }
    }
  }, []);

  // Email/password demo login (unchanged)
  const login = async (email: string, _password: string): Promise<boolean> => {
    const foundUser = dummyUsers.find((u) => u.email === email && u.isActive);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("posUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  // NEW: MOSIP login hook — called by your /auth/callback page
  const loginWithMosip = async (session: SessionPayload) => {
    if (!session?.ok) throw new Error("Invalid MOSIP session");
    const mapped = mapMosipToUser(session);

    // If you return an app JWT, you can store in memory or cookie.
    // Avoid localStorage for tokens if possible; prefer HttpOnly cookie from backend.
    // if (session.token) save it via cookie or memory store.

    setUser(mapped);
    localStorage.setItem("posUser", JSON.stringify(mapped));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("posUser");
    // If you set an HttpOnly cookie for session on backend, also call /api/auth/logout here.
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithMosip,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
