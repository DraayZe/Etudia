import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export function HeroSection() {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-150 object-left-top origin-top-left"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <Navbar />

        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="font-anybody max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-8xl">
            L&apos;IA au service
            <br />
            de vos révisions
          </h1>

          <p className="font-anybody font-regular mt-6 max-w-3xl text-base text-white/70 md:text-xl">
            Apprenez en 10 minutes ce qui en prend 2 heures. Votre tuteur
            personnel qui transforme vos documents en expériences
            d&apos;apprentissage interactives.
          </p>

          <Link
            href="/auth/signup"
            className="font-anybody font-medium rounded-full bg-[#F8F4F4] px-8 py-3 text-xl mt-10 text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
          >
            Commencez à réviser
          </Link>
        </main>

        <section className="mx-auto max-w-4xl grid gap-6 px-8 mb-6 p-8 md:grid-cols-3 lg:px-16 bg-black/80 rounded-xl backdrop-blur-md border-1 border-white/50">
          <div>
            <p className="mb-3 text-base font-medium font-anybody text-white">
              1. Créez votre compte
            </p>
            <p className="text-sm font-medium font-anybody text-white/70">
              Créer votre compte en quelques secondes avec votre adresse mail ou
              un compte Google.
            </p>
          </div>

          <div>
            <p className="mb-3 text-base font-medium font-anybody text-white">
              2. Uploadez un fichier
            </p>
            <p className="text-sm font-medium font-anybody text-white/70">
              Uploadez un fichier PDF et transformez votre moyen de travail ou
              de révision.
            </p>
          </div>

          <div>
            <p className="mb-3 text-base font-medium font-anybody text-white">
              3. Visualisez vos avancées
            </p>
            <p className="text-sm font-medium font-anybody text-white/70">
              Messages incompréhensibles expliqués comme si vous étiez là, sans
              aucune analogie complexe.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
