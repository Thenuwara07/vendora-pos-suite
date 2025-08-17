// LoginForm.tsx
import React, { useState } from "react";
import { Store, Users, ShoppingCart, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * NOTE:
 * - We call your real useAuth().login(email, password) so your existing
 *   ProtectedRoutes / role-based redirects keep working.
 * - If you prefer to navigate right here, see the optional snippet at the bottom.
 */

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<"" | "email" | "password">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        toast({
          title: "Login Successful",
          description: "Welcome to POS System",
        });
        // We rely on your app-level routing after auth state changes.
        // If you want to navigate here, see the optional snippet below.
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or inactive account",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: "admin" | "cashier" | "salesman") => {
    const creds: Record<typeof role, string> = {
      admin: "admin@pos.com",
      cashier: "john@pos.com",
      salesman: "mike@pos.com",
    };
    setEmail(creds[role]);
    setPassword("password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-900/70 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
          {/* Header */}
          <div className="text-center p-8 pb-4">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                <Store className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-ping" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full" />
            </div>

            <h1 className="text-4xl font-extrabold text-white tracking-tight">POS System</h1>
            <p className="text-white/70 text-base mt-1">Professional Point of Sale Solution</p>
          </div>

          {/* Body */}
          <div className="px-8 pb-8">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white">Login to your account</h2>
              <p className="text-white/60 text-sm">Enter your credentials to access the system</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/90">
                  Email
                </label>
                <div
                  className={`relative transition-all duration-300 ${
                    focusedInput === "email" ? "scale-[1.02]" : ""
                  }`}
                >
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput("")}
                    placeholder="you@pos.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  {focusedInput === "email" && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 -z-10 blur-sm" />
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/90">
                  Password
                </label>
                <div
                  className={`relative transition-all duration-300 ${
                    focusedInput === "password" ? "scale-[1.02]" : ""
                  }`}
                >
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput("")}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {focusedInput === "password" && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 -z-10 blur-sm" />
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-60 relative overflow-hidden group"
              >
                {isLoading ? "Logging in..." : "Login"}
                {!isLoading && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
              </button>
            </form>

            {/* Quick login */}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <span className="text-white/70 text-sm">Quick Login (Demo)</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => quickLogin("admin")}
                  className="group p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  type="button"
                >
                  <Users className="w-5 h-5 text-purple-300 mx-auto mb-1" />
                  <span className="text-xs text-white/80 group-hover:text-white">Admin</span>
                </button>

                <button
                  onClick={() => quickLogin("cashier")}
                  className="group p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  type="button"
                >
                  <ShoppingCart className="w-5 h-5 text-blue-300 mx-auto mb-1" />
                  <span className="text-xs text-white/80 group-hover:text-white">Cashier</span>
                </button>

                <button
                  onClick={() => quickLogin("salesman")}
                  className="group p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  type="button"
                >
                  <Store className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                  <span className="text-xs text-white/80 group-hover:text-white">Salesman</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-white/40 text-xs">Secure • Reliable • Modern</p>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-400 rounded-full opacity-60 animate-bounce" />
        <div className="absolute -top-2 -right-6 w-4 h-4 bg-blue-400 rounded-full opacity-40 animate-bounce" />
        <div className="absolute -bottom-4 -right-2 w-6 h-6 bg-pink-400 rounded-full opacity-50 animate-bounce" />
      </div>
    </div>
  );
};

export default LoginForm;

/* --------------------------
OPTIONAL: navigate right here
-----------------------------
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

...after ok === true in handleSubmit:
  // If your login() returns role, you can branch here. Otherwise push to a generic page.
  navigate("/dashboard", { replace: true });
  // or navigate(roleRouteMap[role] ?? "/dashboard", { replace: true });
*/
