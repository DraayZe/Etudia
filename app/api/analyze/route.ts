import { createClient } from "@/lib/supabase/server";
import { model } from "@/lib/gemini";
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

  // Verify the course belongs to the user
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .single();

  if (!course) {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  // Download PDF from Supabase Storage
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

  // Convert to base64 for Gemini
  const arrayBuffer = await fileData.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // Send to Gemini
  const prompt = `Tu es un assistant pédagogique expert. Analyse le document PDF suivant et génère :

1. Un **résumé structuré** du cours (3 à 5 paragraphes, clair et pédagogique)
2. Une liste de **notions clés** (entre 5 et 15) avec pour chacune :
   - "term" : le nom du concept/notion
   - "definition" : une définition concise et claire

Réponds UNIQUEMENT avec un JSON valide au format suivant, sans markdown ni backticks :
{
  "summary": "Le résumé ici...",
  "key_concepts": [
    { "term": "Notion 1", "definition": "Définition 1" },
    { "term": "Notion 2", "definition": "Définition 2" }
  ]
}`;

  let parsed: { summary: string; key_concepts: { term: string; definition: string }[] };
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

  // Save analysis in database
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
