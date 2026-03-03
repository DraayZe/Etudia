import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 lg:px-16">
      <span className="font-medium text-3xl">ETUDIA</span>

      <div className="hidden items-center gap-8 text-base text-white/70 md:flex ml-46">
        <Link href="#" className="font-light font-anybody hover:text-white">
          Demo
        </Link>
        <Link href="#" className="font-light font-anybody hover:text-white">
          Formules
        </Link>
        <Link href="#" className="font-light font-anybody hover:text-white">
          FAQ
        </Link>
        <Link href="#" className="font-light font-anybody hover:text-white">
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="font-anybody font-regular rounded-full border border-white/30 px-5 py-2 text-base text-white/80 transition-all duration-300 hover:border-white/60 hover:text-white hover:bg-white/5"
        >
          Se connecter
        </Link>
        <Link
          href="/auth/signup"
          className="font-anybody font-medium rounded-full bg-[#F8F4F4] px-6 py-2 text-base text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
        >
          S&apos;inscrire
        </Link>
      </div>
    </nav>
  );
}
