import { Filter } from 'lucide-react';

interface FilterPaneSidebarProps {
    filterPane: { backgroundColor: string; foreColor: string; transparency: number };
    hexToRgba: (hex: string, transparency: number) => string;
    isDarkMode: boolean;
}

export const FilterPaneSidebar = ({ filterPane, hexToRgba, isDarkMode }: FilterPaneSidebarProps) => {
    return (
        <div
            className="w-64 border-l border-white/10 p-4 flex flex-col gap-4 transition-colors duration-300 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)] z-10"
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
                    className={`p-3 rounded border border-white/10 ${isDarkMode ? 'bg-black/5' : 'bg-slate-100/50 backdrop-blur-sm'}`}
                    style={{ borderColor: filterPane.foreColor + '20' }}
                >
                    <div className="text-xs font-medium mb-1 opacity-80">{filter}</div>
                    <div className="h-6 bg-black/10 rounded flex items-center px-2 text-[10px] opacity-60">
                        All
                    </div>
                </div>
            ))}
        </div>
    );
};
