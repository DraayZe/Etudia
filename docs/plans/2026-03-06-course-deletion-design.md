# Design — Suppression de cours

**Date :** 2026-03-06
**Status :** Approuvé

---

## Contexte

Les utilisateurs n'ont pas moyen de supprimer un cours uploadé. La suppression doit effacer à la fois la ligne en BDD (`courses` + `analyses` en cascade) et le PDF dans Supabase Storage (`pdfs` bucket).

---

## Architecture

```
app/
  actions.ts              ← NEW — Server Action deleteCourse(courseId)
  dashboard/
    course-card.tsx       ← NEW — composant client (remplace le <a> inline)
    page.tsx              ← modifié — utilise CourseCard
```

---

## Server Action (`app/actions.ts`)

```ts
"use server"
deleteCourse(courseId: string): Promise<void>
```

1. Récupérer `supabase` server client + user auth
2. Vérifier que le cours appartient à l'user (`courses.user_id = user.id`)
3. Récupérer `file_path` depuis `courses`
4. Supprimer le fichier du Storage : `supabase.storage.from("pdfs").remove([file_path])`
5. Supprimer la ligne `courses` (les `analyses` sont supprimées en cascade via FK)
6. `revalidatePath("/dashboard")`

---

## Composant `CourseCard`

Composant client (`"use client"`) qui remplace le `<a>` dans la liste de cours.

**États locaux :**
- `menuOpen: boolean` — contrôle le dropdown `⋮`
- `confirmOpen: boolean` — contrôle le dialogue de confirmation
- `deleting: boolean` — état de chargement pendant la suppression

**UI :**
- Carte cliquable (navigation vers `?course=id`) identique à l'actuelle
- Bouton `⋮` en haut à droite, visible au hover
- Dropdown : une seule action "Supprimer"
- Dialogue modal overlay : titre "Supprimer ce cours ?", sous-titre "Cette action est irréversible.", boutons "Annuler" + "Supprimer" (rouge)

---

## Gestion d'erreurs

- Si la suppression échoue → message d'erreur dans le dialogue, pas de fermeture
- Fermeture automatique sur succès + `router.refresh()`

---

## Données

Aucune migration nécessaire. La FK `analyses.course_id → courses.id` doit avoir `ON DELETE CASCADE` (à vérifier en BDD).
