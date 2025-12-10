import { Filter } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';

interface FilterPaneMockupProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
}

export const SlicerMockup = ({ theme, palette, borderRadius, getTextStyle }: FilterPaneMockupProps) => {
    return (
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
    );
};
