import { useState } from 'react';
import { Heart, Copy, Check, X, Coffee, Bitcoin } from 'lucide-react';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    btcAddress: string;
    buyMeCoffeeUrl: string;
}

export const DonationModal = ({ isOpen, onClose, btcAddress, buyMeCoffeeUrl }: DonationModalProps) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(btcAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 relative animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <Heart className="fill-current" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Support the Project</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        If you find this tool useful, consider supporting its development!
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Buy Me a Coffee */}
                    <a
                        href={buyMeCoffeeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full p-4 bg-[#FFDD00] hover:bg-[#FFEA00] text-black font-bold rounded-xl transition-all hover:scale-[1.02] shadow-sm"
                    >
                        <Coffee size={20} />
                        Buy me a coffee
                    </a>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or donate Bitcoin</span>
                        </div>
                    </div>

                    {/* Bitcoin */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-semibold">
                            <Bitcoin size={20} className="text-[#F7931A]" />
                            <span>Bitcoin Address</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white dark:bg-slate-950 p-2 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 break-all border border-slate-200 dark:border-slate-800">
                                {btcAddress}
                            </code>
                            <button
                                onClick={handleCopy}
                                className={`p-2 rounded-lg transition-all ${copied
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                    }`}
                                title="Copy Address"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
                    Thank you for your support! ❤️
                </p>
            </div>
        </div>
    );
};
