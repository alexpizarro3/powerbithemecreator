import { useState, useEffect, useRef } from 'react';
import { X, Pipette } from 'lucide-react';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '../utils/colors';

interface AdvancedColorPickerProps {
    color: string;
    onChange: (hex: string) => void;
    onClose: () => void;
}

export const AdvancedColorPicker = ({ color, onChange, onClose }: AdvancedColorPickerProps) => {
    const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 });
    const [hexInput, setHexInput] = useState(color);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Initialize HSL from color prop
    // Derived state pattern: Update local state when prop changes
    const [prevColor, setPrevColor] = useState(color);
    if (color !== prevColor) {
        setPrevColor(color);
        setHexInput(color);
        const rgb = hexToRgb(color);
        if (rgb) {
            setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
        }
    }

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const updateColorFromHsl = (newHsl: { h: number, s: number, l: number }) => {
        setHsl(newHsl);
        const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        setHexInput(hex);
        onChange(hex);
    };

    const handleHexChange = (value: string) => {
        setHexInput(value);
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            onChange(value);
            const rgb = hexToRgb(value);
            if (rgb) {
                setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
            }
        }
    };

    const handleEyeDropper = async () => {
        if (!window.EyeDropper) return;

        try {
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            handleHexChange(result.sRGBHex);
        } catch {
            console.log('EyeDropper canceled');
        }
    };

    return (
        <div
            ref={wrapperRef}
            className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-white">Edit Color</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <X size={16} />
                </button>
            </div>

            {/* Color Preview & Hex Input */}
            <div className="flex gap-3 mb-6">
                <div
                    className="w-12 h-12 rounded-lg shadow-inner ring-1 ring-white/10"
                    style={{ backgroundColor: color }}
                />
                <div className="flex-1 space-y-1">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">HEX</span>
                            <input
                                type="text"
                                value={hexInput}
                                onChange={(e) => handleHexChange(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 pl-10 pr-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        {window.EyeDropper && (
                            <button
                                onClick={handleEyeDropper}
                                className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors"
                                title="Pick color from screen"
                            >
                                <Pipette size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* HSL Sliders */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Hue</span>
                        <span>{Math.round(hsl.h)}°</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={hsl.h}
                        onChange={(e) => updateColorFromHsl({ ...hsl, h: Number(e.target.value) })}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`
                        }}
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Saturation</span>
                        <span>{Math.round(hsl.s)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={hsl.s}
                        onChange={(e) => updateColorFromHsl({ ...hsl, s: Number(e.target.value) })}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #808080, ${color})`
                        }}
                    />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Lightness</span>
                        <span>{Math.round(hsl.l)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={hsl.l}
                        onChange={(e) => updateColorFromHsl({ ...hsl, l: Number(e.target.value) })}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #000, ${color}, #fff)`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

// Add type definition for EyeDropper API
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EyeDropper?: any;
    }
}
