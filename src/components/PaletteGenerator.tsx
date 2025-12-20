import { useState } from 'react';
import { RefreshCw, Lock, Unlock, GripVertical, ChevronDown, LayoutTemplate, AlertTriangle, Undo, Redo, Sliders, HelpCircle, Keyboard, Briefcase } from 'lucide-react';
import { ImageToPalette } from './ImageToPalette';
import { AdvancedColorPicker } from './AdvancedColorPicker';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateRandomColor, generateHarmoniousPalette, getContrastRatio, type HarmonyMode } from '../utils/colors';
import { themeTemplates } from '../utils/templates';

export interface ColorItem {
    id: string;
    hex: string;
    locked: boolean;
}

interface SortableColorProps {
    color: ColorItem;
    toggleLock: (id: string) => void;
    updateColor: (id: string, newHex: string) => void;
}

const SortableColor = ({ color, toggleLock, updateColor }: SortableColorProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: color.id });

    const contrast = getContrastRatio(color.hex, '#FFFFFF');
    const isLowContrast = contrast < 3;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 ${isDragging
                ? 'bg-white/10 border-white/20 shadow-xl scale-105 backdrop-blur-md'
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
        >
            <button
                {...attributes}
                {...listeners}
                className="text-slate-400 hover:text-white cursor-grab active:cursor-grabbing touch-none transition-colors"
            >
                <GripVertical size={20} />
            </button>

            <div className="relative group/color">
                <div
                    className="w-12 h-12 rounded-xl shadow-lg ring-1 ring-white/10 cursor-pointer overflow-hidden transition-transform group-hover/color:scale-105"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setShowPicker(!showPicker)}
                >
                    {/* Native picker as fallback/hidden input */}
                    <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColor(color.id, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>
                {isLowContrast && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-1 shadow-lg z-10" title="Low contrast with white background">
                        <AlertTriangle size={12} />
                    </div>
                )}

                {showPicker && (
                    <AdvancedColorPicker
                        color={color.hex}
                        onChange={(newHex) => updateColor(color.id, newHex)}
                        onClose={() => setShowPicker(false)}
                    />
                )}
            </div>

            <div className="flex-1 flex items-center gap-2">
                <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => updateColor(color.id, e.target.value)}
                    className="bg-transparent font-mono text-lg uppercase w-full focus:outline-none text-slate-200 group-hover:text-white transition-colors"
                />
                <button
                    onClick={() => setShowPicker(!showPicker)}
                    className={`p-2 rounded-lg transition-colors ${showPicker ? 'text-blue-400 bg-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    title="Advanced Color Editor"
                >
                    <Sliders size={16} />
                </button>
            </div>

            <button
                onClick={() => toggleLock(color.id)}
                className={`p-2 rounded-lg transition-all duration-200 ${color.locked
                    ? 'text-blue-400 bg-blue-500/20 ring-1 ring-blue-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
            >
                {color.locked ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
        </div>
    );
};

interface PaletteGeneratorProps {
    colors: ColorItem[];
    setColors: (colors: ColorItem[]) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    onPaletteGenerated?: (colors: ColorItem[]) => void;
}

export const PaletteGenerator = ({
    colors,
    setColors,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onPaletteGenerated
}: PaletteGeneratorProps) => {
    const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('random');
    const [showImageUpload, setShowImageUpload] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const generateColors = () => {
        if (harmonyMode === 'random') {
            const newColors = colors.map(c =>
                c.locked ? c : { ...c, hex: generateRandomColor() }
            );
            if (onPaletteGenerated) {
                onPaletteGenerated(newColors);
            } else {
                setColors(newColors);
            }
            return;
        }

        // Find base color (first locked, or first existing if none locked)
        const lockedColor = colors.find(c => c.locked);
        const baseColor = lockedColor ? lockedColor.hex : generateRandomColor();

        // Generate harmony palette
        const newPalette = generateHarmoniousPalette(baseColor, harmonyMode, colors.length);

        let paletteIndex = 0;
        const newColors = colors.map((c) => {
            if (c.locked) return c;
            const newHex = newPalette[paletteIndex % newPalette.length];
            paletteIndex++;
            return { ...c, hex: newHex };
        });

        if (onPaletteGenerated) {
            onPaletteGenerated(newColors);
        } else {
            setColors(newColors);
        }
    };

    const applyTemplate = (templateId: string) => {
        const template = themeTemplates.find(t => t.id === templateId);
        if (!template) return;

        const newColors = template.colors.map((hex, index) => ({
            id: colors[index]?.id || `color-${Date.now()}-${index}`,
            hex,
            locked: false
        }));

        if (onPaletteGenerated) {
            onPaletteGenerated(newColors);
        } else {
            setColors(newColors);
        }
    };

    const toggleLock = (id: string) => {
        setColors(colors.map(c => c.id === id ? { ...c, locked: !c.locked } : c));
    };

    const updateColor = (id: string, newHex: string) => {
        setColors(colors.map(c => c.id === id ? { ...c, hex: newHex } : c));
    };

    const handleImagePalette = (newColors: string[]) => {
        const colorItems = newColors.map((hex, index) => ({
            id: colors[index]?.id || `color-${Date.now()}-${index}`,
            hex,
            locked: false
        }));

        if (onPaletteGenerated) {
            onPaletteGenerated(colorItems);
        } else {
            setColors(colorItems);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = colors.findIndex((item) => item.id === active.id);
            const newIndex = colors.findIndex((item) => item.id === over.id);
            const newColors = arrayMove(colors, oldIndex, newIndex);
            setColors(newColors);
        }
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white/90">Color Palette</h2>

                    <div className="relative group/help">
                        <HelpCircle size={18} className="text-slate-400 hover:text-white cursor-help transition-colors" />
                        <div className="absolute right-0 top-full mt-2 w-56 p-4 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 text-xs text-slate-300 hidden group-hover/help:block z-50">
                            <p className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
                                <Keyboard size={14} className="text-blue-400" /> Keyboard Shortcuts
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                    <span>Generate New</span>
                                    <kbd className="bg-white/10 px-2 py-1 rounded text-[10px] font-mono font-bold text-white border-b border-white/20">Space</kbd>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                    <span>Lock Color</span>
                                    <kbd className="bg-white/10 px-2 py-1 rounded text-[10px] font-mono font-bold text-white border-b border-white/20">Click Lock</kbd>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                    <span>Reorder</span>
                                    <kbd className="bg-white/10 px-2 py-1 rounded text-[10px] font-mono font-bold text-white border-b border-white/20">Drag handle</kbd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <select
                            value={harmonyMode}
                            onChange={(e) => setHarmonyMode(e.target.value as HarmonyMode)}
                            className="w-full appearance-none bg-black/20 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
                        >
                            <option value="random" className="bg-slate-900 text-white">Random Harmony</option>
                            <option value="monochromatic" className="bg-slate-900 text-white">Monochromatic</option>
                            <option value="analogous" className="bg-slate-900 text-white">Analogous</option>
                            <option value="complementary" className="bg-slate-900 text-white">Complementary</option>
                            <option value="triadic" className="bg-slate-900 text-white">Triadic</option>
                            <option value="split-complementary" className="bg-slate-900 text-white">Split Complementary</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>

                    <div className="relative">
                        <select
                            onChange={(e) => {
                                applyTemplate(e.target.value);
                                e.target.value = ""; // Reset select
                            }}
                            className="w-full appearance-none bg-black/20 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
                            defaultValue=""
                        >
                            <option value="" disabled className="bg-slate-900 text-white">Load Template...</option>
                            {themeTemplates.map(t => (
                                <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name}</option>
                            ))}
                        </select>
                        <LayoutTemplate className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className={`p-3 rounded-xl transition-all ${canUndo
                            ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg shadow-black/20'
                            : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                            }`}
                        title="Undo"
                    >
                        <Undo size={20} />
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className={`p-3 rounded-xl transition-all ${canRedo
                            ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg shadow-black/20'
                            : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                            }`}
                        title="Redo"
                    >
                        <Redo size={20} />
                    </button>
                    <button
                        onClick={generateColors}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 font-medium active:scale-95"
                    >
                        <RefreshCw size={18} />
                        Generate
                    </button>
                    <button
                        onClick={() => setShowImageUpload(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all border border-white/10 font-bold active:scale-95 shadow-lg shadow-purple-500/30 whitespace-nowrap"
                    >
                        <Briefcase size={18} />
                        Brand Kit
                    </button>
                </div>
            </div>

            {showImageUpload && (
                <ImageToPalette
                    onPaletteGenerated={handleImagePalette}
                    onClose={() => setShowImageUpload(false)}
                />
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={colors}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {colors.map((color) => (
                            <SortableColor
                                key={color.id}
                                color={color}
                                toggleLock={toggleLock}
                                updateColor={updateColor}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};
