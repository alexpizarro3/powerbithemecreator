import { useState, useEffect } from 'react';
import { PaletteGenerator, type ColorItem } from './components/PaletteGenerator';
import { ThemePreview } from './components/ThemePreview';
import { ThemeEditor } from './components/ThemeEditor';
import { TrendingPalettes } from './components/TrendingPalettes';
import { Footer } from './components/Footer';
import { suggestThemeSettings } from './utils/theme-suggestions';

function App() {
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

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pbi-theme-darkmode');
    return saved ? JSON.parse(saved) : true;
  });

  const [borderRadius, setBorderRadius] = useState(() => {
    const saved = localStorage.getItem('pbi-theme-radius');
    return saved ? Number(saved) : 0;
  });

  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('pbi-theme-font') || "Segoe UI";
  });

  const [pageBackground, setPageBackground] = useState(() => {
    const saved = localStorage.getItem('pbi-theme-page-bg');
    return saved ? JSON.parse(saved) : { color: '#FFFFFF', transparency: 0 };
  });

  const [filterPane, setFilterPane] = useState(() => {
    const saved = localStorage.getItem('pbi-theme-filter-pane');
    return saved ? JSON.parse(saved) : { backgroundColor: '#FFFFFF', foreColor: '#000000', transparency: 0 };
  });

  // Persistence Effects
  useEffect(() => { localStorage.setItem('pbi-theme-colors', JSON.stringify(colors)); }, [colors]);
  useEffect(() => { localStorage.setItem('pbi-theme-darkmode', JSON.stringify(isDarkMode)); }, [isDarkMode]);
  useEffect(() => { localStorage.setItem('pbi-theme-radius', borderRadius.toString()); }, [borderRadius]);
  useEffect(() => { localStorage.setItem('pbi-theme-font', fontFamily); }, [fontFamily]);
  useEffect(() => { localStorage.setItem('pbi-theme-page-bg', JSON.stringify(pageBackground)); }, [pageBackground]);
  useEffect(() => { localStorage.setItem('pbi-theme-filter-pane', JSON.stringify(filterPane)); }, [filterPane]);

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
    // 1. Update colors
    handleSetColors(newColors);

    // 2. Suggest and apply theme settings
    const suggestions = suggestThemeSettings(newColors.map(c => c.hex), isDarkMode);
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

  return (
    <div className="min-h-screen text-white p-8 font-sans pb-32">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
          Power BI Theme Creator
        </h1>
        <p className="text-slate-400 mt-3 text-lg font-light tracking-wide">
          Craft premium themes for your data stories
        </p>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <PaletteGenerator
            colors={colors}
            setColors={handleSetColors}
            onPaletteGenerated={handlePaletteGenerated}
            onUndo={undo}
            onRedo={redo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
          <ThemeEditor
            colors={colors}
            setColors={handleSetColors}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            borderRadius={borderRadius}
            setBorderRadius={setBorderRadius}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            pageBackground={pageBackground}
            setPageBackground={setPageBackground}
            filterPane={filterPane}
            setFilterPane={setFilterPane}
          />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <ThemePreview
            colors={colors}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            borderRadius={borderRadius}
            fontFamily={fontFamily}
            pageBackground={pageBackground}
            filterPane={filterPane}
          />
        </div>
      </main>

      <TrendingPalettes onSelect={handlePaletteSelect} />

      <Footer />
    </div>
  );
}

export default App;
