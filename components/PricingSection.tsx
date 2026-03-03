"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check, ArrowUpRight } from "lucide-react";
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

function PlanCard({ plan, index }: { plan: (typeof plans)[0]; index: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.13 }}
            className="relative rounded-2xl overflow-hidden flex flex-col"
            style={{
                border: plan.highlight
                    ? "1px solid rgba(167,139,250,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
                background: plan.highlight
                    ? "linear-gradient(160deg, rgba(139,92,246,0.09) 0%, rgba(0,0,0,0) 60%)"
                    : "rgba(255,255,255,0.02)",
                boxShadow: plan.highlight ? "0 0 80px rgba(139,92,246,0.08)" : "none",
            }}
        >
            {/* Top accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background: plan.highlight
                        ? "linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)"
                        : "transparent",
                }}
            />

            <div className="relative z-10 p-8 flex flex-col h-full">
                {/* Badge */}
                <div className="mb-7">
                    <span
                        className={`font-anybody text-xs font-semibold uppercase tracking-[0.1em] px-3 py-1 rounded-full ${
                            plan.highlight
                                ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                                : "bg-white/[0.06] text-white/35 border border-white/[0.08]"
                        }`}
                    >
                        {plan.name}
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1.5 mb-4">
                    <span
                        className="font-anybody font-bold"
                        style={{
                            fontSize: "clamp(3rem, 5vw, 3.8rem)",
                            lineHeight: 1,
                            letterSpacing: "-0.04em",
                            color: plan.highlight ? "rgb(167,139,250)" : "white",
                        }}
                    >
                        {plan.price}
                    </span>
                    {plan.period && (
                        <span
                            className="font-anybody font-light mb-1.5"
                            style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)" }}
                        >
                            {plan.period}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p
                    className="font-anybody font-light mb-7"
                    style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}
                >
                    <span className="font-anybody text-white/75 font-medium">{plan.descriptionBold}</span>
                    {plan.descriptionRest}
                </p>

                {/* Divider */}
                <div className="h-px bg-white/[0.06] mb-7" />

                {/* Features */}
                <ul className="flex flex-col gap-3.5 flex-1 mb-8">
                    {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                            <Check
                                size={14}
                                className="mt-0.5 flex-shrink-0"
                                style={{ color: plan.highlight ? "rgb(167,139,250)" : "rgba(255,255,255,0.25)" }}
                            />
                            <span
                                className="font-anybody font-light"
                                style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)" }}
                            >
                                {f}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <Link
                    href={plan.ctaHref}
                    className="flex items-center justify-center gap-2 w-full rounded-xl py-3 px-5 font-anybody font-medium text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: plan.highlight ? "rgb(139,92,246)" : "rgba(255,255,255,0.07)",
                        border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    {plan.cta}
                    <ArrowUpRight size={15} />
                </Link>
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
                style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.08), transparent)" }}
            />

            <div className="max-w-3xl mx-auto relative">
                <div ref={titleRef} className="text-center mb-14">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={titleInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="font-anybody font-light text-white/25 text-xs uppercase tracking-[0.15em] mb-5"
                    >
                        Tarifs
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 14 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.06 }}
                        className="font-anybody font-bold text-white"
                        style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
                    >
                        Prêt à transformer
                        <br />
                        <em style={{ fontStyle: "italic" }}>tes révisions</em> ?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.12 }}
                        className="font-anybody font-light text-white/40 max-w-sm mx-auto mt-4"
                        style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                    >
                        Choisis le plan qui te correspond.
                        <br />
                        Commence gratuitement, sans carte bancaire.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map((plan, i) => (
                        <PlanCard key={plan.name} plan={plan} index={i} />
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={titleInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="font-anybody font-light text-white/20 text-xs text-center mt-6"
                >
                    Tous les prix sont TTC · Annulable à tout moment
                </motion.p>
            </div>
        </section>
    );
}
