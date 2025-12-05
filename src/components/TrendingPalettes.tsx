import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Heart, Palette, Loader2 } from 'lucide-react';
import { fetchTrendingPalettes, type TrendingPalette } from '../utils/trending';

interface TrendingPalettesProps {
    onSelect: (colors: string[]) => void;
}

export const TrendingPalettes = ({ onSelect }: TrendingPalettesProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [palettes, setPalettes] = useState<TrendingPalette[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPalettes = async () => {
            const data = await fetchTrendingPalettes();
            setPalettes(data);
            setLoading(false);
        };
        loadPalettes();
    }, []);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-[100%]'
                }`}
        >
            {/* Toggle Button - Positioned absolutely above the dock */}
            <div className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none">
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="bg-slate-900/90 backdrop-blur-md text-white px-6 py-2 rounded-t-xl border-t border-x border-white/10 shadow-lg hover:bg-slate-800 transition-all pointer-events-auto flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
                >
                    <Palette size={14} className="text-pink-500" />
                    Trending
                    {isVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
            </div>

            {/* Dock */}
            <div className="w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/10 shadow-2xl overflow-hidden group pause-on-hover">
                <div className="max-w-full py-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-24 text-slate-400 text-sm">
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Loading...
                        </div>
                    ) : (
                        <div className="flex gap-4 min-w-max animate-marquee">
                            {[...palettes, ...palettes].map((palette, index) => (
                                <div
                                    key={`${palette.id}-${index}`}
                                    onClick={() => onSelect(palette.colors)}
                                    className="group/item relative bg-black/40 p-2 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 w-40 flex-shrink-0"
                                >
                                    <div className="flex h-12 rounded-md overflow-hidden mb-2 ring-1 ring-white/10 group-hover/item:ring-white/30 transition-all">
                                        {palette.colors.map((color, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 h-full"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-400 group-hover/item:text-white transition-colors truncate max-w-[100px]">
                                            {palette.name}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-600">
                                            <Heart size={8} className="fill-current" />
                                            {palette.likes}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
