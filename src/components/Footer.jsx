import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-black text-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-white/80">GitHub Developer Explorer © {year}</p>

                <nav className="flex items-center gap-5 text-white/70">
                    <a href="#" className="transition hover:text-white">
                        Dashboard
                    </a>
                    <a href="#" className="transition hover:text-white">
                        Candidates
                    </a>
                    <a href="#" className="transition hover:text-white">
                        About
                    </a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;