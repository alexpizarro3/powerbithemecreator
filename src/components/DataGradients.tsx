import { useState } from 'react';
import { AlertTriangle, Sliders } from 'lucide-react';
import { AdvancedColorPicker } from './AdvancedColorPicker';
import { getContrastRatio } from '../utils/colors';

interface DataGradientsProps {
    gradients: {
        bad: string;
        neutral: string;
        good: string;
    };
    onChange: (gradients: { bad: string; neutral: string; good: string }) => void;
}

export const DataGradients = ({ gradients, onChange }: DataGradientsProps) => {
    const [activePicker, setActivePicker] = useState<keyof typeof gradients | null>(null);

    if (!gradients) return null;

    const updateColor = (key: keyof typeof gradients, color: string) => {
        onChange({ ...gradients, [key]: color });
    };

    const renderColorInput = (key: keyof typeof gradients, label: string, description: string) => {
        const color = gradients[key];
        const contrast = getContrastRatio(color, '#FFFFFF');
        const isLowContrast = contrast < 3;

        return (
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="text-sm font-medium text-white">{label}</h4>
                        <p className="text-xs text-slate-400">{description}</p>
                    </div>
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-lg shadow-lg ring-1 ring-white/10 cursor-pointer overflow-hidden transition-transform hover:scale-105"
                            style={{ backgroundColor: color }}
                            onClick={() => setActivePicker(activePicker === key ? null : key)}
                        >
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => updateColor(key, e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                        {isLowContrast && (
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-1 shadow-lg z-10" title="Low contrast with white background">
                                <AlertTriangle size={10} />
                            </div>
                        )}
                        {activePicker === key && (
                            <AdvancedColorPicker
                                color={color}
                                onChange={(newHex) => updateColor(key, newHex)}
                                onClose={() => setActivePicker(null)}
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => updateColor(key, e.target.value)}
                        className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-300 w-20 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={() => setActivePicker(activePicker === key ? null : key)}
                        className={`p-1.5 rounded transition-colors ${activePicker === key ? 'text-blue-400 bg-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Sliders size={14} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderColorInput('bad', 'Minimum (Bad)', 'Lowest value color')}
                {renderColorInput('neutral', 'Center (Neutral)', 'Middle value color')}
                {renderColorInput('good', 'Maximum (Good)', 'Highest value color')}
            </div>

            {/* Gradient Preview */}
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <h4 className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">Preview</h4>
                <div className="h-4 rounded-lg w-full mb-2" style={{
                    background: `linear-gradient(to right, ${gradients.bad}, ${gradients.neutral}, ${gradients.good})`
                }} />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>Min</span>
                    <span>Mid</span>
                    <span>Max</span>
                </div>
            </div>
        </div>
    );
};
