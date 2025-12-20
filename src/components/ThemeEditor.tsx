import { useState } from 'react';
import { Download, Settings, Type, Square, Copy, Check, TrendingUp } from 'lucide-react';
import type { ColorItem } from './PaletteGenerator';
import { generateThemeJSON, downloadTheme, type ThemeOptions } from '../utils/powerbi-theme';
import { ThemeImporter } from './ThemeImporter';
import { PageBackgroundSettings } from './PageBackgroundSettings';
import { FilterPaneSettings } from './FilterPaneSettings';
import { TypographySettings, type TypographyState } from './TypographySettings';
import { DataGradients } from './DataGradients';

interface ThemeEditorProps {
    colors: ColorItem[];
    setColors: (colors: ColorItem[]) => void;
    themeName: string;
    setThemeName: (name: string) => void;
    themeMode: 'light' | 'dark' | 'soft';
    setThemeMode: (mode: 'light' | 'dark' | 'soft') => void;
    borderRadius: number;
    setBorderRadius: (radius: number) => void;
    typography: TypographyState;
    setTypography: (typography: TypographyState) => void;
    pageBackground: { color: string; transparency: number };
    setPageBackground: (settings: { color: string; transparency: number }) => void;
    filterPane: { backgroundColor: string; foreColor: string; transparency: number };
    setFilterPane: (settings: { backgroundColor: string; foreColor: string; transparency: number }) => void;
    dataGradients: { bad: string; neutral: string; good: string };
    setDataGradients: (gradients: { bad: string; neutral: string; good: string }) => void;
}

export const ThemeEditor = ({
    colors,
    setColors,
    themeName,
    setThemeName,
    themeMode,
    setThemeMode,
    borderRadius,
    setBorderRadius,
    typography,
    setTypography,
    pageBackground,
    setPageBackground,
    filterPane,
    setFilterPane,
    dataGradients,
    setDataGradients
}: ThemeEditorProps) => {
    // themeName state removed
    const [activeTab, setActiveTab] = useState<'general' | 'typography' | 'pages' | 'filter' | 'gradients' | 'json'>('general');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const palette = colors.map(c => c.hex);
        const theme = generateThemeJSON({
            name: themeName,
            colors: palette,
            borderRadius,
            typography,
            isDarkMode: themeMode !== 'light',
            pageBackground,
            filterPane,
            ...dataGradients
        });
        navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        const palette = colors.map(c => c.hex);
        const theme = generateThemeJSON({
            name: themeName,
            colors: palette,
            borderRadius,
            typography,
            isDarkMode: themeMode !== 'light',
            pageBackground,
            filterPane,
            ...dataGradients
        });
        downloadTheme(theme);
    };


    const handleImport = (theme: ThemeOptions) => {
        setThemeName(theme.name);
        if (theme.borderRadius !== undefined) setBorderRadius(theme.borderRadius);

        // Handle imported typography
        if (theme.typography) {
            setTypography(theme.typography);
        } else if (theme.fontFamily) {
            // Legacy fallback
            setTypography({
                ...typography,
                global: theme.fontFamily
            });
        }

        if (theme.isDarkMode !== undefined) setThemeMode(theme.isDarkMode ? 'dark' : 'light');
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

        if (theme.bad && theme.neutral && theme.good) {
            setDataGradients({
                bad: theme.bad,
                neutral: theme.neutral,
                good: theme.good
            });
        }
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="text-blue-400" />
                <h2 className="text-xl font-semibold text-white/90">Theme Settings</h2>
            </div>

            <div className="flex gap-2 mb-6 bg-black/20 p-1 rounded-xl overflow-x-auto custom-scrollbar">
                {(['general', 'typography', 'pages', 'filter', 'gradients', 'json'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${activeTab === tab
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab === 'typography' && <Type size={14} />}
                        {tab === 'gradients' && <TrendingUp size={14} />}
                        {tab}
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
                            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">
                                Theme Mode
                            </label>
                            <div className="grid grid-cols-3 gap-2 bg-black/20 p-1 rounded-xl">
                                {(['light', 'soft', 'dark'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setThemeMode(mode)}
                                        className={`py-2 rounded-lg text-sm font-medium transition-colors capitalize ${themeMode === mode
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
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

                {activeTab === 'typography' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <TypographySettings
                            typography={typography}
                            onChange={setTypography}
                        />
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

                {activeTab === 'gradients' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <DataGradients
                            gradients={dataGradients}
                            onChange={setDataGradients}
                        />
                    </div>
                )}

                {activeTab === 'json' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 relative group">
                        <div className="absolute right-4 top-4 z-10">
                            <button
                                onClick={handleCopy}
                                className={`p-2 rounded-lg transition-all ${copied
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white'
                                    }`}
                                title="Copy to Clipboard"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <pre className="bg-black/30 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-auto max-h-[400px] custom-scrollbar border border-white/5">
                            {JSON.stringify(generateThemeJSON({
                                name: themeName,
                                colors: colors.map(c => c.hex),
                                borderRadius,
                                typography,
                                isDarkMode: themeMode !== 'light',
                                pageBackground,
                                filterPane,
                                ...dataGradients
                            }), null, 2)}
                        </pre>
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
