import { useState } from 'react';
import { Box, Layers, MousePointer2 } from 'lucide-react';
import { AdvancedColorPicker } from './AdvancedColorPicker';

export interface VisualContainerState {
    dropShadow: {
        show: boolean;
        color: string;
        transparency: number;
        blur: number;
        angle: number;
        distance: number;
    };
    header: {
        backgroundColor: string;
        fontColor: string;
        transparency: number;
    };
    tooltip: {
        backgroundColor: string;
        fontColor: string;
        transparency: number;
    };
}

interface VisualContainerSettingsProps {
    visualContainer: VisualContainerState;
    onChange: (settings: VisualContainerState) => void;
}

export const VisualContainerSettings = ({ visualContainer, onChange }: VisualContainerSettingsProps) => {
    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

    const updateShadow = (field: keyof VisualContainerState['dropShadow'], value: any) => {
        onChange({
            ...visualContainer,
            dropShadow: { ...visualContainer.dropShadow, [field]: value }
        });
    };

    const updateHeader = (field: keyof VisualContainerState['header'], value: any) => {
        onChange({
            ...visualContainer,
            header: { ...visualContainer.header, [field]: value }
        });
    };

    const updateTooltip = (field: keyof VisualContainerState['tooltip'], value: any) => {
        onChange({
            ...visualContainer,
            tooltip: { ...visualContainer.tooltip, [field]: value }
        });
    };

    return (
        <div className="space-y-6">
            {/* Drop Shadow Section */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Box size={18} className="text-blue-400" />
                        <h3 className="text-sm font-medium text-white">Drop Shadow</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={visualContainer.dropShadow.show}
                            onChange={(e) => updateShadow('show', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {visualContainer.dropShadow.show && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <label className="text-xs text-slate-400">Color</label>
                                <div
                                    className="h-9 rounded-lg border border-white/10 cursor-pointer overflow-hidden flex items-center justify-center relative"
                                    style={{ backgroundColor: visualContainer.dropShadow.color }}
                                    onClick={() => setActiveColorPicker(activeColorPicker === 'shadow' ? null : 'shadow')}
                                >
                                    <span className="text-xs mix-blend-difference text-white font-mono">{visualContainer.dropShadow.color}</span>
                                </div>
                                {activeColorPicker === 'shadow' && (
                                    <AdvancedColorPicker
                                        color={visualContainer.dropShadow.color}
                                        onChange={(hex) => updateShadow('color', hex)}
                                        onClose={() => setActiveColorPicker(null)}
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Transparency ({visualContainer.dropShadow.transparency}%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={visualContainer.dropShadow.transparency}
                                    onChange={(e) => updateShadow('transparency', Number(e.target.value))}
                                    className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Blur ({visualContainer.dropShadow.blur}px)</label>
                                <input
                                    type="number"
                                    value={visualContainer.dropShadow.blur}
                                    onChange={(e) => updateShadow('blur', Number(e.target.value))}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-sm text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Angle ({visualContainer.dropShadow.angle}°)</label>
                                <input
                                    type="number"
                                    value={visualContainer.dropShadow.angle}
                                    onChange={(e) => updateShadow('angle', Number(e.target.value))}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-sm text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Dist ({visualContainer.dropShadow.distance}px)</label>
                                <input
                                    type="number"
                                    value={visualContainer.dropShadow.distance}
                                    onChange={(e) => updateShadow('distance', Number(e.target.value))}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-sm text-white"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Visual Header Section */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Layers size={18} className="text-purple-400" />
                    <h3 className="text-sm font-medium text-white">Visual Header</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                        <label className="text-xs text-slate-400">Background</label>
                        <div
                            className="h-9 rounded-lg border border-white/10 cursor-pointer overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: visualContainer.header.backgroundColor === 'transparent' ? '' : visualContainer.header.backgroundColor }}
                            onClick={() => setActiveColorPicker(activeColorPicker === 'headerBg' ? null : 'headerBg')}
                        >
                            {visualContainer.header.backgroundColor === 'transparent' ? (
                                <span className="text-xs text-slate-500">None</span>
                            ) : (
                                <span className="text-xs mix-blend-difference text-white font-mono">{visualContainer.header.backgroundColor}</span>
                            )}
                        </div>
                        {activeColorPicker === 'headerBg' && (
                            <AdvancedColorPicker
                                color={visualContainer.header.backgroundColor === 'transparent' ? '#FFFFFF' : visualContainer.header.backgroundColor}
                                onChange={(hex) => updateHeader('backgroundColor', hex)}
                                onClose={() => setActiveColorPicker(null)}
                            />
                        )}
                    </div>
                    <div className="space-y-2 relative">
                        <label className="text-xs text-slate-400">Icon/Text Color</label>
                        <div
                            className="h-9 rounded-lg border border-white/10 cursor-pointer overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: visualContainer.header.fontColor }}
                            onClick={() => setActiveColorPicker(activeColorPicker === 'headerFont' ? null : 'headerFont')}
                        >
                            <span className="text-xs mix-blend-difference text-white font-mono">{visualContainer.header.fontColor}</span>
                        </div>
                        {activeColorPicker === 'headerFont' && (
                            <AdvancedColorPicker
                                color={visualContainer.header.fontColor}
                                onChange={(hex) => updateHeader('fontColor', hex)}
                                onClose={() => setActiveColorPicker(null)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Tooltip Section */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                    <MousePointer2 size={18} className="text-green-400" />
                    <h3 className="text-sm font-medium text-white">Tooltip Style</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                        <label className="text-xs text-slate-400">Background</label>
                        <div
                            className="h-9 rounded-lg border border-white/10 cursor-pointer overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: visualContainer.tooltip.backgroundColor }}
                            onClick={() => setActiveColorPicker(activeColorPicker === 'tooltipBg' ? null : 'tooltipBg')}
                        >
                            <span className="text-xs mix-blend-difference text-white font-mono">{visualContainer.tooltip.backgroundColor}</span>
                        </div>
                        {activeColorPicker === 'tooltipBg' && (
                            <AdvancedColorPicker
                                color={visualContainer.tooltip.backgroundColor}
                                onChange={(hex) => updateTooltip('backgroundColor', hex)}
                                onClose={() => setActiveColorPicker(null)}
                            />
                        )}
                    </div>
                    <div className="space-y-2 relative">
                        <label className="text-xs text-slate-400">Text Color</label>
                        <div
                            className="h-9 rounded-lg border border-white/10 cursor-pointer overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: visualContainer.tooltip.fontColor }}
                            onClick={() => setActiveColorPicker(activeColorPicker === 'tooltipFont' ? null : 'tooltipFont')}
                        >
                            <span className="text-xs mix-blend-difference text-white font-mono">{visualContainer.tooltip.fontColor}</span>
                        </div>
                        {activeColorPicker === 'tooltipFont' && (
                            <AdvancedColorPicker
                                color={visualContainer.tooltip.fontColor}
                                onChange={(hex) => updateTooltip('fontColor', hex)}
                                onClose={() => setActiveColorPicker(null)}
                            />
                        )}
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <label className="text-xs text-slate-400">Transparency ({visualContainer.tooltip.transparency}%)</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={visualContainer.tooltip.transparency}
                        onChange={(e) => updateTooltip('transparency', Number(e.target.value))}
                        className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};
