import { useRef, useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, AlertTriangle, Wand2 } from 'lucide-react';
import { parseThemeJSON, type ThemeOptions } from '../utils/powerbi-theme';
import { getContrastRatio, hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '../utils/colors';

interface ThemeImporterProps {
    onImport: (theme: ThemeOptions) => void;
}

interface ValidationIssue {
    type: 'warning' | 'error';
    message: string;
    details?: string[];
}

export const ThemeImporter = ({ onImport }: ThemeImporterProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [issues, setIssues] = useState<ValidationIssue[]>([]);
    const [currentTheme, setCurrentTheme] = useState<ThemeOptions | null>(null);

    const validateTheme = (theme: ThemeOptions): ValidationIssue[] => {
        const issues: ValidationIssue[] = [];
        const bg = theme.pageBackground?.color || '#FFFFFF';

        if (theme.colors && theme.colors.length > 0) {
            const lowContrastColors = theme.colors.filter(hex => {
                const contrast = getContrastRatio(hex, bg);
                return contrast < 3; // WCAG 2.1 AA for graphical objects
            });

            if (lowContrastColors.length > 0) {
                issues.push({
                    type: 'warning',
                    message: `Found ${lowContrastColors.length} colors with low contrast against page background.`,
                    details: lowContrastColors
                });
            }
        }

        return issues;
    };

    const handleFile = (file: File) => {
        setError(null);
        setSuccess(null);
        setIssues([]);
        setCurrentTheme(null);

        if (!file.name.endsWith('.json')) {
            setError('Please upload a valid .json file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const themeOptions = parseThemeJSON(json);
                const validationIssues = validateTheme(themeOptions);

                setIssues(validationIssues);
                setCurrentTheme(themeOptions);
                onImport(themeOptions);
                setSuccess('Theme imported successfully!');

                // Only clear success if no issues, otherwise keep it visible with the warnings
                if (validationIssues.length === 0) {
                    setTimeout(() => setSuccess(null), 3000);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to parse theme file. Invalid JSON structure.');
            }
        };
        reader.readAsText(file);
    };

    const fixContrastIssues = () => {
        if (!currentTheme || !currentTheme.colors) return;

        const bg = currentTheme.pageBackground?.color || '#FFFFFF';
        const bgRgb = hexToRgb(bg);
        const bgL = bgRgb ? rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b).l : 100;

        // Strategy: If background is dark (L < 50), lighten colors. If light, darken them.
        const shouldLighten = bgL < 50;

        const fixedColors = currentTheme.colors.map(hex => {
            let currentHex = hex;
            let contrast = getContrastRatio(currentHex, bg);

            // Safety counter to prevent infinite loops
            let attempts = 0;

            if (contrast < 3) {
                const rgb = hexToRgb(hex);
                if (!rgb) return hex;

                let { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

                while (contrast < 3 && attempts < 20) {
                    // Shift lightness by 5%
                    if (shouldLighten) {
                        l = Math.min(100, l + 5);
                    } else {
                        l = Math.max(0, l - 5);
                    }

                    const newRgb = hslToRgb(h, s, l);
                    currentHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
                    contrast = getContrastRatio(currentHex, bg);
                    attempts++;
                }
            }
            return currentHex;
        });

        const fixedTheme = { ...currentTheme, colors: fixedColors };

        onImport(fixedTheme);
        setIssues([]);
        setSuccess('Fixed low contrast colors!');
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <div className="border-t border-white/10 pt-6 mt-6">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Import Existing Theme</h3>

            <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-white/20 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all group"
            >
                <div className="p-2 bg-slate-800 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                    <Upload size={18} />
                </div>
                <div className="text-sm text-slate-300 group-hover:text-white">
                    <span className="font-medium">Click to upload</span> JSON file
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
            </div>

            {error && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-3 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 size={14} />
                    {success}
                </div>
            )}

            {issues.length > 0 && (
                <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1">
                    {issues.map((issue, i) => (
                        <div key={i} className="flex flex-col gap-3 text-xs text-yellow-400 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                            <div className="flex items-center gap-2 font-medium">
                                <AlertTriangle size={14} />
                                {issue.message}
                            </div>
                            {issue.details && (
                                <div className="flex flex-wrap gap-1 ml-6">
                                    {issue.details.map((hex, j) => (
                                        <div
                                            key={j}
                                            className="w-4 h-4 rounded-full border border-white/20"
                                            style={{ backgroundColor: hex }}
                                            title={hex}
                                        />
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={fixContrastIssues}
                                className="ml-6 flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 px-3 py-2 rounded-lg transition-colors w-fit font-medium"
                            >
                                <Wand2 size={14} />
                                Auto-Fix Contrast
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
