"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  Zap,
  Brain,
  MessageSquare,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";

type Step = "idle" | "uploading" | "select_feature" | "generating" | "done";

const features = [
  {
    id: "summary",
    icon: FileText,
    title: "Résumé & Notions clés",
    description: "Un résumé structuré et les concepts essentiels du cours.",
    accent: "#a78bfa",
    available: true,
  },
  {
    id: "quiz",
    icon: Zap,
    title: "Quiz adaptatif",
    description: "Des QCM générés depuis ton cours pour tester tes connaissances.",
    accent: "#f472b6",
    available: false,
  },
  {
    id: "flashcards",
    icon: Brain,
    title: "Flashcards IA",
    description: "Des cartes mémo avec répétition espacée pour mémoriser durablement.",
    accent: "#fb923c",
    available: false,
  },
  {
    id: "chat",
    icon: MessageSquare,
    title: "Tuteur IA",
    description: "Pose des questions sur ton cours et obtiens des explications claires.",
    accent: "#818cf8",
    available: false,
  },
];

export default function UploadSection({ userId }: { userId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [uploadedCourse, setUploadedCourse] = useState<{
    id: string;
    title: string;
    filePath: string;
  } | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string>("summary");
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés.");
      return;
    }

    setError(null);
    setStep("uploading");

    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setStep("idle");
      return;
    }

    const title = file.name.replace(/\.pdf$/i, "");
    const { data: course, error: dbError } = await supabase
      .from("courses")
      .insert({ user_id: userId, title, file_path: filePath })
      .select("id")
      .single();

    if (dbError || !course) {
      setError(dbError?.message ?? "Erreur lors de la sauvegarde");
      setStep("idle");
      return;
    }

    setUploadedCourse({ id: course.id, title, filePath });
    setStep("select_feature");
  }

  async function handleGenerate() {
    if (!uploadedCourse) return;

    setStep("generating");
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: uploadedCourse.id,
          filePath: uploadedCourse.filePath,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur lors de l'analyse");
        setStep("select_feature");
        return;
      }
    } catch {
      setError("Erreur lors de l'analyse du document");
      setStep("select_feature");
      return;
    }

    setStep("done");
    setTimeout(() => {
      setStep("idle");
      setUploadedCourse(null);
      setSelectedFeature("summary");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    }, 1800);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-anybody font-bold text-white text-2xl mb-1">
              Commence à réviser avec l'IA...
            </h1>
            <p className="font-anybody font-light text-white/35 text-sm mb-6">
              Importe un cours, choisis une fonctionnalitée et laisse l&apos;IA faire le reste.
            </p>

            <label
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 py-16 px-8 ${
                isDragging
                  ? "border-violet-500/50 bg-violet-500/5"
                  : "border-white/[0.08] bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.03]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <Upload size={20} className="text-white/40" />
              </div>
              <div className="text-center">
                <p className="font-anybody font-medium text-white/70 text-sm">
                  Glisse ton PDF ici ou{" "}
                  <span className="text-violet-400">clique pour sélectionner</span>
                </p>
                <p className="font-anybody font-light text-white/25 text-xs mt-1">
                  Fichiers PDF uniquement
                </p>
              </div>
            </label>

            {error && (
              <p className="mt-3 font-anybody font-light text-red-400 text-sm">{error}</p>
            )}
          </motion.div>
        )}

        {step === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <Loader2 size={28} className="text-violet-400 animate-spin" />
            <p className="font-anybody font-light text-white/50 text-sm">
              Upload en cours...
            </p>
          </motion.div>
        )}

        {step === "select_feature" && uploadedCourse && (
          <motion.div
            key="select_feature"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
                <FileText size={12} className="text-violet-400" />
                <span className="font-anybody font-light text-white/60 text-xs truncate max-w-[200px]">
                  {uploadedCourse.title}
                </span>
              </div>
              <Check size={14} className="text-emerald-400 flex-shrink-0" />
            </div>

            <h2 className="font-anybody font-bold text-white text-xl mb-1">
              Que veux-tu faire ?
            </h2>
            <p className="font-anybody font-light text-white/35 text-sm mb-6">
              Choisis ce que l&apos;IA doit générer depuis ton cours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isSelected = selectedFeature === feature.id;

                return (
                  <button
                    key={feature.id}
                    onClick={() => feature.available && setSelectedFeature(feature.id)}
                    disabled={!feature.available}
                    className={`relative text-left rounded-xl border p-4 transition-all duration-200 ${
                      !feature.available
                        ? "opacity-40 cursor-not-allowed border-white/[0.06] bg-white/[0.01]"
                        : isSelected
                        ? "border-white/20 bg-white/[0.04]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/12 cursor-pointer"
                    }`}
                    style={
                      isSelected
                        ? { borderColor: `${feature.accent}50`, boxShadow: `0 0 20px ${feature.accent}0d` }
                        : {}
                    }
                  >
                    {isSelected && (
                      <div
                        className="absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: feature.accent }}
                      >
                        <Check size={9} className="text-black" strokeWidth={3} />
                      </div>
                    )}

                    {!feature.available && (
                      <span className="absolute top-3 right-3 font-anybody text-white/30 text-[0.65rem] uppercase tracking-wider">
                        Bientôt
                      </span>
                    )}

                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${feature.accent}18`, color: feature.accent }}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                    </div>
                    <p className="font-anybody font-bold text-white text-sm mb-1">
                      {feature.title}
                    </p>
                    <p className="font-anybody font-light text-white/40 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="mb-4 font-anybody font-light text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              className="hover:cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-anybody font-medium text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "rgb(139,92,246)" }}
            >
              Générer avec l&apos;IA
              <ArrowRight size={15} />
            </button>
          </motion.div>
        )}

        {step === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="relative">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.15)" }}
              >
                <Brain size={24} className="text-violet-400" />
              </div>
              <Loader2
                size={44}
                className="absolute -inset-1.5 text-violet-500/30 animate-spin"
                strokeWidth={1}
              />
            </div>
            <div className="text-center">
              <p className="font-anybody font-medium text-white/70 text-sm">
                L&apos;IA analyse ton cours...
              </p>
              <p className="font-anybody font-light text-white/30 text-xs mt-1">
                Ça peut prendre quelques secondes
              </p>
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(52,211,153,0.15)" }}
            >
              <Check size={24} className="text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="font-anybody font-medium text-white/70 text-sm">
                Analyse terminée !
              </p>
              <p className="font-anybody font-light text-white/30 text-xs mt-1">
                Ton cours est prêt dans la liste
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
