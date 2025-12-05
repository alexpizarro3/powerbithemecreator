import { useState } from 'react';
import { Download, Settings, Type, Square } from 'lucide-react';
import type { ColorItem } from './PaletteGenerator';
import { generateThemeJSON, downloadTheme, type ThemeOptions } from '../utils/powerbi-theme';
import { ThemeImporter } from './ThemeImporter';
import { PageBackgroundSettings } from './PageBackgroundSettings';
import { FilterPaneSettings } from './FilterPaneSettings';

interface ThemeEditorProps {
    colors: ColorItem[];
    setColors: (colors: ColorItem[]) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    borderRadius: number;
    setBorderRadius: (radius: number) => void;
    fontFamily: string;
    setFontFamily: (font: string) => void;
    pageBackground: { color: string; transparency: number };
    setPageBackground: (settings: { color: string; transparency: number }) => void;
    filterPane: { backgroundColor: string; foreColor: string; transparency: number };
    setFilterPane: (settings: { backgroundColor: string; foreColor: string; transparency: number }) => void;
}

const FONT_OPTIONS = [
    "Segoe UI",
    "Arial",
    "Calibri",
    "DIN",
    "Georgia",
    "Verdana",
    "Trebuchet MS"
];

export const ThemeEditor = ({
    colors,
    setColors,
    isDarkMode,
    setIsDarkMode,
    borderRadius,
    setBorderRadius,
    fontFamily,
    setFontFamily,
    pageBackground,
    setPageBackground,
    filterPane,
    setFilterPane
}: ThemeEditorProps) => {
    const [themeName, setThemeName] = useState("My Custom Theme");
    const [activeTab, setActiveTab] = useState<'general' | 'pages' | 'filter'>('general');

    const handleExport = () => {
        const palette = colors.map(c => c.hex);
        const theme = generateThemeJSON({
            name: themeName,
            colors: palette,
            borderRadius,
            fontFamily,
            isDarkMode,
            pageBackground,
            filterPane
        });
        downloadTheme(theme);
    };
    const handleImport = (theme: ThemeOptions) => {
        setThemeName(theme.name);
        if (theme.borderRadius !== undefined) setBorderRadius(theme.borderRadius);
        if (theme.fontFamily) setFontFamily(theme.fontFamily);
        if (theme.isDarkMode !== undefined) setIsDarkMode(theme.isDarkMode);
        if (theme.pageBackground) setPageBackground(theme.pageBackground);
        if (theme.filterPane) setFilterPane(theme.filterPane);

        if (theme.colors && theme.colors.length > 0) {
            const newColors = theme.colors.map((hex, index) => ({
                id: `imported-${Date.now()}-${index}`,
                hex,
                locked: false
            }));
            setColors(newColors);
        }
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="text-blue-400" />
                <h2 className="text-xl font-semibold text-white/90">Theme Settings</h2>
            </div>

            <div className="flex gap-2 mb-6 bg-black/20 p-1 rounded-xl">
                {(['general', 'pages', 'filter'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">
                                Theme Name
                            </label>
                            <input
                                type="text"
                                value={themeName}
                                onChange={(e) => setThemeName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                placeholder="Enter theme name..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1 flex items-center gap-2">
                                <Type size={14} />
                                Font Family
                            </label>
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                            >
                                {FONT_OPTIONS.map(font => (
                                    <option key={font} value={font} className="bg-slate-900 text-white">{font}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1 flex items-center gap-2">
                                <Square size={14} />
                                Border Radius: {borderRadius}px
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={borderRadius}
                                onChange={(e) => setBorderRadius(Number(e.target.value))}
                                className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Sharp</span>
                                <span>Rounded</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'pages' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PageBackgroundSettings
                            color={pageBackground.color}
                            transparency={pageBackground.transparency}
                            onChange={(color, transparency) => setPageBackground({ color, transparency })}
                        />
                    </div>
                )}

                {activeTab === 'filter' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <FilterPaneSettings
                            backgroundColor={filterPane.backgroundColor}
                            foreColor={filterPane.foreColor}
                            transparency={filterPane.transparency}
                            onChange={setFilterPane}
                        />
                    </div>
                )}

                <div className="pt-4 border-t border-white/10">
                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-lg text-white shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-[98]"
                    >
                        <Download size={20} />
                        Export JSON
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">
                        Compatible with Power BI Desktop & Service
                    </p>
                </div>

                <ThemeImporter onImport={handleImport} />
            </div>
        </div>
    );
};
