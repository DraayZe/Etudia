# Design — Amélioration du design de la réponse IA

**Date :** 2026-03-06
**Status :** Approuvé

---

## Contexte

La réponse IA dans `app/dashboard/page.tsx` affiche le résumé et les notions clés, mais :
- Le type `KeyConcept` ne contient que `term` et `definition` — les champs Pro (`example`, `importance`) sont en BDD mais jamais affichés
- Le résumé a une lisibilité faible (`text-white/60`)
- Les cartes de notions sont basiques

---

## Changements dans `app/dashboard/page.tsx`

### Type `KeyConcept`
```ts
interface KeyConcept {
  term: string;
  definition: string;
  example?: string;
  importance?: "principale" | "secondaire";
}
```

### Résumé
- `text-white/60` → `text-white/75`
- `leading-relaxed` → `leading-loose`

### Cartes de notions clés
- Badge `importance` en haut à droite de chaque carte :
  - `"principale"` → fond violet (`bg-violet-500/15 text-violet-400`), texte "Principale"
  - `"secondaire"` → fond blanc (`bg-white/[0.05] text-white/30`), texte "Secondaire"
  - Absent (free) → pas de badge
- Champ `example` affiché sous la définition en italique (`text-white/35 italic text-xs`) si présent, précédé d'un séparateur `border-t border-white/[0.06] mt-2 pt-2`

---

## Pas de nouveaux fichiers

Toutes les modifications sont inline dans `page.tsx`. YAGNI.
