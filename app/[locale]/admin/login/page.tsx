"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(t("login_error"));
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(t("login_error"));
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-light flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brown-dark mb-1">
            ToiME Admin
          </h1>
          <p className="text-sm text-text-muted">{t("login_subtitle")}</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl p-8 border border-border/40 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-cream-light/50 focus:outline-none focus:border-brown focus:ring-1 focus:ring-brown/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light mb-1.5">
                {t("password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-cream-light/50 focus:outline-none focus:border-brown focus:ring-1 focus:ring-brown/20"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl mt-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-brown text-white rounded-xl text-sm font-semibold hover:bg-brown-dark transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? t("logging_in") : t("login")}
          </button>
        </form>
      </div>
    </main>
  );
}
