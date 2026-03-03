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
        tag: "PDF, PNG, JPEG et autres",
        accent: "#a78bfa",
    },
    {
        step: "02",
        icon: Cpu,
        title: "L'IA analyse & structure",
        description:
            "L'IA décompose votre cours, identifie les concepts clés, les définitions et les points importants pour créer une base de connaissance personnalisée.",
        tag: "Analyse en moins de 30 secondes",
        accent: "#f472b6",
    },
    {
        step: "03",
        icon: BookOpen,
        title: "Révisez intelligemment",
        description:
            "Accédez à votre espace de révision personnalisé : résumés, quiz, flashcards et répétition espacée. Votre tuteur IA répond à toutes vos questions.",
        tag: "Rétention optimisée par la science",
        accent: "#fb923c",
    },
];

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const Icon = step.icon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.13 }}
            className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 overflow-hidden flex flex-col"
        >
            {/* Large decorative number */}
            <div
                className="absolute -top-3 -right-2 font-anybody font-bold select-none pointer-events-none"
                style={{
                    fontSize: "8rem",
                    lineHeight: 1,
                    color: `${step.accent}0d`,
                    letterSpacing: "-0.05em",
                }}
            >
                {step.step}
            </div>

            {/* Top accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, ${step.accent}50, transparent)` }}
            />

            <div className="relative z-10 flex flex-col h-full">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                    style={{ background: `${step.accent}18`, color: step.accent }}
                >
                    <Icon size={20} strokeWidth={1.5} />
                </div>

                <p
                    className="font-anybody text-white/25 mb-2"
                    style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em" }}
                >
                    ÉTAPE {step.step}
                </p>

                <h3
                    className="font-anybody font-bold text-white mb-3"
                    style={{ fontSize: "1.15rem", letterSpacing: "-0.015em" }}
                >
                    {step.title}
                </h3>

                <p
                    className="font-anybody font-light text-white/45 leading-relaxed flex-1"
                    style={{ fontSize: "0.9rem" }}
                >
                    {step.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 self-start">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: step.accent }} />
                    <span
                        className="font-anybody font-light"
                        style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}
                    >
                        {step.tag}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export function HowItWorksSection() {
    const titleRef = useRef(null);
    const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

    return (
        <section className="py-24 px-6 bg-[#000000] relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.2), transparent)" }}
            />

            <div className="max-w-6xl mx-auto relative">
                <div ref={titleRef} className="text-center mb-14">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={titleInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="font-anybody font-light text-white/25 text-xs uppercase tracking-[0.15em] mb-5"
                    >
                        Comment ça marche
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 14 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.06 }}
                        className="font-anybody font-bold text-white"
                        style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
                    >
                        3 étapes pour transformer
                        <br />
                        votre façon de réviser
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.12 }}
                        className="font-anybody font-light text-white/40 max-w-md mx-auto mt-4"
                        style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                    >
                        Aucune configuration complexe. Commencez à réviser efficacement en
                        moins d&apos;une minute.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {steps.map((step, i) => (
                        <StepCard key={step.step} step={step} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
