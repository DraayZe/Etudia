import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UploadSection from "./upload-section";
import ProfileMenu from "./profile-menu";
import CourseCard from "./course-card";

interface KeyConcept {
  term: string;
  definition: string;
  example?: string;
  importance?: "principale" | "secondaire";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, plan")
    .eq("user_id", user.id)
    .single();

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
          <ProfileMenu email={user.email!} profile={profile} />
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
                    <p className="font-anybody font-light text-white/75 text-sm leading-loose whitespace-pre-line">
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
                  const isSelected = course.id === selectedCourseId;

                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isSelected={isSelected}
                    />
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
