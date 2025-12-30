import { LayoutGrid } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';
import { getOptimalTextColor } from '../../utils/colors';

interface ProductMatrixProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
    dataGradients: { bad: string; neutral: string; good: string };
    visualHeader?: { backgroundColor: string; fontColor: string; transparency: number };
}

export const ProductMatrix = ({ theme, palette, borderRadius, getTextStyle, dataGradients, visualHeader }: ProductMatrixProps) => {
    const headerTextColor = getOptimalTextColor(palette[0]);
    return (
        <div
            className={`${theme.card} p-6 border transition-colors duration-300 relative overflow-hidden`}
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
                <LayoutGrid size={18} />
                <span className="text-sm font-medium uppercase tracking-wider" style={getTextStyle('title')}>Product Matrix</span>
            </div>
            <div className={`w-full overflow-hidden rounded-lg border ${theme.cardBorder} text-sm`}>
                <div
                    className="grid grid-cols-[2fr_1fr_1fr] p-3 font-semibold shadow-sm transition-colors duration-300"
                    style={{
                        backgroundColor: palette[0],
                        color: headerTextColor
                    }}
                >
                    <div style={getTextStyle('header')}>Category</div>
                    <div className="text-right" style={getTextStyle('header')}>Units</div>
                    <div className="text-right" style={getTextStyle('header')}>Margin</div>
                </div>
                {[
                    { cat: 'Electronics', units: 450, margin: '25%', score: 'bad' },
                    { cat: 'Clothing', units: 320, margin: '40%', score: 'good' },
                    { cat: 'Home', units: 180, margin: '35%', score: 'neutral' },
                ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-[2fr_1fr_1fr] p-3 border-b ${theme.cardBorder} ${theme.subText} ${theme.hover}`}>
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
    );
};
