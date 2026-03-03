import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UploadSection from "./upload-section";

interface KeyConcept {
  term: string;
  definition: string;
}

interface Analysis {
  id: string;
  summary: string;
  key_concepts: KeyConcept[];
}

interface Course {
  id: string;
  title: string;
  created_at: string;
  analyses: Analysis[];
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const supabase = await createClient();
  const { course: selectedCourseId } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, created_at, analyses(id, summary, key_concepts)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const typedCourses = (courses ?? []) as Course[];

  const selectedCourse = selectedCourseId
    ? typedCourses.find((c) => c.id === selectedCourseId)
    : null;

  const analysis = selectedCourse?.analyses?.[0] ?? null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes cours</h1>
        <LogoutButton />
      </div>

      <UploadSection userId={user.id} />

      <div className="mt-8 space-y-3">
        {typedCourses.length > 0 ? (
          typedCourses.map((course) => {
            const hasAnalysis = course.analyses?.length > 0;
            const isSelected = course.id === selectedCourseId;

            return (
              <a
                key={course.id}
                href={
                  isSelected
                    ? "/dashboard"
                    : `/dashboard?course=${course.id}`
                }
                className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-foreground/5 ${
                  isSelected
                    ? "border-foreground/30 bg-foreground/5"
                    : "border-foreground/10"
                }`}
              >
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-foreground/50">
                    {new Date(course.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    hasAnalysis
                      ? "bg-green-500/10 text-green-600"
                      : "bg-foreground/5 text-foreground/40"
                  }`}
                >
                  {hasAnalysis ? "Analysé" : "En attente"}
                </span>
              </a>
            );
          })
        ) : (
          <p className="text-sm text-foreground/50">
            Aucun cours pour l&apos;instant. Upload ton premier PDF !
          </p>
        )}
      </div>

      {selectedCourse && analysis && (
        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-bold">
              Résumé — {selectedCourse.title}
            </h2>
            <div className="mt-3 whitespace-pre-line rounded-lg border border-foreground/10 p-4 text-sm leading-relaxed">
              {analysis.summary}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold">Notions clés</h2>
            <div className="mt-3 space-y-3">
              {analysis.key_concepts.map(
                (concept: KeyConcept, i: number) => (
                  <div
                    key={i}
                    className="rounded-lg border border-foreground/10 p-4"
                  >
                    <p className="font-semibold">{concept.term}</p>
                    <p className="mt-1 text-sm text-foreground/70">
                      {concept.definition}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      )}

      {selectedCourse && !analysis && (
        <div className="mt-10 rounded-lg border border-foreground/10 p-6 text-center text-sm text-foreground/50">
          Ce cours n&apos;a pas encore été analysé.
        </div>
      )}
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/auth/logout" method="post">
      <button
        type="submit"
        className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm transition-colors hover:bg-foreground/5"
      >
        Déconnexion
      </button>
    </form>
  );
}
