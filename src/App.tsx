import { useState } from 'react';
import { PaletteGenerator, type ColorItem } from './components/PaletteGenerator';
import { ThemePreview } from './components/ThemePreview';
import { ThemeEditor } from './components/ThemeEditor';
import { TrendingPalettes } from './components/TrendingPalettes';
import { Footer } from './components/Footer';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [colors, setColors] = useState<ColorItem[]>([
    { id: '1', hex: '#3B82F6', locked: false },
    { id: '2', hex: '#8B5CF6', locked: false },
    { id: '3', hex: '#EC4899', locked: false },
    { id: '4', hex: '#10B981', locked: false },
    { id: '5', hex: '#F59E0B', locked: false },
  ]);
  const [borderRadius, setBorderRadius] = useState(0);
  const [fontFamily, setFontFamily] = useState("Segoe UI");

  const handlePaletteSelect = (newColors: string[]) => {
    setColors(newColors.map((hex, index) => ({
      id: colors[index]?.id || `color-${Date.now()}-${index}`,
      hex,
      locked: false
    })));
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
          <PaletteGenerator colors={colors} setColors={setColors} />
          <ThemeEditor
            colors={colors}
            isDarkMode={isDarkMode}
            borderRadius={borderRadius}
            setBorderRadius={setBorderRadius}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
          />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <ThemePreview
            colors={colors}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            borderRadius={borderRadius}
            fontFamily={fontFamily}
          />
        </div>
      </main>

      <TrendingPalettes onSelect={handlePaletteSelect} />

      <Footer />
    </div>
  );
}

export default App;
