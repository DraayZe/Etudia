import { createClient } from "@/lib/supabase/server";
import { getAnalysisConfig, type Plan } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Fix 5: Guard request.json()
  let courseId: unknown, filePath: unknown;
  try {
    ({ courseId, filePath } = await request.json());
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  if (!courseId || !filePath) {
    return NextResponse.json(
      { error: "courseId et filePath requis" },
      { status: 400 }
    );
  }

  // Fix 2: Select file_path from DB to avoid IDOR / path traversal
  const { data: course } = await supabase
    .from("courses")
    .select("id, file_path")
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

  // Fix 4: Cast plan to Plan type
  const plan = (profile?.plan ?? "free") as Plan;
  const { model, prompt } = getAnalysisConfig(plan);

  // Fix 2: Use course.file_path from DB instead of client-supplied filePath
  const { data: fileData, error: downloadError } = await supabase.storage
    .from("pdfs")
    .download(course.file_path);

  if (downloadError || !fileData) {
    console.error("Download error:", downloadError);
    return NextResponse.json(
      { error: "Impossible de télécharger le fichier" },
      { status: 500 }
    );
  }

  const arrayBuffer = await fileData.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // Fix 3: Proper KeyConcept type placed outside the try block
  type KeyConcept = { term: string; definition: string; example?: string; importance?: string };
  let parsed: { summary: string; key_concepts: KeyConcept[] };
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

    // Fix 3: Runtime validation of Gemini response shape
    if (typeof parsed.summary !== "string" || !Array.isArray(parsed.key_concepts)) {
      return NextResponse.json({ error: "Réponse IA invalide" }, { status: 500 });
    }
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
