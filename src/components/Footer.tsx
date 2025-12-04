import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full mt-20 py-8 border-t border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Alexis Pizarro Abarca
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Power BI Theme Creator
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <a
                        href="mailto:alexpizarro3@gmail.com"
                        className="group flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-300"
                        title="Email"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                            <Mail size={20} />
                        </div>
                        <span className="hidden sm:block text-sm">alexpizarro3@gmail.com</span>
                    </a>

                    <a
                        href="https://github.com/alexpizarro3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2 rounded-full bg-white/5 hover:bg-purple-500/10 text-slate-400 hover:text-purple-400 transition-all duration-300"
                        title="GitHub"
                    >
                        <Github size={20} />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/alexis-pizarro-abarca-9018826b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-2 rounded-full bg-white/5 hover:bg-blue-600/10 text-slate-400 hover:text-blue-500 transition-all duration-300"
                        title="LinkedIn"
                    >
                        <Linkedin size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
