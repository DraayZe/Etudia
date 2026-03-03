import {Globe} from "@/components/ui/globe";

export default function GlobeSection() {
    return (
        <section className="relative py-24 px-6 bg-[#000000] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                <div className="relative aspect-square w-full max-w-[700px]">
                    <Globe />
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] text-center">
                <h2
                    className="font-anybody text-white mb-6"
                    style={{
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                    }}
                >
                    Pour chaque étudiant,
                    <br />
                    partout dans le monde
                </h2>
                <p
                    className="font-anybody font-light text-white/60 max-w-lg mx-auto"
                    style={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                    Peu importe votre langue, votre pays ou votre niveau.
                    Etudia accompagne des milliers d&apos;étudiants à travers le monde
                    pour transformer leurs cours en réussite.
                </p>
            </div>
        </section>
    );
}
