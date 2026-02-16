import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UploadSection from "./upload-section";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes cours</h1>
        <LogoutButton />
      </div>

      <UploadSection userId={user.id} />

      <div className="mt-8 space-y-3">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between rounded-lg border border-foreground/10 px-4 py-3"
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
            </div>
          ))
        ) : (
          <p className="text-sm text-foreground/50">
            Aucun cours pour l&apos;instant. Upload ton premier PDF !
          </p>
        )}
      </div>
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
