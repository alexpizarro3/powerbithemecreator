import React, { useRef, useState } from 'react';
import ColorThief from 'colorthief';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageToPaletteProps {
    onPaletteGenerated: (colors: string[]) => void;
    onClose: () => void;
}

export const ImageToPalette = ({ onPaletteGenerated, onClose }: ImageToPaletteProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const extractColors = () => {
        if (!imgRef.current) return;

        const colorThief = new ColorThief();
        // Get palette of 5 colors
        const palette = colorThief.getPalette(imgRef.current, 5);

        // Convert RGB arrays to Hex strings
        const hexPalette = palette.map(rgb => {
            return '#' + rgb.map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        });

        onPaletteGenerated(hexPalette);
        onClose();
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Extract Colors from Image</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {!imagePreview ? (
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${isDragging
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                }`}
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-medium">Click or drag image here</p>
                                <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG, WebP</p>
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
                        <div className="space-y-4">
                            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20 aspect-video flex items-center justify-center">
                                <img
                                    ref={imgRef}
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain"
                                    crossOrigin="anonymous"
                                    onLoad={extractColors} // Auto-extract on load? Or wait for user? Let's add a button for better UX control
                                />
                                <button
                                    onClick={() => setImagePreview(null)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <button
                                onClick={extractColors}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <ImageIcon size={18} />
                                Extract Palette
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
