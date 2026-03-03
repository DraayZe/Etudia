"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { FileText, Zap, Brain, RotateCcw, BarChart3, MessageSquare } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Résumés intelligents",
        description: "Vos cours condensés en résumés clairs et structurés. L'IA identifie les points importants et les hiérarchise pour vous.",
        accent: "#a78bfa",
    },
    {
        icon: Brain,
        title: "Flashcards IA",
        description: "Cartes mémo créées automatiquement avec un algorithme de répétition espacée. Révisez au bon moment pour une mémorisation durable.",
        accent: "#fb923c",
    },
    {
        icon: Zap,
        title: "Quiz adaptatifs",
        description: "Des questions générées à partir de votre cours. L'IA adapte la difficulté selon vos réponses pour cibler vos lacunes.",
        accent: "#f472b6",
    },
    {
        icon: RotateCcw,
        title: "Répétition espacée",
        description: "Algorithme basé sur la science cognitive. Révisez au bon moment pour ancrer les connaissances dans votre mémoire à long terme.",
        accent: "#22d3ee",
    },
    {
        icon: BarChart3,
        title: "Suivi de progression",
        description: "Visualisez vos progrès en temps réel. Identifiez vos points faibles et concentrez vos efforts là où ça compte.",
        accent: "#34d399",
    },
    {
        icon: MessageSquare,
        title: "Tuteur IA personnel",
        description: "Posez vos questions directement sur votre cours. Explications claires, exemples concrets, niveau ajustable.",
        accent: "#818cf8",
    },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const Icon = feature.icon;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 overflow-hidden hover:border-white/[0.13] transition-colors duration-300"
        >
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${feature.accent}1c, transparent)` }}
            />

            <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.accent}55, transparent)` }}
            />

            <div className="relative z-10">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${feature.accent}18`, color: feature.accent }}
                >
                    <Icon size={18} strokeWidth={1.5} />
                </div>
                <h3
                    className="font-anybody font-bold text-white mb-2"
                    style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}
                >
                    {feature.title}
                </h3>
                <p
                    className="font-anybody font-light text-white/40 leading-relaxed"
                    style={{ fontSize: "0.875rem" }}
                >
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
}

export function FeaturesSection() {
    const titleRef = useRef(null);
    const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

    return (
        <section className="py-24 px-6 bg-[#000000]" id="demo">
            <div className="max-w-6xl mx-auto">
                <div ref={titleRef} className="text-center mb-14">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={titleInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="font-anybody font-light text-white/25 text-xs uppercase tracking-[0.15em] mb-5"
                    >
                        Fonctionnalités
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 14 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.06 }}
                        className="font-anybody font-bold text-white"
                        style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
                    >
                        Tout ce dont vous avez besoin
                        <br />
                        pour maîtriser vos cours
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.12 }}
                        className="font-anybody font-light text-white/40 max-w-md mx-auto mt-4"
                        style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                    >
                        Importez n&apos;importe quel document et laissez Etudia générer
                        automatiquement tous vos outils de révision.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map((f, i) => (
                        <FeatureCard key={f.title} feature={f} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
