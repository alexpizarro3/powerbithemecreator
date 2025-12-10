import { PaletteGenerator } from './components/PaletteGenerator';
import { ThemePreview } from './components/ThemePreview';
import { ThemeEditor } from './components/ThemeEditor';
import { TrendingPalettes } from './components/TrendingPalettes';
import { Footer } from './components/Footer';
import { ThemeActions } from './components/ThemeActions';
import { useThemeState } from './hooks/useThemeState';
import type { ThemeOptions } from './utils/powerbi-theme';

function App() {
  const {
    colors,
    setColors,
    themeName,
    setThemeName,
    historyIndex,
    historyLength,
    undo,
    redo,
    handlePaletteGenerated,
    handlePaletteSelect,
    isDarkMode,
    setIsDarkMode,
    borderRadius,
    setBorderRadius,
    typography,
    setTypography,
    pageBackground,
    setPageBackground,
    filterPane,
    setFilterPane,
    dataGradients,
    setDataGradients
  } = useThemeState();

  const handleImport = (theme: ThemeOptions) => {
    setThemeName(theme.name);
    if (theme.borderRadius !== undefined) setBorderRadius(theme.borderRadius);

    // Handle imported typography
    if (theme.typography) {
      setTypography(theme.typography);
    } else if (theme.fontFamily) {
      // Legacy fallback
      setTypography({
        ...typography,
        global: theme.fontFamily
      });
    }

    if (theme.isDarkMode !== undefined) setIsDarkMode(theme.isDarkMode);
    if (theme.pageBackground) setPageBackground(theme.pageBackground);
    if (theme.filterPane) setFilterPane(theme.filterPane);

    if (theme.colors && theme.colors.length > 0) {
      const newColors = theme.colors.map((hex, index) => ({
        id: `imported-${Date.now()}-${index}`,
        hex,
        locked: false
      }));
      setColors(newColors);
    }

    if (theme.bad && theme.neutral && theme.good) {
      setDataGradients({
        bad: theme.bad,
        neutral: theme.neutral,
        good: theme.good
      });
    }
  };

  return (
    <div className="min-h-screen text-white p-8 font-sans pb-32">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1600px] mx-auto">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Power BI Theme Creator
          </h1>
          <p className="text-slate-400 mt-3 text-lg font-light tracking-wide">
            Craft premium themes for your data stories
          </p>
        </div>

        <ThemeActions
          colors={colors}
          themeName={themeName}
          isDarkMode={isDarkMode}
          borderRadius={borderRadius}
          typography={typography}
          pageBackground={pageBackground}
          filterPane={filterPane}
          dataGradients={dataGradients}
          onImport={handleImport}
        />
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <PaletteGenerator
            colors={colors}
            setColors={setColors}
            onPaletteGenerated={handlePaletteGenerated}
            onUndo={undo}
            onRedo={redo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < historyLength - 1}
          />
          <ThemeEditor
            colors={colors}
            setColors={setColors}
            themeName={themeName}
            setThemeName={setThemeName}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            borderRadius={borderRadius}
            setBorderRadius={setBorderRadius}
            typography={typography}
            setTypography={setTypography}
            pageBackground={pageBackground}
            setPageBackground={setPageBackground}
            filterPane={filterPane}
            setFilterPane={setFilterPane}
            dataGradients={dataGradients}
            setDataGradients={setDataGradients}
          />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <ThemePreview
            colors={colors}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            borderRadius={borderRadius}
            typography={typography}
            pageBackground={pageBackground}
            filterPane={filterPane}
            dataGradients={dataGradients}
          />
        </div>
      </main>

      <TrendingPalettes onSelect={handlePaletteSelect} />

      <Footer />
    </div>
  );
}

export default App;
