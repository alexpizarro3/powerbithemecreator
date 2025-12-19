import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ColorThief from 'colorthief';
import { X, Check, Briefcase, Wand2, Palette } from 'lucide-react';
import { generateHarmoniousPalette, type HarmonyMode } from '../utils/colors';

interface ImageToPaletteProps {
    onPaletteGenerated: (colors: string[]) => void;
    onClose: () => void;
}

export const ImageToPalette = ({ onPaletteGenerated, onClose }: ImageToPaletteProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [extractedColors, setExtractedColors] = useState<string[]>([]);
    const [selectedBrandColor, setSelectedBrandColor] = useState<string | null>(null);
    const [brandMode, setBrandMode] = useState<HarmonyMode>('monochromatic');
    const [previewPalette, setPreviewPalette] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
            setExtractedColors([]);
            setSelectedBrandColor(null);
            setPreviewPalette([]);
        };
        reader.readAsDataURL(file);
    };

    const extractColors = () => {
        if (!imgRef.current) return;

        try {
            const colorThief = new ColorThief();
            // Get slightly more colors to give better options
            const palette = colorThief.getPalette(imgRef.current, 8);

            const hexPalette = palette.map(rgb => {
                return '#' + rgb.map(x => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }).join('');
            });

            setExtractedColors(hexPalette);

            // Auto-select the most colorful/vibrant one as default (simple heuristic: highest saturation)
            // For now, just pick the first one which is usually dominant
            if (hexPalette.length > 0) {
                handleBrandColorSelect(hexPalette[0]);
            }
        } catch (e) {
            console.error("Error extracting colors", e);
        }
    };

    const handleBrandColorSelect = (color: string) => {
        setSelectedBrandColor(color);
        // If mode is 'original', we ignore the specific brand color selection for harmony generation
        // But we still set it as 'selected' UI state
        if (brandMode === 'original') {
            setPreviewPalette(extractedColors.slice(0, 5));
        } else {
            const harmonious = generateHarmoniousPalette(color, brandMode, 5);
            setPreviewPalette(harmonious);
        }
    };

    const updateHarmonyMode = (mode: HarmonyMode) => {
        setBrandMode(mode);

        if (mode === 'original') {
            // Just take the top 5 extracted colors
            // If we have fewer than 5, we might need to pad them? For now assume > 5 or use what we have
            // Ideally we should have extracted 8.
            setPreviewPalette(extractedColors.slice(0, 5));
        } else if (selectedBrandColor) {
            const harmonious = generateHarmoniousPalette(selectedBrandColor, mode, 5);
            setPreviewPalette(harmonious);
        }
    };

    const applyTheme = () => {
        if (previewPalette.length > 0) {
            onPaletteGenerated(previewPalette);
            onClose();
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                {/* Left Panel: Upload & Preview */}
                <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-slate-900/50">
                    <div className="flex justify-between items-center mb-4 md:hidden">
                        <h3 className="text-lg font-semibold text-white">Brand Kit</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {!imagePreview ? (
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all min-h-[300px] ${isDragging
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                }`}
                        >
                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                                <Briefcase size={32} />
                            </div>
                            <div className="text-center p-4">
                                <p className="text-white text-lg font-medium">Upload Company Logo</p>
                                <p className="text-slate-400 text-sm mt-1">We'll identify your brand colors automatically</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 flex-1 min-h-[200px] flex items-center justify-center p-4">
                                <img
                                    ref={imgRef}
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain"
                                    crossOrigin="anonymous"
                                    onLoad={extractColors}
                                />
                                <button
                                    onClick={() => setImagePreview(null)}
                                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {extractedColors.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Detected Brand Colors</p>
                                    <div className="flex flex-wrap gap-2">
                                        {extractedColors.map((color, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleBrandColorSelect(color)}
                                                className={`w-10 h-10 rounded-lg ring-2 transition-all ${selectedBrandColor === color ? 'ring-white scale-110 shadow-lg' : 'ring-transparent opacity-80 hover:opacity-100 hover:scale-105'}`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">Click a color to set as Primary Brand Color</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel: Configuration */}
                <div className="w-full md:w-1/2 p-8 bg-slate-800/30 flex flex-col h-full overflow-y-auto">
                    <div className="hidden md:flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <Wand2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Brand Theme Generator</h3>
                                <p className="text-sm text-slate-400">Professional colors for enterprise data</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {selectedBrandColor ? (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-300">Brand Personality</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { id: 'original', name: 'Original Logo Colors', desc: 'Use the exact colors extracted from the image.' },
                                        { id: 'monochromatic', name: 'Professional & Safe', desc: 'Variations of your brand color. Best for corporate reporting.' },
                                        { id: 'analogous', name: 'Vibrant & Modern', desc: 'Neighboring colors. Rich and harmonious look.' },
                                        { id: 'complementary', name: 'High Contrast', desc: 'Opposite colors. Bold and impact-focused.' },
                                        { id: 'split-complementary', name: 'Dynamic', desc: 'Balanced contrast. Colorful yet professional.' },
                                        { id: 'triadic', name: 'Playful', desc: 'High energy tri-color scheme.' },
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => updateHarmonyMode(mode.id as HarmonyMode)}
                                            className={`text-left p-3 rounded-xl border transition-all ${brandMode === mode.id
                                                ? 'bg-blue-600/20 border-blue-500/50 ring-1 ring-blue-500/50'
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className={`font-medium ${brandMode === mode.id ? 'text-white' : 'text-slate-300'}`}>{mode.name}</span>
                                                {brandMode === mode.id && <Check size={16} className="text-blue-400" />}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{mode.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className="text-sm font-medium text-slate-300">Generated Palette</label>
                                    <span className="text-xs text-slate-500 font-mono">5 Colors</span>
                                </div>
                                <div className="h-16 flex rounded-xl overflow-hidden ring-1 ring-white/10 shadow-xl">
                                    {previewPalette.map((color, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 flex items-end justify-center pb-2 group relative"
                                            style={{ backgroundColor: color }}
                                        >
                                            <span className="text-[10px] uppercase font-mono bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {color}
                                            </span>
                                            {i === 0 && (
                                                <span className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 text-black px-1.5 py-0.5 rounded shadow-sm">
                                                    PRIMARY
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={applyTheme}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Palette size={20} />
                                Apply Brand Theme
                            </button>

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                            <Wand2 size={48} />
                            <p className="text-center max-w-[200px]">Upload a logo to unlock the generator</p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
