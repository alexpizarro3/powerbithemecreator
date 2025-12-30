import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { PreviewTheme, GetTextStyle } from './types';

interface KPIGridProps {
    theme: PreviewTheme;
    palette: string[];
    borderRadius: number;
    getTextStyle: GetTextStyle;
    visualHeader?: { backgroundColor: string; fontColor: string; transparency: number };
}

export const KPIGrid = ({ theme, palette, borderRadius, getTextStyle, visualHeader }: KPIGridProps) => {
    const kpis = [
        { label: 'Total Revenue', value: '$2.4M', trend: '+12%', up: true },
        { label: 'Active Users', value: '45.2K', trend: '+5%', up: true },
        { label: 'Bounce Rate', value: '12%', trend: '-2%', up: false },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {kpis.map((kpi, i) => (
                <div
                    key={i}
                    className={`${theme.card} p-4 border relative overflow-hidden group transition-colors duration-300`}
                    style={{ borderRadius: `${borderRadius}px` }}
                >
                    {/* Visual Header Simulation */}
                    <div className="absolute top-0 left-0 right-0 h-6 flex items-center px-2 justify-end gap-1 mb-2"
                        style={visualHeader && visualHeader.transparency < 100 ? {
                            backgroundColor: visualHeader.backgroundColor,
                            opacity: 1 - (visualHeader.transparency / 100)
                        } : { display: 'none' }}
                    >
                        {visualHeader && visualHeader.transparency < 100 && (
                            <div className="flex gap-1 opacity-50">
                                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: visualHeader.fontColor }}></div>
                                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: visualHeader.fontColor }}></div>
                            </div>
                        )}
                    </div>

                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: palette[i % palette.length] }} />
                    <div className={`${theme.pill} rounded-md px-2 py-1 mb-2 inline-block`}>
                        <p className="text-xs uppercase tracking-wider font-medium" style={getTextStyle('label')}>{kpi.label}</p>
                    </div>
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
    );
};
