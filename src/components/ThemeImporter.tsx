import { useRef, useState } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseThemeJSON, type ThemeOptions } from '../utils/powerbi-theme';

interface ThemeImporterProps {
    onImport: (theme: ThemeOptions) => void;
}

export const ThemeImporter = ({ onImport }: ThemeImporterProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFile = (file: File) => {
        setError(null);
        setSuccess(null);

        if (!file.name.endsWith('.json')) {
            setError('Please upload a valid .json file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const themeOptions = parseThemeJSON(json);
                onImport(themeOptions);
                setSuccess('Theme imported successfully!');
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                console.error(err);
                setError('Failed to parse theme file. Invalid JSON structure.');
            }
        };
        reader.readAsText(file);
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
                <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-3 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-2 rounded-lg">
                    <CheckCircle2 size={14} />
                    {success}
                </div>
            )}
        </div>
    );
};
