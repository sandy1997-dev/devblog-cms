"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon, EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Wrong password. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 dark:bg-amber-500 mb-4">
            <LockIcon size={24} className="text-white dark:text-ink-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-50">DevBlog Admin</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Enter your password to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-ui font-medium text-ink-700 dark:text-ink-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-900 dark:text-ink-100 placeholder:text-ink-400 text-sm outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors"
                required
                autoFocus
              />
              <button type="button" onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200">
                {show ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading || !password}
            className="btn-primary w-full justify-center gap-2 py-2.5">
            {loading ? <><LoaderIcon size={15} className="animate-spin" /> Signing in…</> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-ink-400 mt-4">
          Default password: <code className="bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded text-ink-600 dark:text-ink-400">devblog2024</code>
        </p>
      </div>
    </div>
  );
}
