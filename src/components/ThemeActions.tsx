import { useRef, useState } from 'react';
import { Download, Upload, Copy, Check, RotateCcw } from 'lucide-react';
import { downloadTheme, generateThemeJSON, parseThemeJSON, type ThemeOptions } from '../utils/powerbi-theme';
import type { ColorItem } from './PaletteGenerator';
import type { TypographyState } from './TypographySettings';
import type { VisualContainerState } from './VisualContainerSettings';

interface ThemeActionsProps {
    colors: ColorItem[];
    themeName: string;
    isDarkMode: boolean;
    borderRadius: number;
    typography: TypographyState;
    pageBackground: { color: string; transparency: number };
    filterPane: { backgroundColor: string; foreColor: string; transparency: number };
    dataGradients: { bad: string; neutral: string; good: string };
    visualContainer: VisualContainerState;
    onImport: (theme: ThemeOptions) => void;
    onReset: () => void;
}

export const ThemeActions = ({
    colors,
    themeName,
    isDarkMode,
    borderRadius,
    typography,
    pageBackground,
    filterPane,
    dataGradients,
    visualContainer,
    onImport,
    onReset
}: ThemeActionsProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const handleExport = () => {
        const palette = colors.map(c => c.hex);
        const theme = generateThemeJSON({
            name: themeName,
            colors: palette,
            borderRadius,
            typography,
            isDarkMode,
            pageBackground,
            filterPane,
            ...dataGradients,
            visualContainer
        });
        downloadTheme(theme);
    };

    const handleCopy = async () => {
        const palette = colors.map(c => c.hex);
        const theme = generateThemeJSON({
            name: themeName,
            colors: palette,
            borderRadius,
            typography,
            isDarkMode,
            pageBackground,
            filterPane,
            ...dataGradients,
            visualContainer
        });

        try {
            await navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the theme to defaults? This will clear all your changes.')) {
            onReset();
        }
    };

    const handleFile = (file: File) => {
        if (!file.name.endsWith('.json')) {
            alert('Please upload a valid .json file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const themeOptions = parseThemeJSON(json);
                onImport(themeOptions);
            } catch (err) {
                console.error(err);
                alert('Failed to parse theme file.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mr-2"
                title="Reset to defaults"
            >
                <RotateCcw size={18} />
            </button>

            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-white/10"
            >
                <Upload size={16} />
                <span>Import JSON</span>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-white/10 ${copyStatus === 'copied'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
            >
                {copyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                <span>{copyStatus === 'copied' ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
                <Download size={16} />
                <span>Export JSON</span>
            </button>
        </div>
    );
};
