
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
  JUZ_AMMA = 'Latihan Juz Amma',
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

export type JuzAmmaExerciseType = 'fill_blank' | 'matching' | 'tracing' | 'complete_verse';

export interface JuzAmmaVerse {
  surah: string;
  verseNumber: number;
  arabic: string;
  translation?: string;
}

interface JuzAmmaConfig extends BaseExerciseConfig {
  exerciseType: JuzAmmaExerciseType;
  surah: string;
  verses: JuzAmmaVerse[];
  blankWord?: string; // untuk fill_blank
  matchingPairs?: { arabic: string; translation: string }[]; // untuk matching
}

export type Exercise =
  | { id: string; type: ExerciseType.COUNTING; config: CountingConfig; pageNumber: number }
  | { id: string; type: ExerciseType.ADDITION; config: AdditionConfig; pageNumber: number }
  | { id: string; type: ExerciseType.SUBTRACTION; config: SubtractionConfig; pageNumber: number }
  | { id: string; type: ExerciseType.TRACING; config: TracingConfig; pageNumber: number }
  | { id: string; type: ExerciseType.DRAWING; config: DrawingConfig; pageNumber: number }
  | { id: string; type: ExerciseType.PATTERN; config: PatternConfig; pageNumber: number }
  | { id: string; type: ExerciseType.MATCHING; config: MatchingConfig; pageNumber: number }
  | { id: string; type: ExerciseType.SPELLING; config: SpellingConfig; pageNumber: number }
  | { id: string; type: ExerciseType.COLORING; config: ColoringConfig; pageNumber: number }
  | { id: string; type: ExerciseType.MAZE; config: MazeConfig; pageNumber: number }
  | { id: string; type: ExerciseType.JUZ_AMMA; config: JuzAmmaConfig; pageNumber: number };

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
    content: `<svg class="maze-interactive" style="width: 90%; margin: 0 auto; display: block;" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 H 90 V 90 H 10 V 10 M 10 30 H 70 M 30 10 V 50 M 30 70 H 90 M 50 30 H 90 V 70 M 70 50 H 10" stroke="black" stroke-width="4" fill="none" stroke-linecap="round" /><circle cx="15" cy="15" r="3" fill="#10b981" class="maze-start-marker" /><circle cx="85" cy="85" r="3" fill="#ef4444" class="maze-end-marker" /></svg>`
  }
];

export const getAssetSvg = (type: 'coloring' | 'maze', key: string) => {
  if (type === 'coloring') {
    return coloringPages.find(p => p.key === key)?.content;
  }
  return mazes.find(m => m.key === key)?.content;
}

// --- JUZ AMMA DATA ---
// Data surat-surat Juz Amma dari An-Nas (114) sampai An-Naba (78)
// Format: surah number, name, verses

export interface SurahData {
  number: number;
  name: string;
  arabicName: string;
  verses: {
    number: number;
    arabic: string;
    translation: string;
  }[];
}

export const juzAmmaData: SurahData[] = [
  {
    number: 114,
    name: 'An-Nas',
    arabicName: 'النَّاس',
    verses: [
      { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', translation: 'Katakanlah: "Aku berlindung kepada Tuhan manusia' },
      { number: 2, arabic: 'مَلِكِ النَّاسِ', translation: 'Raja manusia' },
      { number: 3, arabic: 'إِلَٰهِ النَّاسِ', translation: 'Sembahan manusia' },
      { number: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', translation: 'Dari kejahatan (bisikan) syaitan yang biasa bersembunyi' },
      { number: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', translation: 'Yang membisikkan (kejahatan) ke dalam dada manusia' },
      { number: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', translation: 'Dari golongan jin dan manusia' }
    ]
  },
  {
    number: 113,
    name: 'Al-Falaq',
    arabicName: 'الْفَلَق',
    verses: [
      { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', translation: 'Katakanlah: "Aku berlindung kepada Tuhan yang menguasai subuh' },
      { number: 2, arabic: 'مِن شَرِّ مَا خَلَقَ', translation: 'Dari kejahatan makhluk-Nya' },
      { number: 3, arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'Dan dari kejahatan malam apabila telah gelap gulita' },
      { number: 4, arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', translation: 'Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul' },
      { number: 5, arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translation: 'Dan dari kejahatan orang yang dengki apabila ia dengki' }
    ]
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الْإِخْلَاص',
    verses: [
      { number: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Katakanlah: "Dialah Allah, Yang Maha Esa' },
      { number: 2, arabic: 'اللَّهُ الصَّمَدُ', translation: 'Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu' },
      { number: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translation: 'Dia tidak beranak dan tidak pula diperanakkan' },
      { number: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', translation: 'Dan tidak ada sesuatu pun yang setara dengan Dia' }
    ]
  },
  {
    number: 111,
    name: 'Al-Lahab',
    arabicName: 'الْمَسَد',
    verses: [
      { number: 1, arabic: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ', translation: 'Binasalah kedua tangan Abu Lahab dan sungguh dia akan binasa' },
      { number: 2, arabic: 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ', translation: 'Hartanya dan apa yang dia usahakan tidak memberi manfaat kepadanya' },
      { number: 3, arabic: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ', translation: 'Kelak dia akan masuk ke dalam api yang bergejolak' },
      { number: 4, arabic: 'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ', translation: 'Dan (begitu pula) istrinya, pembawa kayu bakar' },
      { number: 5, arabic: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ', translation: 'Yang di lehernya ada tali dari sabut' }
    ]
  },
  {
    number: 110,
    name: 'An-Nasr',
    arabicName: 'النَّصْر',
    verses: [
      { number: 1, arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', translation: 'Apabila telah datang pertolongan Allah dan kemenangan' },
      { number: 2, arabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', translation: 'Dan engkau melihat manusia berbondong-bondong masuk agama Allah' },
      { number: 3, arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا', translation: 'Maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampunan kepada-Nya. Sungguh, Dia Maha Penerima tobat' }
    ]
  },
  {
    number: 109,
    name: 'Al-Kafirun',
    arabicName: 'الْكَافِرُون',
    verses: [
      { number: 1, arabic: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', translation: 'Katakanlah (Muhammad), "Wahai orang-orang kafir!' },
      { number: 2, arabic: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', translation: 'Aku tidak akan menyembah apa yang kamu sembah' },
      { number: 3, arabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', translation: 'Dan kamu bukan penyembah apa yang aku sembah' },
      { number: 4, arabic: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ', translation: 'Dan aku tidak pernah menjadi penyembah apa yang kamu sembah' },
      { number: 5, arabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', translation: 'Dan kamu tidak pernah (pula) menjadi penyembah apa yang aku sembah' },
      { number: 6, arabic: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', translation: 'Untukmu agamamu, dan untukku agamaku' }
    ]
  },
  {
    number: 108,
    name: 'Al-Kautsar',
    arabicName: 'الْكَوْثَر',
    verses: [
      { number: 1, arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', translation: 'Sesungguhnya Kami telah memberimu (nikmat yang banyak yaitu) al-Kautsar' },
      { number: 2, arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', translation: 'Maka laksanakanlah salat karena Tuhanmu, dan berkorbanlah' },
      { number: 3, arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', translation: 'Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah)' }
    ]
  },
  {
    number: 107,
    name: "Al-Ma'un",
    arabicName: 'الْمَاعُون',
    verses: [
      { number: 1, arabic: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ', translation: 'Tahukah kamu (orang) yang mendustakan agama?' },
      { number: 2, arabic: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ', translation: 'Itulah orang yang menghardik anak yatim' },
      { number: 3, arabic: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ', translation: 'Dan tidak menganjurkan memberi makan orang miskin' },
      { number: 4, arabic: 'فَوَيْلٌ لِّلْمُصَلِّينَ', translation: 'Maka celakalah bagi orang yang salat' },
      { number: 5, arabic: 'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ', translation: 'Yang lalai terhadap salatnya' },
      { number: 6, arabic: 'الَّذِينَ هُمْ يُرَاءُونَ', translation: 'Yang berbuat riya' },
      { number: 7, arabic: 'وَيَمْنَعُونَ الْمَاعُونَ', translation: 'Dan enggan (memberikan) bantuan' }
    ]
  },
  {
    number: 106,
    name: 'Quraisy',
    arabicName: 'قُرَيْش',
    verses: [
      { number: 1, arabic: 'لِإِيلَافِ قُرَيْشٍ', translation: 'Karena kebiasaan orang-orang Quraisy' },
      { number: 2, arabic: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', translation: 'Yaitu kebiasaan mereka bepergian pada musim dingin dan musim panas' },
      { number: 3, arabic: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ', translation: 'Maka hendaklah mereka menyembah Tuhan (pemilik) rumah ini (Kakbah)' },
      { number: 4, arabic: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ', translation: 'Yang telah memberi makanan kepada mereka untuk menghilangkan lapar dan mengamankan mereka dari ketakutan' }
    ]
  },
  {
    number: 105,
    name: 'Al-Fil',
    arabicName: 'الْفِيل',
    verses: [
      { number: 1, arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ', translation: 'Tidakkah engkau (Muhammad) perhatikan bagaimana Tuhanmu telah bertindak terhadap pasukan bergajah?' },
      { number: 2, arabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', translation: 'Bukankah Dia telah menjadikan tipu daya mereka itu sia-sia?' },
      { number: 3, arabic: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', translation: 'Dan Dia mengirimkan kepada mereka burung yang berbondong-bondong' },
      { number: 4, arabic: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', translation: 'Yang melempari mereka dengan batu dari tanah liat yang dibakar' },
      { number: 5, arabic: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ', translation: 'Sehingga mereka dijadikan-Nya seperti daun-daun yang dimakan (ulat)' }
    ]
  }
];

export const getSurahData = (surahNumber: number): SurahData | undefined => {
  return juzAmmaData.find(s => s.number === surahNumber);
};

export const getSurahByName = (name: string): SurahData | undefined => {
  return juzAmmaData.find(s => s.name === name || s.arabicName === name);
};
