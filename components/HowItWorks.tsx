"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Upload, Cpu, BookOpen } from "lucide-react";

const steps = [
    {
        step: "01",
        icon: Upload,
        title: "Importez votre cours",
        description:
            "Glissez-déposez votre PDF, présentation ou document Word. Etudia supporte tous les formats courants et traite votre fichier en quelques secondes.",
        tag: "Compatible PDF, PNG, JPEG et autres",
        color: "from-violet-500 to-purple-600",
        glow: "shadow-violet-500/20",
    },
    {
        step: "02",
        icon: Cpu,
        title: "L'IA analyse & structure",
        description:
            "L'IA décompose votre cours, identifie les concepts clés, les définitions et les points importants pour créer une base de connaissance personnalisée.",
        tag: "Analyse en moins de 30 secondes",
        color: "from-pink-500 to-rose-600",
        glow: "shadow-pink-500/20",
    },
    {
        step: "03",
        icon: BookOpen,
        title: "Révisez intelligemment",
        description:
            "Accédez à votre espace de révision personnalisé : résumés, quiz, flashcards et répétition espacée. Votre tuteur IA répond à toutes vos questions sur le cours.",
        tag: "Rétention optimisée par la science",
        color: "from-orange-500 to-amber-500",
        glow: "shadow-orange-500/20",
    },
];

function StepCard({
                      step,
                      index,
                  }: {
    step: (typeof steps)[0];
    index: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const Icon = step.icon;
    const isEven = index % 2 === 1;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`flex flex-col ${
                isEven ? "md:flex-row-reverse" : "md:flex-row"
            } items-center gap-8 md:gap-16`}
        >
            {/* Card */}
            <div className="flex-1 p-8 rounded-3xl bg-white/[0.03] border border-white/8 relative overflow-hidden">
                {/* Glow */}
                <div
                    className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${step.color}`}
                />

                <div className="flex items-start gap-4 mb-4">
                    <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.color} shadow-lg ${step.glow} flex-shrink-0`}
                    >
                        <Icon size={20} className="text-white" />
                    </div>
                    <span
                        className="text-white/20 mt-2"
                        style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em" }}
                    >
            ÉTAPE {step.step}
          </span>
                </div>

                <h3
                    className="text-white mb-3"
                    style={{ fontSize: "1.3rem", fontWeight: 700 }}
                >
                    {step.title}
                </h3>
                <p
                    className="text-white/50 mb-5"
                    style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                >
                    {step.description}
                </p>

                <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                >
                    <div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color}`}
                    />
                    <span className="text-white/60" style={{ fontSize: "0.8rem" }}>
            {step.tag}
          </span>
                </div>
            </div>

            {/* Visual indicator */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${step.color} shadow-2xl ${step.glow}`}
                    style={{ fontSize: "2rem", fontWeight: 800, color: "rgba(255,255,255,0.9)" }}
                >
                    {step.step}
                </div>
                {index < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-white/20 to-transparent hidden md:block" />
                )}
            </div>
        </motion.div>
    );
}

export function HowItWorksSection() {
    const titleRef = useRef(null);
    const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

    return (
        <section className="py-24 px-6 bg-[080808] relative overflow-hidden">
            {/* Subtle background gradient */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.15), transparent)",
                }}
            />

            <div className="max-w-6xl mx-auto relative">
                {/* Header */}
                <div ref={titleRef} className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-white mb-4"
                        style={{
                            fontSize: "clamp(1.8rem, 4vw, 3rem)",
                            fontWeight: 800,
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        3 étapes pour transformer
                        <br />
                        <span
                            style={{
                                background: "linear-gradient(90deg, #ec4899, #f97316)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
              votre façon de réviser
            </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/50 max-w-lg mx-auto"
                        style={{ fontSize: "1rem", lineHeight: 1.7 }}
                    >
                        Aucune configuration complexe. Commencez à réviser efficacement en
                        moins d'une minute.
                    </motion.p>
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-8">
                    {steps.map((step, i) => (
                        <StepCard key={step.step} step={step} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
