import { PaletteGenerator } from './components/PaletteGenerator';
import { ThemePreview } from './components/ThemePreview';
import { ThemeEditor } from './components/ThemeEditor';
import { TrendingPalettes } from './components/TrendingPalettes';
import { Footer } from './components/Footer';
import { ThemeActions } from './components/ThemeActions';
import { useThemeState } from './hooks/useThemeState';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { DonationModal } from './components/DonationModal';
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
    reset
  } = useThemeState();

  const [isDonationOpen, setIsDonationOpen] = useState(false);

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

    if (theme.isDarkMode !== undefined) setThemeMode(theme.isDarkMode ? 'dark' : 'light');
    if (theme.pageBackground) setPageBackground(theme.pageBackground);
    if (theme.filterPane) setFilterPane(theme.filterPane);
    if (theme.visualContainer) {
      setVisualContainer({
        dropShadow: {
          show: false,
          color: '#000000',
          transparency: 70,
          blur: 4,
          angle: 90,
          distance: 3,
          ...theme.visualContainer.dropShadow
        },
        header: {
          backgroundColor: 'transparent',
          fontColor: '',
          transparency: 0,
          ...theme.visualContainer.header
        },
        tooltip: {
          backgroundColor: '',
          fontColor: '',
          transparency: 0,
          ...theme.visualContainer.tooltip
        }
      });
    }

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
    <div className="min-h-screen text-white p-4 md:p-8 font-sans pb-32">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1600px] mx-auto">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Power BI Theme Creator
          </h1>
          <p className="text-slate-400 mt-3 text-lg font-light tracking-wide">
            Craft premium themes for your data stories
          </p>
        </div>



        <button
          onClick={() => setIsDonationOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all group bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-rose-500/25 border border-rose-400"
        >
          <Heart size={20} className="fill-white/20 group-hover:scale-110 transition-transform" />
          <span>Donate</span>
        </button>

        <ThemeActions
          colors={colors}
          themeName={themeName}
          isDarkMode={themeMode !== 'light'}
          borderRadius={borderRadius}
          typography={typography}
          pageBackground={pageBackground}
          filterPane={filterPane}
          dataGradients={dataGradients}
          visualContainer={visualContainer}
          onImport={handleImport}
          onReset={reset}
        />
      </header >

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
            themeMode={themeMode}
            setThemeMode={setThemeMode}
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
            visualContainer={visualContainer}
            setVisualContainer={setVisualContainer}
          />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <ThemePreview
            colors={colors}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            borderRadius={borderRadius}
            typography={typography}
            pageBackground={pageBackground}
            filterPane={filterPane}
            dataGradients={dataGradients}
            visualContainer={visualContainer}
          />
        </div>
      </main>

      <TrendingPalettes onSelect={handlePaletteSelect} />

      <Footer />
      <Footer />

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        btcAddress="15ZsFSnF3q3MvRwh4QkLSSJxNMsiLTD33w"
        buyMeCoffeeUrl="https://www.buymeacoffee.com/alexpizarro3"
      />
    </div >
  );
}

export default App;
