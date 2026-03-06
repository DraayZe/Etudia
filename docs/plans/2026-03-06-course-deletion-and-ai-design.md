# Course Deletion + AI Response Design Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Permettre à l'utilisateur de supprimer un cours depuis un menu contextuel ⋮, et améliorer le design de la réponse IA en affichant les champs Pro (example, importance).

**Architecture:** Server Action `deleteCourse` pour la suppression sécurisée (ownership check + Storage + BDD). Nouveau composant client `CourseCard` pour le menu ⋮ et le dialogue de confirmation. Modifications inline dans `page.tsx` pour le design IA.

**Tech Stack:** Next.js 16 App Router, TypeScript 5 strict, Supabase SSR, Tailwind CSS v4, Framer Motion (motion/react déjà installé), Lucide React.

---

### Task 1 : Créer la Server Action `deleteCourse`

**Files:**
- Create: `app/actions.ts`

**Step 1 : Écrire le fichier**

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non autorisé" };

  // Vérifier ownership + récupérer file_path
  const { data: course } = await supabase
    .from("courses")
    .select("id, file_path")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .single();

  if (!course) return { error: "Cours introuvable" };

  // Supprimer le PDF du Storage
  const { error: storageError } = await supabase.storage
    .from("pdfs")
    .remove([course.file_path]);

  if (storageError) {
    console.error("Storage delete error:", storageError);
    // On continue quand même pour supprimer la ligne BDD
  }

  // Supprimer le cours (analyses supprimées en cascade)
  const { error: dbError } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("user_id", user.id);

  if (dbError) return { error: "Erreur lors de la suppression" };

  revalidatePath("/dashboard");
  return {};
}
```

**Step 2 : Vérifier la compilation**

```bash
cd c:/Users/lenny/Sites/etudia && npm run build
```
Expected : 0 erreurs TypeScript.

**Step 3 : Commit**

```bash
git add app/actions.ts
git commit -m "feat: add deleteCourse server action"
```

---

### Task 2 : Créer le composant `CourseCard`

**Files:**
- Create: `app/dashboard/course-card.tsx`

**Step 1 : Écrire le composant**

```tsx
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
  selectedCourseId?: string;
}

export default function CourseCard({ course, isSelected, selectedCourseId }: CourseCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasAnalysis = course.analyses?.length > 0;

  // Fermer le menu si clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteCourse(course.id);
    if (result.error) {
      setDeleteError(result.error);
      setDeleting(false);
      return;
    }
    setConfirmOpen(false);
    // Si le cours supprimé était sélectionné, revenir au dashboard
    if (isSelected) router.push("/dashboard");
    else router.refresh();
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
            className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-white/40 hover:text-white/70"
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
                className="flex items-center gap-2 w-full px-3 py-2 text-sm font-anybody font-light text-red-400 hover:bg-red-500/10 transition-colors"
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
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111] p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <h3 className="font-anybody font-bold text-white text-base mb-1">
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
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] font-anybody font-medium text-sm text-white/60 hover:bg-white/[0.04] transition-colors disabled:opacity-40"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 font-anybody font-medium text-sm text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
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
```

**Step 2 : Vérifier la compilation**

```bash
npm run build
```
Expected : 0 erreurs.

**Step 3 : Commit**

```bash
git add app/dashboard/course-card.tsx
git commit -m "feat: add CourseCard component with delete menu and confirmation dialog"
```

---

### Task 3 : Mettre à jour `page.tsx` pour utiliser `CourseCard`

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1 : Ajouter l'import**

En haut du fichier, ajouter :
```ts
import CourseCard from "./course-card";
```

**Step 2 : Remplacer le bloc `<a>` dans la liste des cours**

Trouver ce bloc dans `page.tsx` (dans le `typedCourses.map`) :
```tsx
return (
  <a
    key={course.id}
    href={isSelected ? "/dashboard" : `/dashboard?course=${course.id}`}
    className={`cursor-pointer group flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
      isSelected
        ? "border-white/15 bg-white/[0.04]"
        : "border-white/[0.06] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
    }`}
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
);
```

Remplacer par :
```tsx
return (
  <CourseCard
    key={course.id}
    course={course}
    isSelected={isSelected}
    selectedCourseId={selectedCourseId}
  />
);
```

**Step 3 : Supprimer les imports Lucide devenus inutiles**

`FileText` et `Calendar` sont maintenant dans `CourseCard`. Retirer ces deux imports de `page.tsx` si plus utilisés ailleurs dans le fichier. Vérifier d'abord avec une recherche rapide dans le fichier.

**Step 4 : Vérifier compilation + lint**

```bash
npm run lint && npm run build
```
Expected : 0 erreurs.

**Step 5 : Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: integrate CourseCard in dashboard, enable course deletion"
```

---

### Task 4 : Améliorer le design de la réponse IA dans `page.tsx`

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1 : Mettre à jour le type `KeyConcept`**

Remplacer :
```ts
interface KeyConcept {
  term: string;
  definition: string;
}
```
Par :
```ts
interface KeyConcept {
  term: string;
  definition: string;
  example?: string;
  importance?: "principale" | "secondaire";
}
```

**Step 2 : Améliorer le résumé**

Remplacer :
```tsx
<p className="font-anybody font-light text-white/60 text-sm leading-relaxed whitespace-pre-line">
  {analysis.summary}
</p>
```
Par :
```tsx
<p className="font-anybody font-light text-white/75 text-sm leading-loose whitespace-pre-line">
  {analysis.summary}
</p>
```

**Step 3 : Enrichir les cartes de notions clés**

Remplacer le contenu de la carte de notion :
```tsx
<div
  key={i}
  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
>
  <p className="font-anybody font-bold text-white text-sm mb-1">
    {concept.term}
  </p>
  <p className="font-anybody font-light text-white/45 text-xs leading-relaxed">
    {concept.definition}
  </p>
</div>
```

Par :
```tsx
<div
  key={i}
  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
>
  <div className="flex items-start justify-between gap-2 mb-1">
    <p className="font-anybody font-bold text-white text-sm">
      {concept.term}
    </p>
    {concept.importance && (
      <span
        className={`flex-shrink-0 text-[0.65rem] font-anybody px-2 py-0.5 rounded-full ${
          concept.importance === "principale"
            ? "bg-violet-500/15 text-violet-400"
            : "bg-white/[0.05] text-white/30"
        }`}
      >
        {concept.importance === "principale" ? "Principale" : "Secondaire"}
      </span>
    )}
  </div>
  <p className="font-anybody font-light text-white/45 text-xs leading-relaxed">
    {concept.definition}
  </p>
  {concept.example && (
    <div className="border-t border-white/[0.06] mt-2 pt-2">
      <p className="font-anybody font-light text-white/35 text-xs italic leading-relaxed">
        Ex : {concept.example}
      </p>
    </div>
  )}
</div>
```

**Step 4 : Vérifier compilation**

```bash
npm run build
```
Expected : 0 erreurs.

**Step 5 : Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: display Pro fields (example, importance) in AI response cards"
```

---

### Task 5 : Test manuel en dev

**Step 1 : Lancer le serveur**
```bash
npm run dev
```

**Step 2 : Tester la suppression**
- Survole une carte de cours → le bouton `⋮` apparaît
- Clique `⋮` → dropdown "Supprimer" apparaît
- Clique "Supprimer" → dialogue de confirmation
- Clique "Annuler" → dialogue se ferme, cours toujours présent
- Clique "Supprimer" dans le dialogue → cours supprimé de la liste
- Vérifie dans Supabase Storage que le PDF est bien supprimé

**Step 3 : Tester le design IA (plan pro)**
- Mets `profiles.plan = 'pro'` pour ton compte dans Supabase
- Analyse un PDF → vérifie que les cartes affichent les badges d'importance et les exemples

**Step 4 : Tester le design IA (plan free)**
- Mets `profiles.plan = 'free'`
- Vérifie que les cartes n'affichent pas de badge ni d'exemple (champs absents → UI propre)
