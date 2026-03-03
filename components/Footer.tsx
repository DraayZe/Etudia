"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";

const navLinks = [
    { label: "Fonctionnalités", href: "#demo" },
    { label: "Tarifs", href: "#pricing" },
    { label: "S'inscrire", href: "/auth/signup" },
    { label: "Se connecter", href: "/auth/login" },
];

const legalLinks = [
    { label: "Mentions légales", href: "#" },
    { label: "Confidentialité", href: "#" },
];

export function Footer() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <footer ref={ref} className="relative bg-black overflow-hidden">
            {/* Gradient separator */}
            <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Main row */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55 }}
                    className="flex flex-col md:flex-row md:items-start justify-between gap-8 pt-14 pb-10"
                >
                    {/* Brand */}
                    <div>
                        <span className="font-anybody font-bold text-white text-xl tracking-tight">
                            Etudia
                        </span>
                        <p
                            className="font-anybody font-light text-sm mt-2 leading-relaxed max-w-[260px]"
                            style={{ color: "rgba(255,255,255,0.28)" }}
                        >
                            Transforme tes cours en outils de révision intelligents grâce à l&apos;IA.
                        </p>
                    </div>

                    {/* Nav */}
                    <nav className="flex flex-wrap gap-x-8 gap-y-4">
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.label}
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                            >
                                <Link
                                    href={link.href}
                                    className="group relative font-anybody font-light text-white/35 hover:text-white/80 text-sm transition-colors duration-200"
                                >
                                    {link.label}
                                    <span
                                        className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px transition-all duration-300"
                                        style={{ background: "rgba(167,139,250,0.55)" }}
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </nav>
                </motion.div>

                {/* Divider */}
                <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

                {/* Bottom row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.28 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-3 py-5"
                >
                    <p
                        className="font-anybody font-light text-xs"
                        style={{ color: "rgba(255,255,255,0.18)" }}
                    >
                        © 2026 Etudia. Tous droits réservés.
                    </p>
                    <div className="flex gap-6">
                        {legalLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="font-anybody font-light text-white/20 hover:text-white/45 text-xs transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Decorative wordmark — clipped by overflow-hidden */}
            <div className="overflow-hidden" style={{ height: "9rem" }} aria-hidden>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 1.4, delay: 0.45 }}
                    className="font-anybody font-bold text-center select-none pointer-events-none"
                    style={{
                        fontSize: "clamp(6rem, 22vw, 18rem)",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        color: "rgba(255,255,255,0.028)",
                    }}
                >
                    Etudia
                </motion.p>
            </div>
        </footer>
    );
}
