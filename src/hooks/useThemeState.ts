import { useState, useEffect } from 'react';
import { type ColorItem } from '../components/PaletteGenerator';
import { suggestThemeSettings } from '../utils/theme-suggestions';
import { type TypographyState } from '../components/TypographySettings';
import { type VisualContainerState } from '../components/VisualContainerSettings';

export const useThemeState = () => {
    // Load initial state from localStorage or use default
    const [colors, setColors] = useState<ColorItem[]>(() => {
        const saved = localStorage.getItem('pbi-theme-colors');
        return saved ? JSON.parse(saved) : [
            { id: '1', hex: '#4DEEEA', locked: false }, // Cyan
            { id: '2', hex: '#74EE15', locked: false }, // Lime
            { id: '3', hex: '#FFE700', locked: false }, // Yellow
            { id: '4', hex: '#F000FF', locked: false }, // Magenta
            { id: '5', hex: '#001EFF', locked: false }, // Blue
        ];
    });

    // History state for Undo/Redo
    const [history, setHistory] = useState<ColorItem[][]>([colors]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [themeName, setThemeName] = useState("My Custom Theme");

    // Theme Mode: 'light' | 'dark' | 'soft'
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'soft'>(() => {
        const saved = localStorage.getItem('pbi-theme-mode');
        const oldBool = localStorage.getItem('pbi-theme-darkmode');

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return 'dark';
            }
        }
        if (oldBool) {
            try {
                return JSON.parse(oldBool) ? 'dark' : 'light';
            } catch (e) {
                return 'dark';
            }
        }
        return 'dark'; // Default to Dark Mode as requested
    });

    const [borderRadius, setBorderRadius] = useState(() => {
        const saved = localStorage.getItem('pbi-theme-radius');
        return saved ? Number(saved) : 0;
    });

    const [typography, setTypography] = useState<TypographyState>(() => {
        const saved = localStorage.getItem('pbi-theme-typography');
        if (saved) {
            const parsed = JSON.parse(saved);
            const migrateColor = (c: string) => c === "#000000" ? "" : c;
            return {
                ...parsed,
                title: { ...parsed.title, color: migrateColor(parsed.title.color) },
                callout: { ...parsed.callout, color: migrateColor(parsed.callout.color) },
                label: { ...parsed.label, color: migrateColor(parsed.label.color) },
                header: { ...parsed.header, color: migrateColor(parsed.header.color) }
            };
        }
        return {
            global: localStorage.getItem('pbi-theme-font') || "Segoe UI",
            title: { fontFamily: "", fontSize: 14, color: "" },
            callout: { fontFamily: "", fontSize: 20, color: "" },
            label: { fontFamily: "", fontSize: 10, color: "" },
            header: { fontFamily: "", fontSize: 12, color: "" }
        };
    });

    const [pageBackground, setPageBackground] = useState(() => {
        const saved = localStorage.getItem('pbi-theme-page-bg');
        if (saved) {
            // No strict migration needed here, relying on effect sync if wrong
            return JSON.parse(saved);
        }
        return { color: '#0f172a', transparency: 0 };
    });

    const [filterPane, setFilterPane] = useState(() => {
        const saved = localStorage.getItem('pbi-theme-filter-pane');
        if (saved) {
            return JSON.parse(saved);
        }
        return { backgroundColor: '#1e293b', foreColor: '#ffffff', transparency: 0 };
    });

    const [dataGradients, setDataGradients] = useState(() => {
        const saved = localStorage.getItem('pbi-theme-gradients');
        return saved ? JSON.parse(saved) : {
            bad: '#D64554',
            neutral: '#F6C244',
            good: '#1AAB40'
        };
    });

    const [visualContainer, setVisualContainer] = useState<VisualContainerState>(() => {
        const saved = localStorage.getItem('pbi-theme-visual-container');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            dropShadow: { show: false, color: '#000000', transparency: 70, blur: 4, angle: 90, distance: 3 },
            header: { backgroundColor: 'transparent', fontColor: '', transparency: 0 },
            tooltip: { backgroundColor: '', fontColor: '', transparency: 0 }
        };
    });

    // Persistence Effects
    useEffect(() => { localStorage.setItem('pbi-theme-colors', JSON.stringify(colors)); }, [colors]);
    useEffect(() => {
        localStorage.setItem('pbi-theme-mode', JSON.stringify(themeMode));
        // Also update legacy key for backward compatibility if needed, using dark for soft
        localStorage.setItem('pbi-theme-darkmode', JSON.stringify(themeMode !== 'light'));

        // Intelligent Theming: Auto-switch background/filter settings when mode changes
        const currentPalette = colors.map(c => c.hex);
        const suggestions = suggestThemeSettings(currentPalette, themeMode);
        setPageBackground(suggestions.pageBackground);
        setFilterPane(suggestions.filterPane);

    }, [themeMode]);
    useEffect(() => { localStorage.setItem('pbi-theme-radius', borderRadius.toString()); }, [borderRadius]);
    useEffect(() => { localStorage.setItem('pbi-theme-typography', JSON.stringify(typography)); }, [typography]);
    useEffect(() => { localStorage.setItem('pbi-theme-page-bg', JSON.stringify(pageBackground)); }, [pageBackground]);
    useEffect(() => { localStorage.setItem('pbi-theme-filter-pane', JSON.stringify(filterPane)); }, [filterPane]);
    useEffect(() => { localStorage.setItem('pbi-theme-filter-pane', JSON.stringify(filterPane)); }, [filterPane]);
    useEffect(() => { localStorage.setItem('pbi-theme-gradients', JSON.stringify(dataGradients)); }, [dataGradients]);
    useEffect(() => { localStorage.setItem('pbi-theme-visual-container', JSON.stringify(visualContainer)); }, [visualContainer]);

    // Undo/Redo Logic
    const handleSetColors = (newColors: ColorItem[], addToHistory = true) => {
        setColors(newColors);
        if (addToHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newColors);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setColors(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setColors(history[historyIndex + 1]);
        }
    };

    const handlePaletteGenerated = (newColors: ColorItem[]) => {
        handleSetColors(newColors);
        const suggestions = suggestThemeSettings(newColors.map(c => c.hex), themeMode);
        setPageBackground(suggestions.pageBackground);
        setFilterPane(suggestions.filterPane);
    };

    const handlePaletteSelect = (newColors: string[]) => {
        const colorItems = newColors.map((hex, index) => ({
            id: `${Date.now()}-${index}`,
            hex,
            locked: false
        }));
        handlePaletteGenerated(colorItems);
    };

    return {
        colors,
        setColors: handleSetColors,
        themeName,
        setThemeName,
        historyIndex,
        historyLength: history.length,
        undo,
        redo,
        handlePaletteGenerated,
        handlePaletteSelect,
        themeMode,
        setThemeMode,
        borderRadius,
        setBorderRadius,
        typography,
        setTypography,
        pageBackground,
        setPageBackground,
        filterPane,
        setFilterPane,
        dataGradients,
        setDataGradients,
        visualContainer,
        setVisualContainer,
        reset: () => {
            localStorage.removeItem('pbi-theme-colors');
            localStorage.removeItem('pbi-theme-mode');
            localStorage.removeItem('pbi-theme-darkmode'); // Clear legacy
            localStorage.removeItem('pbi-theme-radius');
            localStorage.removeItem('pbi-theme-typography');
            localStorage.removeItem('pbi-theme-page-bg');
            localStorage.removeItem('pbi-theme-filter-pane');
            localStorage.removeItem('pbi-theme-gradients');
            localStorage.removeItem('pbi-theme-visual-container');

            setColors([
                { id: '1', hex: '#4DEEEA', locked: false },
                { id: '2', hex: '#74EE15', locked: false },
                { id: '3', hex: '#FFE700', locked: false },
                { id: '4', hex: '#F000FF', locked: false },
                { id: '5', hex: '#001EFF', locked: false },
            ]);
            setThemeName("My Custom Theme");
            setThemeMode('dark');
            setBorderRadius(0);
            setTypography({
                global: "Segoe UI",
                title: { fontFamily: "", fontSize: 14, color: "" },
                callout: { fontFamily: "", fontSize: 20, color: "" },
                label: { fontFamily: "", fontSize: 10, color: "" },
                header: { fontFamily: "", fontSize: 12, color: "" }
            });
            setPageBackground({ color: '#0f172a', transparency: 0 });
            setFilterPane({ backgroundColor: '#1e293b', foreColor: '#ffffff', transparency: 0 });
            setDataGradients({
                bad: '#D64554',
                neutral: '#F6C244',
                good: '#1AAB40'
            });
            setVisualContainer({
                dropShadow: { show: false, color: '#000000', transparency: 70, blur: 4, angle: 90, distance: 3 },
                header: { backgroundColor: 'transparent', fontColor: '', transparency: 0 },
                tooltip: { backgroundColor: '', fontColor: '', transparency: 0 }
            });
            setHistory([[
                { id: '1', hex: '#4DEEEA', locked: false },
                { id: '2', hex: '#74EE15', locked: false },
                { id: '3', hex: '#FFE700', locked: false },
                { id: '4', hex: '#F000FF', locked: false },
                { id: '5', hex: '#001EFF', locked: false },
            ]]);
            setHistoryIndex(0);
        }
    };
};
