"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
    FileText,
    Zap,
    Brain,
    RotateCcw,
    BarChart3,
    MessageSquare,
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Résumés intelligents",
        description:
            "Vos cours condensés en résumés clairs et structurés. Gardez l'essentiel, éliminez le superflu. L'IA identifie les points importants et les hiérarchise pour vous.",
        iconColor: "text-violet-400",
        activeColor: "border-violet-500/50",
    },
    {
        icon: Zap,
        title: "Quiz adaptatifs",
        description:
            "Des questions générées à partir de votre cours. L'IA adapte la difficulté selon vos réponses pour cibler vos lacunes et renforcer vos acquis.",
        iconColor: "text-pink-400",
        activeColor: "border-pink-500/50",
    },
    {
        icon: Brain,
        title: "Flashcards IA",
        description:
            "Des cartes mémo créées automatiquement avec un algorithme de répétition espacée. Révisez au bon moment pour une mémorisation durable.",
        iconColor: "text-orange-400",
        activeColor: "border-orange-500/50",
    },
    {
        icon: RotateCcw,
        title: "Répétition espacée",
        description:
            "Algorithme basé sur la science cognitive. Etudia vous rappelle de réviser au moment optimal pour ancrer les connaissances dans votre mémoire à long terme.",
        iconColor: "text-cyan-400",
        activeColor: "border-cyan-500/50",
    },
    {
        icon: BarChart3,
        title: "Suivi de progression",
        description:
            "Visualisez vos progrès en temps réel. Identifiez vos points faibles, suivez votre évolution et concentrez vos efforts là où ça compte.",
        iconColor: "text-emerald-400",
        activeColor: "border-emerald-500/50",
    },
    {
        icon: MessageSquare,
        title: "Tuteur IA personnel",
        description:
            "Posez vos questions directement sur votre cours. Obtenez des explications claires, des exemples concrets et un niveau ajustable du vulgarisé à l'expert.",
        iconColor: "text-indigo-400",
        activeColor: "border-indigo-500/50",
    },
];

function FeatureCube({
    feature,
    index,
    isActive,
    onClick,
}: {
    feature: (typeof features)[0];
    index: number;
    isActive: boolean;
    onClick: () => void;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const Icon = feature.icon;

    return (
        <motion.button
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={onClick}
            className={`group relative aspect-square rounded-2xl border bg-white/[0.03] backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all duration-300 ${
                isActive
                    ? `${feature.activeColor} bg-white/[0.06]`
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
            }`}
        >
            {/* Icon - visible by default, hidden on hover */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 ${feature.iconColor}`}
            >
                <Icon size={32} strokeWidth={1.5} />
            </div>

            {/* Title - hidden by default, visible on hover */}
            <div className="absolute inset-0 flex items-center justify-center px-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-anybody text-sm font-medium text-white text-center leading-tight">
                    {feature.title}
                </span>
            </div>
        </motion.button>
    );
}

export function FeaturesSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const titleRef = useRef(null);
    const titleInView = useInView(titleRef, { once: true, margin: "-60px" });
    const activeFeature = features[activeIndex];

    return (
        <section className="py-24 px-6 bg-[#000000]" id="demo">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-anybody text-white mb-4"
                        style={{
                            fontSize: "clamp(1.8rem, 4vw, 3rem)",
                            fontWeight: 800,
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Tout ce dont vous avez besoin
                        <br />
                        pour maîtriser vos cours
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="font-anybody font-light text-white/50 max-w-xl mx-auto"
                        style={{ fontSize: "1rem", lineHeight: 1.7 }}
                    >
                        Importez n&apos;importe quel document et laissez Etudia générer
                        automatiquement tous vos outils de révision.
                    </motion.p>
                </div>

                {/* 6 Cubes */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-3xl mx-auto mb-12">
                    {features.map((feature, i) => (
                        <FeatureCube
                            key={feature.title}
                            feature={feature}
                            index={i}
                            isActive={activeIndex === i}
                            onClick={() => setActiveIndex(i)}
                        />
                    ))}
                </div>

                {/* Detail panel */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`max-w-3xl mx-auto rounded-2xl border bg-white/[0.03] p-8 sm:p-10 ${activeFeature.activeColor}`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 ${activeFeature.iconColor}`}
                            >
                                <activeFeature.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-anybody text-xl font-bold text-white">
                                {activeFeature.title}
                            </h3>
                        </div>
                        <p className="font-anybody font-light text-white/60 leading-relaxed text-base">
                            {activeFeature.description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
