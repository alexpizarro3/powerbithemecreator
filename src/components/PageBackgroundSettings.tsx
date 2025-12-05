import { Layout } from 'lucide-react';

interface PageBackgroundSettingsProps {
    color: string;
    transparency: number;
    onChange: (color: string, transparency: number) => void;
}

export const PageBackgroundSettings = ({ color, transparency, onChange }: PageBackgroundSettingsProps) => {
    return (
        <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
                <Layout size={16} className="text-blue-400" />
                <h3 className="text-sm font-medium text-white/90">Page Background</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 mb-1">Color</label>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg border border-white/10 shadow-sm overflow-hidden relative"
                            style={{ backgroundColor: color }}
                        >
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => onChange(e.target.value, transparency)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => onChange(e.target.value, transparency)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">Transparency: {transparency}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={transparency}
                        onChange={(e) => onChange(color, Number(e.target.value))}
                        className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                    />
                </div>
            </div>
        </div>
    );
};
