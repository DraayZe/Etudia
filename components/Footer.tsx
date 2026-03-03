import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 px-6 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
                    <div className="md:w-1/3">
                        <span className="font-anybody font-bold text-white text-xl tracking-tight">
                            Etudia
                        </span>
                        <p className="font-anybody font-light text-white/40 text-sm mt-3 leading-relaxed">
                            Transforme tes cours en outils de révision intelligents grâce à l&apos;IA.
                        </p>
                    </div>

                    <div className="flex gap-16">
                        <div>
                            <p className="font-anybody text-white/60 text-xs uppercase tracking-widest mb-4">
                                Produit
                            </p>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <Link href="#demo" className="font-anybody font-light text-white/40 hover:text-white text-sm transition-colors duration-200">
                                        Fonctionnalités
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#pricing" className="font-anybody font-light text-white/40 hover:text-white text-sm transition-colors duration-200">
                                        Tarifs
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-anybody text-white/60 text-xs uppercase tracking-widest mb-4">
                                Compte
                            </p>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <Link href="/auth/signup" className="font-anybody font-light text-white/40 hover:text-white text-sm transition-colors duration-200">
                                        S&apos;inscrire
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/auth/login" className="font-anybody font-light text-white/40 hover:text-white text-sm transition-colors duration-200">
                                        Se connecter
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="font-anybody font-light text-white/25 text-xs">
                        © 2026 Etudia. Tous droits réservés.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="font-anybody font-light text-white/25 hover:text-white/50 text-xs transition-colors duration-200">
                            Mentions légales
                        </Link>
                        <Link href="#" className="font-anybody font-light text-white/25 hover:text-white/50 text-xs transition-colors duration-200">
                            Confidentialité
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
