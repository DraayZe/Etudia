# Design — Prompts d'analyse différenciés par plan (Free / Pro)

**Date :** 2026-03-06
**Feature :** Résumé + Notions clés
**Status :** Approuvé

---

## Contexte

Le prompt d'analyse actuel (`app/api/analyze/route.ts`) est unique pour tous les utilisateurs et utilise `gemini-2.5-flash`. L'objectif est de différencier l'expérience selon le plan de l'utilisateur (`profiles.plan`).

---

## Architecture

```
lib/
  gemini.ts        ← existant — instanciation du client Gemini
  prompts.ts       ← NEW — getAnalysisConfig(plan) : { model, prompt }
app/api/analyze/
  route.ts         ← modifié — lit profiles.plan, utilise getAnalysisConfig()
```

---

## Schémas de sortie JSON

### Free
```json
{
  "summary": "string",
  "key_concepts": [
    { "term": "string", "definition": "string" }
  ]
}
```

### Pro
```json
{
  "summary": "string",
  "key_concepts": [
    {
      "term": "string",
      "definition": "string",
      "example": "string",
      "importance": "principale" | "secondaire"
    }
  ]
}
```

---

## Prompts

### Free — `gemini-2.5-flash`
- Résumé : 3-5 paragraphes, clair et pédagogique
- Notions clés : 5-15 concepts (term + definition concise)
- JSON strict, sans markdown

### Pro — `gemini-2.5-pro`
- Résumé : 5-8 paragraphes, structuré par grandes parties du cours
- Notions clés : 10-25 concepts (term + definition + example + importance)
- Classées par importance décroissante
- JSON strict, sans markdown

---

## Changements dans `route.ts`

1. Récupérer `profiles.plan` pour l'utilisateur connecté
2. Appeler `getAnalysisConfig(plan)` → `{ model, prompt }`
3. Utiliser le modèle et le prompt retournés
4. Fallback `"free"` si profil introuvable ou plan inconnu
5. Stocker le résultat enrichi (Pro ajoute `example` et `importance` dans `key_concepts`)

---

## Types TypeScript

```ts
// Free
type KeyConceptFree = { term: string; definition: string }

// Pro
type KeyConceptPro = {
  term: string
  definition: string
  example: string
  importance: "principale" | "secondaire"
}

type AnalysisResult =
  | { summary: string; key_concepts: KeyConceptFree[] }
  | { summary: string; key_concepts: KeyConceptPro[] }
```
