export interface TrendingPalette {
    id: string;
    name: string;
    colors: string[];
    likes: number;
}

const ADJECTIVES = ['Sunset', 'Ocean', 'Forest', 'Neon', 'Pastel', 'Cyber', 'Vintage', 'Royal', 'Deep', 'Bright', 'Muted', 'Electric', 'Soft', 'Dark', 'Light'];
const NOUNS = ['Vibes', 'Dreams', 'Mist', 'Night', 'Day', 'Wave', 'Storm', 'Breeze', 'Haze', 'Glow', 'Shadow', 'Spark', 'Bloom', 'Dusk', 'Dawn'];

const generateName = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj} ${noun}`;
};

export const fetchTrendingPalettes = async (): Promise<TrendingPalette[]> => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Jam3/nice-color-palettes/master/100.json');
        if (!response.ok) throw new Error('Failed to fetch palettes');

        const data: string[][] = await response.json();

        // Take top 50 and map to our interface
        return data.slice(0, 50).map((colors, index) => ({
            id: `trending-${index}`,
            name: generateName(),
            colors: colors,
            likes: Math.floor(Math.random() * 2000) + 100 // Random likes between 100 and 2100
        }));
    } catch (error) {
        console.error('Error fetching trending palettes:', error);
        return [];
    }
};
