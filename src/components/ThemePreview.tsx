import { BarChart3, PieChart, Filter, LayoutGrid, ArrowUpRight, ArrowDownRight, Sun, Moon } from 'lucide-react';
import type { ColorItem } from './PaletteGenerator';

interface ThemePreviewProps {
    colors: ColorItem[];
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    pageBackground: { color: string; transparency: number };
    filterPane: { backgroundColor: string; foreColor: string; transparency: number };
    borderRadius: number;
    fontFamily: string;
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
    fontFamily,
    pageBackground,
    filterPane
}: ThemePreviewProps) => {
    const palette = colors.map(c => c.hex);

    const theme = {
        container: isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white/80 border-slate-200',
        text: isDarkMode ? 'text-white/90' : 'text-slate-900',
        subText: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        card: isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200',
        cardBorder: isDarkMode ? 'border-white/5' : 'border-slate-200',
        hover: isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100',
    };

    return (
        <div
            className={`${theme.container} backdrop-blur-xl border p-6 shadow-2xl h-full overflow-y-auto custom-scrollbar transition-colors duration-300`}
            style={{ borderRadius: `${borderRadius + 8}px`, fontFamily }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${theme.text}`}>Theme Preview</h2>
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <div className="flex border border-white/10 rounded-xl overflow-hidden h-[800px]">
                {/* Report Page */}
                <div
                    className="flex-1 p-6 overflow-y-auto custom-scrollbar transition-colors duration-300"
                    style={{
                        backgroundColor: hexToRgba(pageBackground.color, pageBackground.transparency)
                    }}
                >
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className={`text-3xl font-bold ${theme.text}`}>Executive Dashboard</h1>
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
                                    <p className={`${theme.subText} text-xs uppercase tracking-wider font-medium mb-1`}>{kpi.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className={`text-2xl font-bold ${theme.text}`}>{kpi.value}</h3>
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
                                    <span className="text-xs font-medium uppercase tracking-wider">Filter by Year</span>
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
                                    <span className="text-sm font-medium uppercase tracking-wider">Sales by Region</span>
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
                                    <span className="text-sm font-medium uppercase tracking-wider">Product Matrix</span>
                                </div>
                                <div className={`w-full overflow-hidden rounded-lg border ${theme.cardBorder} text-sm`}>
                                    <div className="grid grid-cols-3 p-3 font-semibold text-white" style={{ backgroundColor: palette[0] }}>
                                        <div>Category</div>
                                        <div className="text-right">Units</div>
                                        <div className="text-right">Margin</div>
                                    </div>
                                    {[
                                        { cat: 'Electronics', units: 450, margin: '25%' },
                                        { cat: 'Clothing', units: 320, margin: '40%' },
                                        { cat: 'Home', units: 180, margin: '35%' },
                                    ].map((row, i) => (
                                        <div key={i} className={`grid grid-cols-3 p-3 border-b ${theme.cardBorder} ${theme.subText} ${theme.hover}`}>
                                            <div className={`font-medium pl-2 border-l-2 ${theme.text}`} style={{ borderColor: palette[i % palette.length] }}>{row.cat}</div>
                                            <div className="text-right">{row.units}</div>
                                            <div className="text-right">{row.margin}</div>
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
                                    <span className="text-sm font-medium uppercase tracking-wider">Distribution</span>
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
                                            <span className={`text-xs ${theme.subText}`}>{label}</span>
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
