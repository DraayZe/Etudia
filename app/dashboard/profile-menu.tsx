"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Crown, LogOut, Settings, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  plan: string;
}

interface ProfileMenuProps {
  email: string;
  profile: Profile | null;
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
  return email[0].toUpperCase();
}

function Avatar({
  avatarUrl,
  initials,
  size = "sm",
}: {
  avatarUrl: string | null;
  initials: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-9 h-9" : "w-10 h-10";
  return (
    <div
      className={`${dim} rounded-full overflow-hidden flex items-center justify-center flex-shrink-0`}
      style={!avatarUrl ? { background: "rgba(139,92,246,0.2)" } : {}}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="font-anybody text-xs font-medium text-violet-300">{initials}</span>
      )}
    </div>
  );
}

export default function ProfileMenu({ email, profile }: ProfileMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const initials = getInitials(profile?.full_name ?? null, email);
  const avatarUrl = profile?.avatar_url ?? null;
  const plan = profile?.plan ?? "free";

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.refresh();
    }, 1500);
  }

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="cursor-pointer border border-white/10 hover:border-white/20 rounded-full transition-all duration-200 hover:scale-105"
        >
          <Avatar avatarUrl={avatarUrl} initials={initials} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 w-64 rounded-2xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Avatar avatarUrl={avatarUrl} initials={initials} />
                  <div className="min-w-0">
                    {profile?.full_name && (
                      <p className="font-anybody font-medium text-white text-sm truncate">
                        {profile.full_name}
                      </p>
                    )}
                    <p className="font-anybody font-light text-white/40 text-xs truncate">{email}</p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-anybody ${plan === "pro"
                      ? "bg-violet-500/15 text-violet-300"
                      : "bg-white/[0.06] text-white/30"
                      }`}
                  >
                    {plan === "pro" && <Crown size={10} />}
                    {plan === "pro" ? "Pro" : "Gratuit"}
                  </span>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowSettings(true);
                  }}
                  className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left font-anybody font-light text-white/60 text-sm hover:text-white hover:bg-white/[0.05] transition-all duration-150"
                >
                  <Settings size={14} className="text-white/30" />
                  Paramètres du compte
                </button>
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left font-anybody font-light text-white/60 text-sm hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-150"
                  >
                    <LogOut size={14} className="text-white/30" />
                    Déconnexion
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 z-50"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <h2 className="font-anybody font-bold text-white text-base">
                    Paramètres du compte
                  </h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.05] transition-all duration-150"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block font-anybody font-medium text-white/40 text-xs mb-1.5 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] font-anybody font-light text-white/40 text-sm select-all">
                      {email}
                    </div>
                  </div>

                  <div>
                    <label className="block font-anybody font-medium text-white/40 text-xs mb-1.5 uppercase tracking-wider">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ton prénom et nom"
                      className="block w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] font-anybody font-light text-white text-sm placeholder-white/20 outline-none focus:border-white/20 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-anybody font-medium text-white/40 text-xs mb-1.5 uppercase tracking-wider">
                      Plan actuel
                    </label>
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      <span
                        className={`font-anybody font-medium text-sm ${plan === "pro" ? "text-violet-300" : "text-white/50"
                          }`}
                      >
                        {plan === "pro" ? "Pro" : "Gratuit"}
                      </span>
                      {plan !== "pro" && (
                        <button className="cursor-pointer font-anybody font-medium text-xs text-violet-400 hover:text-violet-300 transition-colors">
                          Passer au Pro →
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="cursor-pointer font-anybody font-light text-white/40 text-sm hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="cursor-pointer px-4 py-2 rounded-xl font-anybody font-medium text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                    style={{
                      background: saved ? "rgb(52,211,153)" : "rgb(139,92,246)",
                    }}
                  >
                    {saving ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
