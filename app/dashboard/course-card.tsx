"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Calendar, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { deleteCourse } from "@/app/actions";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    created_at: string;
    analyses: { id: string }[];
  };
  isSelected: boolean;
}

export default function CourseCard({ course, isSelected }: CourseCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasAnalysis = course.analyses.length > 0;

  // Fermer le menu si clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !deleting) setConfirmOpen(false);
    }
    if (confirmOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmOpen, deleting]);

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteCourse(course.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setConfirmOpen(false);
      if (isSelected) router.push("/dashboard");
      else router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        className={`relative group flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
          isSelected
            ? "border-white/15 bg-white/[0.04]"
            : "border-white/[0.06] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
        }`}
      >
        {/* Zone cliquable principale */}
        <a
          href={isSelected ? "/dashboard" : `/dashboard?course=${course.id}`}
          className="flex items-start gap-3 flex-1 min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText size={14} className="text-white/40" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-anybody font-medium text-white/80 text-sm truncate">
              {course.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar size={10} className="text-white/20 flex-shrink-0" />
              <span className="font-anybody font-light text-white/25 text-xs">
                {new Date(course.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span
                className={`ml-auto text-xs font-anybody px-2 py-0.5 rounded-full flex-shrink-0 ${
                  hasAnalysis
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-white/[0.05] text-white/25"
                }`}
              >
                {hasAnalysis ? "Analysé" : "En attente"}
              </span>
            </div>
          </div>
        </a>

        {/* Bouton menu ⋮ */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen((v) => !v);
            }}
            aria-label="Options du cours"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            className="hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-white/40 hover:text-white/70"
          >
            <MoreVertical size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 z-20 w-36 rounded-xl border border-white/[0.08] bg-[#111] shadow-xl py-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  setConfirmOpen(true);
                }}
                className="hover:cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-sm font-anybody font-light text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dialogue de confirmation */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !deleting && setConfirmOpen(false)}
          />
          <div role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111] p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 id="delete-dialog-title" className="font-anybody font-bold text-white text-base mb-1">
              Supprimer ce cours ?
            </h3>
            <p className="font-anybody font-light text-white/40 text-sm mb-1">
              {course.title}
            </p>
            <p className="font-anybody font-light text-white/30 text-xs mb-6">
              Cette action est irréversible. Le PDF et l&apos;analyse seront supprimés.
            </p>

            {deleteError && (
              <p className="mb-4 font-anybody font-light text-red-400 text-sm">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="hover:cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] font-anybody font-medium text-sm text-white/60 hover:bg-white/[0.04] transition-colors disabled:opacity-40"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="hover:cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 font-anybody font-medium text-sm text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
