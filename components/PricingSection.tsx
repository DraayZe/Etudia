"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Gratuit",
        price: "0€",
        period: null,
        descriptionBold: "Commence gratuitement",
        descriptionRest: " et accède aux outils essentiels pour réviser autrement.",
        cta: "Commencer gratuitement",
        ctaHref: "/auth/signup",
        highlight: false,
        features: [
            "3 cours / mois",
            "Résumés intelligents",
            "Quiz QCM basiques",
            "IA Gemini Flash",
            "Export limité",
        ],
    },
    {
        name: "Pro",
        price: "6€",
        period: "/mois",
        descriptionBold: "Passe au niveau supérieur",
        descriptionRest: " avec des outils avancés et une IA plus puissante.",
        cta: "Passer au Pro",
        ctaHref: "/auth/signup?plan=pro",
        highlight: true,
        features: [
            "Cours illimités",
            "Résumés intelligents",
            "Quiz avancés (QCM + questions ouvertes)",
            "Flashcards + répétition espacée",
            "Chat contextuel complet",
            "Fiches exportables en PDF",
            "Détection de lacunes + plan de révision",
            "IA Gemini Pro (meilleure qualité)",
        ],
    },
];

function FeatureIcon({ highlight }: { highlight: boolean }) {
    return (
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
            <div
                className="h-px w-3"
                style={{
                    background: highlight ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.15)",
                }}
            />
            <span
                style={{
                    fontSize: "0.6rem",
                    color: highlight ? "rgb(167,139,250)" : "rgba(255,255,255,0.3)",
                }}
            >
                ✦
            </span>
            <div
                className="h-px w-3"
                style={{
                    background: highlight ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.15)",
                }}
            />
        </div>
    );
}

function PlanBadge({ name, highlight }: { name: string; highlight: boolean }) {
    return (
        <div className="flex items-center gap-2.5">
            <div
                className="h-px w-5"
                style={{
                    background: highlight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
                }}
            />
            <span
                className={`text-sm font-semibold px-3.5 py-1 rounded-full ${
                    highlight
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/70 border border-white/10"
                }`}
            >
                {name}
            </span>
            <div
                className="h-px w-5"
                style={{
                    background: highlight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
                }}
            />
        </div>
    );
}

function PlanCard({
    plan,
    index,
}: {
    plan: (typeof plans)[0];
    index: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: index * 0.15 }}
            className={`relative rounded-3xl border overflow-hidden ${
                plan.highlight
                    ? "border-violet-500/40"
                    : "border-white/8"
            }`}
            style={{
                background: plan.highlight
                    ? "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.08) 100%)"
                    : "rgba(255,255,255,0.03)",
            }}
        >
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col justify-between p-8 md:p-10 md:w-[42%] md:border-r border-b md:border-b-0 border-white/8">
                    <div>
                        <PlanBadge name={plan.name} highlight={plan.highlight} />

                        <div className="flex items-end gap-2 mt-7 mb-5">
                            <span
                                style={{
                                    fontSize: "clamp(3rem, 6vw, 4rem)",
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    color: plan.highlight ? "rgb(167,139,250)" : "white",
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                {plan.price}
                            </span>
                            {plan.period && (
                                <span
                                    className="mb-1"
                                    style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem" }}
                                >
                                    {plan.period}
                                </span>
                            )}
                        </div>

                        <p className="leading-relaxed" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)" }}>
                            <span className="text-white font-semibold">{plan.descriptionBold}</span>
                            {plan.descriptionRest}
                        </p>
                    </div>

                    <Link
                        href={plan.ctaHref}
                        className={`mt-8 flex items-center gap-3 w-fit rounded-full transition-all duration-300 pr-5 ${
                            plan.highlight
                                ? "hover:scale-[1.03] active:scale-[0.97]"
                                : "hover:scale-[1.03] active:scale-[0.97]"
                        }`}
                        style={{
                            background: plan.highlight
                                ? "rgb(139,92,246)"
                                : "rgba(255,255,255,0.08)",
                            border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.12)",
                        }}
                    >
                        <div
                            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                                background: plan.highlight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.1)",
                            }}
                        >
                            <ArrowUpRight size={18} className="text-white" />
                        </div>
                        <span className="text-white text-sm font-semibold">{plan.cta}</span>
                    </Link>
                </div>

                <div className="flex flex-col p-8 md:p-10 md:flex-1">
                    <p
                        className="mb-6 font-semibold"
                        style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase" }}
                    >
                        Ce qui est inclus
                    </p>

                    <ul className="flex flex-col gap-4">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-3">
                                <FeatureIcon highlight={plan.highlight} />
                                <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)" }}>
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
}

export function PricingSection() {
    const titleRef = useRef(null);
    const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

    return (
        <section className="py-24 px-6 bg-[#000000] relative overflow-hidden" id="pricing">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.12), transparent)",
                }}
            />

            <div className="max-w-6xl mx-auto relative">
                <div className="flex flex-col md:flex-row gap-16 md:gap-20">
                    {/* Left: Cards */}
                    <div className="md:w-3/5 flex flex-col gap-5">
                        {plans.map((plan, i) => (
                            <PlanCard key={plan.name} plan={plan} index={i} />
                        ))}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={titleInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-white/25 text-xs"
                        >
                            Tous les prix sont TTC · Annulable à tout moment
                        </motion.p>
                    </div>

                    {/* Right: Title — sticky */}
                    <div ref={titleRef} className="md:w-2/5 md:sticky md:top-24 md:self-start">
                        <motion.h2
                            initial={{ opacity: 0, x: 30 }}
                            animate={titleInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-white mb-4"
                            style={{
                                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                                fontWeight: 800,
                                lineHeight: 1.2,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Prêt à transformer
                            <br />
                            <em
                                style={{
                                    background: "linear-gradient(90deg, #323232, #a78bfa)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontStyle: "italic",
                                }}
                            >
                                tes révisions
                            </em>
                            <span style={{ color: "rgb(167, 139, 250)" }}> ?</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: 30 }}
                            animate={titleInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/40"
                            style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                        >
                            Choisis le plan qui te correspond.
                            <br />
                            Commence gratuitement, sans carte bancaire.
                        </motion.p>
                    </div>
                </div>
            </div>
        </section>
    );
}
