import { BarChart3 } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';

interface SalesChartProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
    visualHeader?: { backgroundColor: string; fontColor: string; transparency: number };
}

export const SalesChart = ({ theme, palette, borderRadius, getTextStyle, visualHeader }: SalesChartProps) => {
    return (
        <div
            className={`w-full ${theme.card} p-6 border transition-colors duration-300 relative overflow-hidden`}
            style={{ borderRadius: `${borderRadius}px` }}
        >
            {/* Visual Header Simulation */}
            <div className="absolute top-0 left-0 right-0 h-8 flex items-center px-4 justify-end gap-2"
                style={visualHeader && visualHeader.transparency < 100 ? {
                    backgroundColor: visualHeader.backgroundColor,
                    opacity: 1 - (visualHeader.transparency / 100)
                } : { display: 'none' }}
            >
                {visualHeader && visualHeader.transparency < 100 && (
                    <div className="flex gap-1 opacity-50">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: visualHeader.fontColor }}></div>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: visualHeader.fontColor }}></div>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: visualHeader.fontColor }}></div>
                    </div>
                )}
            </div>

            <div className={`flex items-center gap-2 mb-6 ${theme.subText} ${theme.pill} rounded-lg p-2 inline-flex mt-4`}>
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
