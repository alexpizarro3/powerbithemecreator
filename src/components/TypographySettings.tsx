import { useState } from 'react';
import { Type, ChevronDown, ChevronUp } from 'lucide-react';
import { AdvancedColorPicker } from './AdvancedColorPicker';

export interface TextClassSettings {
    fontFamily: string;
    fontSize: number;
    color: string;
}

export interface TypographyState {
    global: string;
    title: TextClassSettings;
    callout: TextClassSettings;
    label: TextClassSettings;
    header: TextClassSettings;
}

interface TypographySettingsProps {
    typography: TypographyState;
    onChange: (newTypography: TypographyState) => void;
}

const COMMON_FONTS = [
    "Segoe UI", "Arial", "Calibri", "Cambria", "Consolas", "Courier New",
    "Georgia", "Helvetica", "Impact", "Lucida Console", "Tahoma",
    "Times New Roman", "Trebuchet MS", "Verdana"
];

export const TypographySettings = ({ typography, onChange }: TypographySettingsProps) => {
    const [expandedSection, setExpandedSection] = useState<keyof TypographyState | null>('global');
    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

    const updateGlobalFont = (font: string) => {
        onChange({ ...typography, global: font });
    };

    const updateTextClass = (key: keyof TypographyState, field: keyof TextClassSettings, value: string | number) => {
        if (key === 'global') return;

        const currentSettings = typography[key] as TextClassSettings;
        onChange({
            ...typography,
            [key]: { ...currentSettings, [field]: value }
        });
    };

    const renderTextClassSection = (key: keyof TypographyState, label: string, description: string) => {
        if (key === 'global') return null;

        const settings = typography[key] as TextClassSettings;
        const isExpanded = expandedSection === key;

        return (
            <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden transition-all">
                <button
                    onClick={() => setExpandedSection(isExpanded ? null : key)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isExpanded ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-400'}`}>
                            <Type size={18} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-medium text-white">{label}</h3>
                            <p className="text-xs text-slate-400">{description}</p>
                        </div>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {isExpanded && (
                    <div className="p-4 border-t border-white/5 space-y-4 bg-black/20">
                        {/* Font Family */}
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Font Family</label>
                            <select
                                value={settings.fontFamily}
                                onChange={(e) => updateTextClass(key, 'fontFamily', e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="" className="bg-slate-800 text-white">Inherit Global ({typography.global})</option>
                                {COMMON_FONTS.map(font => (
                                    <option key={font} value={font} className="bg-slate-800 text-white">{font}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Font Size */}
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Font Size (pt)</label>
                                <input
                                    type="number"
                                    value={settings.fontSize}
                                    onChange={(e) => updateTextClass(key, 'fontSize', Number(e.target.value))}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Color */}
                            <div className="space-y-2 relative">
                                <label className="text-xs text-slate-400">Color</label>
                                <div className="flex gap-2">
                                    <div
                                        className="w-10 h-9 rounded-lg border border-white/10 cursor-pointer relative overflow-hidden"
                                        style={{ backgroundColor: settings.color || 'transparent' }}
                                        onClick={() => setActiveColorPicker(activeColorPicker === key ? null : key)}
                                    >
                                        {!settings.color && (
                                            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 bg-white/5">
                                                Auto
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={settings.color}
                                            placeholder="Auto"
                                            onChange={(e) => updateTextClass(key, 'color', e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                                        />
                                        {settings.color && (
                                            <button
                                                onClick={() => updateTextClass(key, 'color', '')}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {activeColorPicker === key && (
                                    <AdvancedColorPicker
                                        color={settings.color || '#000000'}
                                        onChange={(hex) => updateTextClass(key, 'color', hex)}
                                        onClose={() => setActiveColorPicker(null)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Global Font Section */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <h3 className="text-sm font-medium text-white mb-4">Global Settings</h3>
                <div className="space-y-2">
                    <label className="text-xs text-slate-400">Base Font Family</label>
                    <select
                        value={typography.global}
                        onChange={(e) => updateGlobalFont(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                        {COMMON_FONTS.map(font => (
                            <option key={font} value={font} className="bg-slate-800 text-white">{font}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-medium text-white px-1">Text Classes</h3>
                {renderTextClassSection('title', 'Title', 'Visual titles and major headings')}
                {renderTextClassSection('callout', 'Callout', 'KPI cards and large data values')}
                {renderTextClassSection('label', 'Label', 'Axis labels, data labels, and legends')}
                {renderTextClassSection('header', 'Header', 'Table and matrix headers')}
            </div>
        </div>
    );
};
