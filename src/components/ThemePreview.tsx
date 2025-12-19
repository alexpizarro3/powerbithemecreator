import { useState } from 'react';
import { Sun, Moon, Eye } from 'lucide-react';
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
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
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
    const alpha = 1 - (transparency / 100);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ThemePreview = ({
    colors,
    isDarkMode,
    setIsDarkMode,
    borderRadius,
    typography,
    pageBackground,
    filterPane,
    dataGradients
}: ThemePreviewProps) => {
    const [visionMode, setVisionMode] = useState<VisionSimulationMode>('normal');
    const palette = colors.map(c => c.hex);

    const theme = {
        container: isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white/80 border-slate-200',
        text: isDarkMode ? 'text-white/90' : 'text-slate-900',
        subText: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        card: isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200 shadow-sm',
        cardBorder: isDarkMode ? 'border-white/5' : 'border-slate-200',
        hover: isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100',
    };

    // Helper to get font style
    const getTextStyle = (type: 'title' | 'callout' | 'label' | 'header') => {
        const settings = typography[type];
        return {
            fontFamily: settings.fontFamily || typography.global,
            fontSize: `${settings.fontSize}pt`,
            color: settings.color || undefined // Allow inheriting color if empty
        };
    };

    return (
        <div
            className={`${theme.container} backdrop-blur-xl border p-6 shadow-2xl h-full overflow-y-auto custom-scrollbar transition-colors duration-300 flex flex-col`}
            style={{ borderRadius: `${borderRadius + 8}px`, fontFamily: typography.global }}
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
                        <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
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

                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
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
                        <KPIGrid theme={theme} palette={palette} borderRadius={borderRadius} getTextStyle={getTextStyle} />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Slicer Mockup */}
                            <SlicerMockup theme={theme} palette={palette} borderRadius={borderRadius} getTextStyle={getTextStyle} />
                            {/* Bar Chart Mockup */}
                            <SalesChart theme={theme} palette={palette} borderRadius={borderRadius} getTextStyle={getTextStyle} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Matrix Mockup */}
                            <ProductMatrix theme={theme} palette={palette} borderRadius={borderRadius} getTextStyle={getTextStyle} dataGradients={dataGradients} />
                            {/* Pie Chart Mockup */}
                            <DistributionChart theme={theme} palette={palette} borderRadius={borderRadius} getTextStyle={getTextStyle} isDarkMode={isDarkMode} />
                        </div>
                    </div>
                </div>

                {/* Filter Pane Mockup */}
                <FilterPaneSidebar filterPane={filterPane} hexToRgba={hexToRgba} />
            </div>
        </div>
    );
};
