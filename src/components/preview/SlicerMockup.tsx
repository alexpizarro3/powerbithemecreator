import { Filter } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';
import { getOptimalTextColor } from '../../utils/colors';

interface FilterPaneMockupProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
}

export const SlicerMockup = ({ theme, palette, borderRadius, getTextStyle }: FilterPaneMockupProps) => {
    return (
        <div
            className={`w-full ${theme.card} p-4 border transition-colors duration-300 flex flex-col justify-between`}
            style={{ borderRadius: `${borderRadius}px` }}
        >
            <div className={`flex items-center gap-2 ${theme.subText}`}>
                <Filter size={16} />
                <span className="text-xs font-medium uppercase tracking-wider" style={getTextStyle('header')}>Filter by Year</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {['2025', '2024'].map((year, i) => (
                    <div
                        key={year}
                        className={`py-1.5 px-2 rounded-md text-sm font-bold cursor-pointer transition-all text-center flex items-center justify-center ${i === 0 ? 'ring-2 ring-offset-1 ring-offset-transparent' : `${theme.secondary} hover:bg-slate-200/80 ${theme.subText} opacity-60`}`}
                        style={i === 0 ? {
                            backgroundColor: palette[0],
                            color: getOptimalTextColor(palette[0]),
                            borderColor: palette[0]
                        } : {}}
                    >
                        {year}
                    </div>
                ))}
            </div>
        </div>
    );
};
