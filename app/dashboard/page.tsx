import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UploadSection from "./upload-section";
import { FileText, Calendar } from "lucide-react";
import Link from "next/link";

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

  if (!user) redirect("/auth/login");

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, created_at, analyses(id, summary, key_concepts)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const typedCourses = (courses ?? []) as Course[];
  const selectedCourse = selectedCourseId
    ? typedCourses.find((c) => c.id === selectedCourseId)
    : null;
  const analysis = selectedCourse?.analyses?.[0] ?? null;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-anybody font-bold text-white text-xl tracking-tight">
            ETUDIA
          </div>
          <div className="flex items-center gap-4">
            <span className="font-anybody font-light text-white/30 text-sm hidden sm:block">
              {user.email}
            </span>
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="hover:cursor-pointer font-anybody font-light text-white/40 hover:text-white text-sm border border-white/[0.08] hover:border-white/20 rounded-lg px-3 py-1.5 transition-all duration-200"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="flex flex-col gap-8">
            <UploadSection userId={user.id} />

            {selectedCourse && analysis && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="font-anybody font-light text-white/30 text-xs uppercase tracking-widest">
                    Résultats
                  </span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                <section>
                  <h2 className="font-anybody font-bold text-white text-lg mb-3">
                    Résumé — <span className="text-white/50 font-light">{selectedCourse.title}</span>
                  </h2>
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                    <p className="font-anybody font-light text-white/60 text-sm leading-relaxed whitespace-pre-line">
                      {analysis.summary}
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-anybody font-bold text-white text-lg mb-3">
                    Notions clés
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.key_concepts.map((concept, i) => (
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
                    ))}
                  </div>
                </section>
              </div>
            )}

            {selectedCourse && !analysis && (
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 text-center">
                <p className="font-anybody font-light text-white/30 text-sm">
                  Ce cours n&apos;a pas encore été analysé.
                </p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-anybody font-bold text-white text-sm">
                Tes derniers cours
              </h2>
              {typedCourses.length > 0 && (
                <span className="font-anybody font-light text-white/25 text-xs">
                  {typedCourses.length}
                </span>
              )}
            </div>

            {typedCourses.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] border-dashed p-8 text-center">
                <p className="font-anybody font-light text-white/25 text-sm">
                  Aucun cours pour l&apos;instant
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {typedCourses.map((course) => {
                  const hasAnalysis = course.analyses?.length > 0;
                  const isSelected = course.id === selectedCourseId;

                  return (
                    <a
                      key={course.id}
                      href={isSelected ? "/dashboard" : `/dashboard?course=${course.id}`}
                      className={`group flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
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
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
