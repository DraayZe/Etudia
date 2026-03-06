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

  if (dbError) {
    console.error("DB delete error:", dbError);
    return { error: "Erreur lors de la suppression" };
  }

  revalidatePath("/dashboard");
  return {};
}
