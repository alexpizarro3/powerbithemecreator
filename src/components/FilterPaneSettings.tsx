import { Filter } from 'lucide-react';

interface FilterPaneSettingsProps {
    backgroundColor: string;
    foreColor: string;
    transparency: number;
    onChange: (settings: { backgroundColor: string; foreColor: string; transparency: number }) => void;
}

export const FilterPaneSettings = ({ backgroundColor, foreColor, transparency, onChange }: FilterPaneSettingsProps) => {
    const handleChange = (key: string, value: string | number) => {
        onChange({
            backgroundColor,
            foreColor,
            transparency,
            [key]: value
        });
    };

    return (
        <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
                <Filter size={16} className="text-blue-400" />
                <h3 className="text-sm font-medium text-white/90">Filter Pane</h3>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Background</label>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-lg border border-white/10 shadow-sm overflow-hidden relative"
                                style={{ backgroundColor: backgroundColor }}
                            >
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </div>
                            <input
                                type="text"
                                value={backgroundColor}
                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Text Color</label>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-lg border border-white/10 shadow-sm overflow-hidden relative"
                                style={{ backgroundColor: foreColor }}
                            >
                                <input
                                    type="color"
                                    value={foreColor}
                                    onChange={(e) => handleChange('foreColor', e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </div>
                            <input
                                type="text"
                                value={foreColor}
                                onChange={(e) => handleChange('foreColor', e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1">Transparency: {transparency}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={transparency}
                        onChange={(e) => handleChange('transparency', Number(e.target.value))}
                        className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                    />
                </div>
            </div>
        </div>
    );
};
