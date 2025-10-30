
export enum ExerciseType {
  COUNTING = 'Menghitung Gambar (Emoji)',
  ADDITION = 'Penjumlahan Sederhana',
  SUBTRACTION = 'Pengurangan Sederhana',
  TRACING = 'Menebalkan Teks/Huruf',
  PATTERN = 'Melanjutkan Pola',
  MATCHING = 'Menjodohkan',
  SPELLING = 'Latihan Mengeja',
  DRAWING = 'Area Menggambar Bebas',
  COLORING = 'Area Mewarnai',
  MAZE = 'Labirin Sederhana',
}

interface BaseExerciseConfig {
  title: string;
}

interface CountingConfig extends BaseExerciseConfig {
  emoji: string;
  count: number;
}

interface AdditionConfig extends BaseExerciseConfig {
  num1: number;
  num2: number;
  showHelpers: boolean;
  helperEmoji: string;
}

interface SubtractionConfig extends BaseExerciseConfig {
  num1: number;
  num2: number;
  showHelpers: boolean;
  helperEmoji: string;
}

interface TracingConfig extends BaseExerciseConfig {
  text: string;
}

interface DrawingConfig extends BaseExerciseConfig {
  instruction: string;
}

interface PatternConfig extends BaseExerciseConfig {
  items: string[];
}

export interface MatchingPair {
  id: string;
  item1: string;
  item2: string;
}
interface MatchingConfig extends BaseExerciseConfig {
  pairs: MatchingPair[];
}

interface SpellingConfig extends BaseExerciseConfig {
  word: string;
  emojiHint: string;
}

interface ColoringConfig extends BaseExerciseConfig {
  instruction: string;
  svgKey: string;
}

interface MazeConfig extends BaseExerciseConfig {
  instruction: string;
  svgKey: string;
}

export type Exercise =
  | { id: string; type: ExerciseType.COUNTING; config: CountingConfig }
  | { id: string; type: ExerciseType.ADDITION; config: AdditionConfig }
  | { id: string; type: ExerciseType.SUBTRACTION; config: SubtractionConfig }
  | { id: string; type: ExerciseType.TRACING; config: TracingConfig }
  | { id: string; type: ExerciseType.DRAWING; config: DrawingConfig }
  | { id: string; type: ExerciseType.PATTERN; config: PatternConfig }
  | { id: string; type: ExerciseType.MATCHING; config: MatchingConfig }
  | { id: string; type: ExerciseType.SPELLING; config: SpellingConfig }
  | { id: string; type: ExerciseType.COLORING; config: ColoringConfig }
  | { id: string; type: ExerciseType.MAZE; config: MazeConfig };

export type Theme = 'default' | 'space' | 'ocean' | 'garden';

export type BorderTheme =
  | 'none'
  | 'simple'
  | 'stars'
  | 'rainbow'
  | 'flowers'
  | 'hearts'
  | 'animals'
  | 'geometric'
  | 'clouds'
  | 'music';

export interface SchoolInfo {
  schoolName: string;
  teacherName: string;
  logoUrl: string;
}

export interface Worksheet {
  title: string;
  exercises: Exercise[];
  theme: Theme;
  borderTheme: BorderTheme;
  schoolInfo: SchoolInfo;
}

// --- ASSETS ---
// Storing SVG assets here to be easily importable by components without prop drilling
// In a larger app, these would be in their own assets file.

export const coloringPages = [
  {
    key: 'butterfly',
    name: 'Kupu-kupu',
    content: `<svg style="width: 80%; margin: 0 auto; display: block;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,20 C30,30 25,50 50,50 M50,20 C70,30 75,50 50,50 M30,45 C15,60 20,85 50,90 M70,45 C85,60 80,85 50,90 M45,15 A15,15 0 0,1 50,5 M55,15 A15,15 0 0,0 50,5" stroke="black" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>`
  },
  {
    key: 'car',
    name: 'Mobil',
    content: `<svg style="width: 80%; margin: 0 auto; display: block;" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M5,45 h90 v-15 a20,20 0 0,0 -20,-20 h-50 a20,20 0 0,0 -20,20 z" stroke="black" stroke-width="2" fill="none" /><rect x="28" y="25" width="44" height="15" stroke="black" stroke-width="2" fill="none" rx="5"/><circle cx="20" cy="45" r="7" stroke="black" stroke-width="2" fill="white" /><circle cx="80" cy="45" r="7" stroke="black" stroke-width="2" fill="white" /></svg>`
  }
];

export const mazes = [
  {
    key: 'simple_maze',
    name: 'Labirin Mudah',
    content: `<svg style="width: 90%; margin: 0 auto; display: block;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 H 90 V 90 H 10 V 10 M 10 30 H 70 M 30 10 V 50 M 30 70 H 90 M 50 30 H 90 V 70 M 70 50 H 10" stroke="black" stroke-width="4" fill="none" stroke-linecap="round" /><text x="15" y="22" font-size="10" font-family="Comic Neue, cursive">Mulai</text><text x="65" y="98" font-size="10" font-family="Comic Neue, cursive">Selesai</text></svg>`
  }
];

export const getAssetSvg = (type: 'coloring' | 'maze', key: string) => {
  if (type === 'coloring') {
    return coloringPages.find(p => p.key === key)?.content;
  }
  return mazes.find(m => m.key === key)?.content;
}
