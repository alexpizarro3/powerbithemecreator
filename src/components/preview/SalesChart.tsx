import { BarChart3 } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';

interface SalesChartProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
}

export const SalesChart = ({ theme, palette, borderRadius, getTextStyle }: SalesChartProps) => {
    return (
        <div
            className={`md:col-span-2 ${theme.card} p-6 border transition-colors duration-300`}
            style={{ borderRadius: `${borderRadius}px` }}
        >
            <div className={`flex items-center gap-2 mb-6 ${theme.subText} ${theme.pill} rounded-lg p-2 inline-flex`}>
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
    );
};
