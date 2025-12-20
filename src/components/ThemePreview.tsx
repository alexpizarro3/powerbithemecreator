import { useState } from 'react';
import { Sun, Moon, Eye, Cloud } from 'lucide-react'; // Added Cloud for Soft mode icon if valid, or just logic
import { KPIGrid } from './preview/KPIGrid';
import { SlicerMockup } from './preview/SlicerMockup';
import { SalesChart } from './preview/SalesChart';
import { ProductMatrix } from './preview/ProductMatrix';
import { DistributionChart } from './preview/DistributionChart';
import { FilterPaneSidebar } from './preview/FilterPaneSidebar';
import type { ColorItem } from './PaletteGenerator';
import { VISION_MODES, COLOR_BLINDNESS_MATRICES, type VisionSimulationMode } from '../utils/accessibility';
import type { TypographyState } from './TypographySettings';

interface ThemePreviewProps {
    colors: ColorItem[];
    themeMode: 'light' | 'dark' | 'soft';
    setThemeMode: (mode: 'light' | 'dark' | 'soft') => void;
    pageBackground: { color: string; transparency: number };
    filterPane: { backgroundColor: string; foreColor: string; transparency: number };
    dataGradients: { bad: string; neutral: string; good: string };
    borderRadius: number;
    typography: TypographyState;
}

const hexToRgba = (hex: string, transparency: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    /* 
       Optimization: If transparency is 0 and hex is provided, standard RGBA.
       Ideally we use the provided transparency.
    */
    const alpha = 1 - (transparency / 100);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ThemePreview = ({
    colors,
    themeMode,
    setThemeMode,
    borderRadius,
    typography,
    pageBackground,
    filterPane,
    dataGradients
}: ThemePreviewProps) => {
    const [visionMode, setVisionMode] = useState<VisionSimulationMode>('normal');
    const palette = colors.map(c => c.hex);

    const primaryColor = colors[0]?.hex || '#3b82f6';
    const secondaryColor = colors[1]?.hex || primaryColor;
    const accentColor = colors[2]?.hex || secondaryColor;

    // Dynamic Background for Light Mode
    const lightModeGradient = `
        radial-gradient(circle at 0% 0%, ${hexToRgba(primaryColor, 85)} 0%, transparent 50%),
        radial-gradient(circle at 100% 0%, ${hexToRgba(secondaryColor, 88)} 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, ${hexToRgba(accentColor, 90)} 0%, transparent 50%),
        linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)
    `;

    // Determine background based on mode
    const getContainerBg = () => {
        switch (themeMode) {
            case 'light': return undefined; // Handled by style prop with gradient
            case 'soft': return 'bg-[#1A1A1A]'; // User JSON defined
            case 'dark': return 'bg-[#0f172a]'; // Slate-900
            default: return 'bg-[#0f172a]';
        }
    };

    const isLight = themeMode === 'light';
    // Soft and Dark are both considered "Dark" for contrast purposes in children
    const isDarkBool = !isLight;

    const theme = {
        container: getContainerBg() || '',
        text: isLight ? 'text-slate-950' : 'text-white/90',
        subText: isLight ? 'text-slate-600' : 'text-slate-400',

        // Card Styles
        card: isLight
            ? 'bg-white/90 border-slate-200/60 shadow-lg backdrop-blur-xl'
            : themeMode === 'soft'
                ? 'bg-black/20 border-white/5 shadow-none' // User JSON (20% transparency on black)
                : 'bg-black/20 border-white/5', // Dark

        cardBorder: isLight ? 'border-slate-200/60' : 'border-white/5',
        hover: isLight ? 'hover:bg-white shadow-md' : 'hover:bg-white/5',

        // Pills and Secondary
        pill: isLight ? 'bg-slate-100/50 backdrop-blur-sm' : 'bg-transparent',
        secondary: isLight ? 'bg-slate-100/50' : 'bg-white/5',
    };



    // Helper to get font style
    const getTextStyle = (type: 'title' | 'callout' | 'label' | 'header') => {
        const settings = typography[type];
        return {
            fontFamily: settings.fontFamily || typography.global,
            fontSize: `${settings.fontSize}pt`,
            color: settings.color || undefined
        };
    };

    return (
        <div
            className={`${theme.container} backdrop-blur-xl border p-6 shadow-2xl h-full overflow-y-auto custom-scrollbar transition-all duration-500 flex flex-col`}
            style={{
                borderRadius: `${borderRadius + 8}px`,
                fontFamily: typography.global,
                background: isLight ? lightModeGradient : undefined,
                borderColor: isLight ? 'rgba(226, 232, 240, 0.5)' : 'rgba(255, 255, 255, 0.1)'
            }}
        >
            {/* SVG Filters for Color Blindness Simulation */}
            <svg className="hidden">
                <defs>
                    {Object.entries(COLOR_BLINDNESS_MATRICES).map(([mode, matrix]) => (
                        <filter key={mode} id={`filter-${mode}`}>
                            <feColorMatrix
                                type="matrix"
                                values={matrix}
                            />
                        </filter>
                    ))}
                </defs>
            </svg>

            <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className={`text-xl font-semibold ${theme.text}`}>Theme Preview</h2>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isDarkBool ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                            <Eye size={16} />
                            <span className="hidden sm:inline">{VISION_MODES.find(m => m.value === visionMode)?.label}</span>
                        </button>

                        <div className="absolute right-0 top-full mt-2 w-48 py-1 rounded-xl shadow-xl border border-white/10 bg-slate-800 backdrop-blur-xl z-50 hidden group-hover:block">
                            {VISION_MODES.map((mode) => (
                                <button
                                    key={mode.value}
                                    onClick={() => setVisionMode(mode.value)}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${visionMode === mode.value
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme Toggle (Segmented Control Style) */}
                    <div className={`flex rounded-lg p-1 border backdrop-blur-md transition-colors ${isLight
                        ? 'bg-slate-200/50 border-slate-200/60'
                        : 'bg-black/40 border-white/5'
                        }`}>
                        <button
                            onClick={() => setThemeMode('light')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${themeMode === 'light'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : isLight
                                    ? 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            title="Light Mode"
                        >
                            <Sun size={14} />
                            <span className="hidden sm:inline">Light</span>
                        </button>
                        <button
                            onClick={() => setThemeMode('soft')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${themeMode === 'soft'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : isLight
                                    ? 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            title="Soft Dark Mode"
                        >
                            <Cloud size={14} />
                            <span className="hidden sm:inline">Soft</span>
                        </button>
                        <button
                            onClick={() => setThemeMode('dark')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${themeMode === 'dark'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : isLight
                                    ? 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            title="Dark Mode"
                        >
                            <Moon size={14} />
                            <span className="hidden sm:inline">Dark</span>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="flex border border-white/10 rounded-xl overflow-hidden h-[800px] transition-all duration-300"
                style={{ filter: visionMode !== 'normal' ? `url(#filter-${visionMode})` : 'none' }}
            >
                {/* Report Page */}
                <div
                    className={`flex-1 p-6 overflow-y-auto custom-scrollbar transition-colors duration-300 ${theme.text}`}
                    style={{
                        backgroundColor: hexToRgba(pageBackground.color, pageBackground.transparency)
                    }}
                >
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-3xl" style={{ ...getTextStyle('title'), fontSize: undefined }}>Executive Dashboard</h1>
                            <p className={`text-sm ${theme.subText}`}>Last updated: Today</p>
                        </div>

                        {/* KPI Cards */}
                        <KPIGrid
                            theme={theme}
                            palette={palette}
                            borderRadius={borderRadius}
                            getTextStyle={getTextStyle}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Slicer Mockup */}
                            <SlicerMockup
                                theme={theme}
                                palette={palette}
                                borderRadius={borderRadius}
                                getTextStyle={getTextStyle}
                            />
                            {/* Bar Chart Mockup */}
                            <SalesChart
                                theme={theme}
                                palette={palette}
                                borderRadius={borderRadius}
                                getTextStyle={getTextStyle}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Matrix Mockup */}
                            <ProductMatrix
                                theme={theme}
                                palette={palette}
                                borderRadius={borderRadius}
                                getTextStyle={getTextStyle}
                                dataGradients={dataGradients}
                            />
                            {/* Pie Chart Mockup */}
                            <DistributionChart
                                theme={theme}
                                palette={palette}
                                borderRadius={borderRadius}
                                getTextStyle={getTextStyle}
                                isDarkMode={isDarkBool}
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Pane Mockup */}
                <FilterPaneSidebar
                    filterPane={filterPane}
                    hexToRgba={hexToRgba}
                    isDarkMode={isDarkBool}
                />
            </div>
        </div>
    );
};
