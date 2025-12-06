import { useState } from 'react';
import { BarChart3, PieChart, Filter, LayoutGrid, ArrowUpRight, ArrowDownRight, Sun, Moon, Eye } from 'lucide-react';
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
        card: isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200',
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
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Total Revenue', value: '$2.4M', trend: '+12%', up: true },
                                { label: 'Active Users', value: '45.2K', trend: '+5%', up: true },
                                { label: 'Bounce Rate', value: '12%', trend: '-2%', up: false },
                            ].map((kpi, i) => (
                                <div
                                    key={i}
                                    className={`${theme.card} p-4 border relative overflow-hidden group transition-colors duration-300`}
                                    style={{ borderRadius: `${borderRadius}px` }}
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: palette[i % palette.length] }} />
                                    <p className="text-xs uppercase tracking-wider font-medium mb-1" style={getTextStyle('label')}>{kpi.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="font-bold" style={getTextStyle('callout')}>{kpi.value}</h3>
                                        <span className={`text-xs font-medium flex items-center ${kpi.up ? 'text-green-500' : 'text-red-500'}`}>
                                            {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                            {kpi.trend}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Slicer Mockup */}
                            <div
                                className={`md:col-span-1 ${theme.card} p-4 border h-full transition-colors duration-300`}
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                <div className={`flex items-center gap-2 mb-4 ${theme.subText}`}>
                                    <Filter size={16} />
                                    <span className="text-xs font-medium uppercase tracking-wider" style={getTextStyle('header')}>Filter by Year</span>
                                </div>
                                <div className="space-y-2">
                                    {['2024', '2023', '2022', '2021'].map((year, i) => (
                                        <div
                                            key={year}
                                            className={`p-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${i === 0 ? 'text-white shadow-lg' : `${theme.subText} ${theme.hover}`}`}
                                            style={i === 0 ? { backgroundColor: palette[0] } : {}}
                                        >
                                            {year}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bar Chart Mockup */}
                            <div
                                className={`md:col-span-2 ${theme.card} p-6 border transition-colors duration-300`}
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                <div className={`flex items-center gap-2 mb-6 ${theme.subText}`}>
                                    <BarChart3 size={18} />
                                    <span className="text-sm font-medium uppercase tracking-wider" style={getTextStyle('title')}>Sales by Region</span>
                                </div>
                                <div className="flex items-end gap-4 h-40 px-2">
                                    {[60, 80, 45, 90, 30].map((height, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-90 cursor-pointer group relative"
                                            style={{
                                                height: `${height}%`,
                                                backgroundColor: palette[i % palette.length],
                                            }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                ${height}k
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Matrix Mockup */}
                            <div
                                className={`${theme.card} p-6 border transition-colors duration-300`}
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                <div className={`flex items-center gap-2 mb-6 ${theme.subText}`}>
                                    <LayoutGrid size={18} />
                                    <span className="text-sm font-medium uppercase tracking-wider" style={getTextStyle('title')}>Product Matrix</span>
                                </div>
                                <div className={`w-full overflow-hidden rounded-lg border ${theme.cardBorder} text-sm`}>
                                    <div className="grid grid-cols-3 p-3 font-semibold text-white" style={{ backgroundColor: palette[0] }}>
                                        <div style={getTextStyle('header')}>Category</div>
                                        <div className="text-right" style={getTextStyle('header')}>Units</div>
                                        <div className="text-right" style={getTextStyle('header')}>Margin</div>
                                    </div>
                                    {[
                                        { cat: 'Electronics', units: 450, margin: '25%', score: 'bad' },
                                        { cat: 'Clothing', units: 320, margin: '40%', score: 'good' },
                                        { cat: 'Home', units: 180, margin: '35%', score: 'neutral' },
                                    ].map((row, i) => (
                                        <div key={i} className={`grid grid-cols-3 p-3 border-b ${theme.cardBorder} ${theme.subText} ${theme.hover}`}>
                                            <div className={`font-medium pl-2 border-l-2 ${theme.text}`} style={{ borderColor: palette[i % palette.length] }}>{row.cat}</div>
                                            <div className="text-right">{row.units}</div>
                                            <div className="text-right font-medium" style={{
                                                color: dataGradients ? (
                                                    row.score === 'good' ? dataGradients.good :
                                                        row.score === 'bad' ? dataGradients.bad :
                                                            dataGradients.neutral
                                                ) : 'inherit'
                                            }}>
                                                {row.margin}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pie Chart Mockup */}
                            <div
                                className={`${theme.card} p-6 border transition-colors duration-300 flex flex-col items-center justify-center`}
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                <div className={`flex items-center gap-2 mb-6 ${theme.subText} w-full`}>
                                    <PieChart size={18} />
                                    <span className="text-sm font-medium uppercase tracking-wider" style={getTextStyle('title')}>Distribution</span>
                                </div>
                                <div className={`relative w-40 h-40 rounded-full overflow-hidden shadow-2xl ring-4 ${isDarkMode ? 'ring-white/5' : 'ring-slate-200'}`}
                                    style={{
                                        background: `conic-gradient(
                                            ${palette[0]} 0% 30%,
                                            ${palette[1]} 30% 55%,
                                            ${palette[2]} 55% 80%,
                                            ${palette[3]} 80% 100%
                                        )`
                                    }}
                                />
                                <div className="flex gap-4 mt-6 justify-center flex-wrap">
                                    {['A', 'B', 'C', 'D'].map((label, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: palette[i % 4] }} />
                                            <span className={`text-xs ${theme.subText}`} style={getTextStyle('label')}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Pane Mockup */}
                <div
                    className="w-64 border-l border-white/10 p-4 flex flex-col gap-4 transition-colors duration-300"
                    style={{
                        backgroundColor: hexToRgba(filterPane.backgroundColor, filterPane.transparency),
                        color: filterPane.foreColor
                    }}
                >
                    <div className="flex items-center gap-2 mb-4 opacity-70">
                        <Filter size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
                    </div>

                    {['Region', 'Category', 'Year', 'Segment'].map((filter, i) => (
                        <div
                            key={i}
                            className="p-3 rounded border border-white/10 bg-black/5"
                            style={{ borderColor: filterPane.foreColor + '20' }}
                        >
                            <div className="text-xs font-medium mb-1 opacity-80">{filter}</div>
                            <div className="h-6 bg-black/10 rounded flex items-center px-2 text-[10px] opacity-60">
                                All
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
