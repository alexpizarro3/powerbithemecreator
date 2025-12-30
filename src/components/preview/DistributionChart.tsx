import { PieChart } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';

interface DistributionChartProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
    isDarkMode: boolean;
    visualHeader?: { backgroundColor: string; fontColor: string; transparency: number };
}

export const DistributionChart = ({ theme, palette, borderRadius, getTextStyle, isDarkMode, visualHeader }: DistributionChartProps) => {
    return (
        <div
            className={`${theme.card} p-6 border transition-colors duration-300 flex flex-col items-center justify-center relative overflow-hidden`}
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

            <div className={`flex items-center gap-2 mb-6 ${theme.subText} ${theme.pill} rounded-lg p-2 w-auto inline-flex mt-4`}>
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
                    <div key={i} className={`flex items-center gap-2 ${theme.pill} rounded px-2 py-1`}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: palette[i % 4] }} />
                        <span className={`text-xs ${theme.subText}`} style={getTextStyle('label')}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
