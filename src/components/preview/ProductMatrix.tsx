import { LayoutGrid } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';

interface ProductMatrixProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
    dataGradients: { bad: string; neutral: string; good: string };
}

export const ProductMatrix = ({ theme, palette, borderRadius, getTextStyle, dataGradients }: ProductMatrixProps) => {
    return (
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
    );
};
