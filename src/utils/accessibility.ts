export type VisionSimulationMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export const VISION_MODES: { value: VisionSimulationMode; label: string }[] = [
    { value: 'normal', label: 'Normal Vision' },
    { value: 'protanopia', label: 'Protanopia (No Red)' },
    { value: 'deuteranopia', label: 'Deuteranopia (No Green)' },
    { value: 'tritanopia', label: 'Tritanopia (No Blue)' },
    { value: 'achromatopsia', label: 'Achromatopsia (No Color)' },
];

// SVG Color Matrix values for simulating color blindness
// Source: https://www.inf.u-szeged.hu/~imre/publications/2009/ColorBlindnessSim.pdf
export const COLOR_BLINDNESS_MATRICES: Record<VisionSimulationMode, string> = {
    normal: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0',
    protanopia: '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0',
    deuteranopia: '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0',
    tritanopia: '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0',
    achromatopsia: '0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0',
};
