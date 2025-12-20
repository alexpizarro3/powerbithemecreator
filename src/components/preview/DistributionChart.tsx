import { PieChart } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';

interface DistributionChartProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
    isDarkMode: boolean;
}

export const DistributionChart = ({ theme, palette, borderRadius, getTextStyle, isDarkMode }: DistributionChartProps) => {
    return (
        <div
            className={`${theme.card} p-6 border transition-colors duration-300 flex flex-col items-center justify-center`}
            style={{ borderRadius: `${borderRadius}px` }}
        >
            <div className={`flex items-center gap-2 mb-6 ${theme.subText} ${theme.pill} rounded-lg p-2 w-auto inline-flex`}>
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
