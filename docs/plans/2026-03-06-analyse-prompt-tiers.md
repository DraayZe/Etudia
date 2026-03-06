# Analyse Prompt Tiers (Free / Pro) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Différencier le modèle Gemini et la richesse du prompt d'analyse selon le plan de l'utilisateur (`free` → `gemini-2.5-flash`, `pro` → `gemini-2.5-pro`).

**Architecture:** Créer `lib/prompts.ts` qui expose `getAnalysisConfig(plan)` retournant `{ model, prompt }`. La route `/api/analyze` récupère `profiles.plan` puis délègue à cette fonction. Aucune duplication de logique PDF/DB.

**Tech Stack:** Next.js 16 App Router, TypeScript 5 strict, `@google/generative-ai`, Supabase SSR client.

---

### Task 1 : Créer `lib/prompts.ts`

**Files:**
- Create: `lib/prompts.ts`

**Step 1 : Écrire le fichier**

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const FREE_MODEL = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const PRO_MODEL = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

const FREE_PROMPT = `Tu es un assistant pédagogique expert. Analyse ce document PDF et génère :

1. Un **résumé structuré** du cours (3 à 5 paragraphes, clair et pédagogique)
2. Entre 5 et 15 **notions clés**, avec pour chacune :
   - "term" : le nom du concept
   - "definition" : une définition concise et claire

Réponds UNIQUEMENT avec un JSON valide, sans markdown ni backticks :
{
  "summary": "...",
  "key_concepts": [
    { "term": "...", "definition": "..." }
  ]
}`;

const PRO_PROMPT = `Tu es un expert pédagogique. Analyse ce document PDF en profondeur et génère :

1. Un **résumé complet et détaillé** du cours (5 à 8 paragraphes), structuré par grandes parties, avec introduction et conclusion
2. Entre 10 et 25 **notions clés**, classées par importance décroissante, avec pour chacune :
   - "term" : le nom du concept
   - "definition" : une définition précise et complète
   - "example" : un exemple concret d'application ou d'illustration
   - "importance" : "principale" ou "secondaire"

Réponds UNIQUEMENT avec un JSON valide, sans markdown ni backticks :
{
  "summary": "...",
  "key_concepts": [
    { "term": "...", "definition": "...", "example": "...", "importance": "principale" }
  ]
}`;

export function getAnalysisConfig(plan: string) {
  if (plan === "pro") {
    return { model: PRO_MODEL, prompt: PRO_PROMPT };
  }
  return { model: FREE_MODEL, prompt: FREE_PROMPT };
}
```

**Step 2 : Vérifier la compilation TypeScript**

```bash
npm run build
```
Expected : aucune erreur TypeScript sur `lib/prompts.ts`.

**Step 3 : Commit**

```bash
git add lib/prompts.ts
git commit -m "feat: add getAnalysisConfig with free/pro prompts and models"
```

---

### Task 2 : Mettre à jour `app/api/analyze/route.ts`

**Files:**
- Modify: `app/api/analyze/route.ts`

**Step 1 : Remplacer l'import du modèle et ajouter getAnalysisConfig**

Remplacer :
```ts
import { model } from "@/lib/gemini";
```
Par :
```ts
import { getAnalysisConfig } from "@/lib/prompts";
```

**Step 2 : Récupérer le plan depuis `profiles` juste après la vérification du cours**

Ajouter ce bloc après la vérification `if (!course)` (ligne ~34) :

```ts
// Fetch user plan
const { data: profile } = await supabase
  .from("profiles")
  .select("plan")
  .eq("user_id", user.id)
  .single();

const { model, prompt } = getAnalysisConfig(profile?.plan ?? "free");
```

**Step 3 : Supprimer l'ancienne constante `prompt`**

Supprimer le bloc `const prompt = \`Tu es un assistant...\`` (lignes ~55-69).

**Step 4 : La route complète doit ressembler à ceci après modification**

```ts
import { createClient } from "@/lib/supabase/server";
import { getAnalysisConfig } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { courseId, filePath } = await request.json();

  if (!courseId || !filePath) {
    return NextResponse.json(
      { error: "courseId et filePath requis" },
      { status: 400 }
    );
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .single();

  if (!course) {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  // Fetch user plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const { model, prompt } = getAnalysisConfig(profile?.plan ?? "free");

  const { data: fileData, error: downloadError } = await supabase.storage
    .from("pdfs")
    .download(filePath);

  if (downloadError || !fileData) {
    console.error("Download error:", downloadError);
    return NextResponse.json(
      { error: "Impossible de télécharger le fichier" },
      { status: 500 }
    );
  }

  const arrayBuffer = await fileData.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  let parsed: { summary: string; key_concepts: Record<string, string>[] };
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
      prompt,
    ]);

    const responseText = result.response.text();

    const cleanJson = responseText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    parsed = JSON.parse(cleanJson);
  } catch (err: unknown) {
    console.error("Gemini/parse error:", err);
    const message =
      err instanceof Error && err.message?.includes("429")
        ? "Quota Gemini dépassé. Réessaie dans quelques minutes."
        : "Erreur lors de l'analyse du document";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: analysis, error: insertError } = await supabase
    .from("analyses")
    .insert({
      course_id: courseId,
      summary: parsed.summary,
      key_concepts: parsed.key_concepts,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Insert error:", insertError);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }

  return NextResponse.json({ analysis });
}
```

**Step 5 : Vérifier compilation + lint**

```bash
npm run lint && npm run build
```
Expected : 0 erreurs, 0 warnings bloquants.

**Step 6 : Commit**

```bash
git add app/api/analyze/route.ts
git commit -m "feat: use plan-aware model and prompt in analyze route"
```

---

### Task 3 : Supprimer l'ancien export `model` de `lib/gemini.ts` si inutilisé

**Files:**
- Modify: `lib/gemini.ts`

**Step 1 : Vérifier si `model` est encore importé ailleurs**

```bash
grep -r "from \"@/lib/gemini\"" app/ lib/
```
Expected : aucun résultat (plus aucun fichier n'importe depuis `lib/gemini.ts`).

**Step 2 : Si aucun résultat, simplifier `lib/gemini.ts`**

Remplacer le contenu par :
```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
```
(On garde `genAI` exporté car `lib/prompts.ts` en a besoin — ou on peut l'inliner dans `prompts.ts` et supprimer `gemini.ts` entièrement.)

> Note : si d'autres fichiers importent `lib/gemini.ts`, ne pas le modifier.

**Step 3 : Vérifier compilation**

```bash
npm run build
```
Expected : 0 erreurs.

**Step 4 : Commit**

```bash
git add lib/gemini.ts
git commit -m "refactor: remove unused model export from gemini.ts"
```

---

### Task 4 : Test manuel en dev

**Step 1 : Lancer le serveur de dev**

```bash
npm run dev
```

**Step 2 : Tester avec un utilisateur free**
- Connecte-toi avec un compte dont `profiles.plan = 'free'` (ou NULL)
- Upload un PDF et déclenche l'analyse
- Vérifie dans Supabase (table `analyses`) que `key_concepts` contient uniquement `term` + `definition`

**Step 3 : Tester avec un utilisateur pro**
- Mets à jour manuellement `profiles.plan = 'pro'` pour ton compte dans Supabase
- Re-analyse un PDF
- Vérifie que `key_concepts` contient `term` + `definition` + `example` + `importance`

**Step 4 : Commit final si tout est OK**

```bash
git add .
git commit -m "feat: differentiate analysis prompts and models by user plan"
```
