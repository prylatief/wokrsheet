
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
  COLOR_CODING = 'Koding Warna',
  SEQUENCE_CODING = 'Koding Urutan',
  IF_THEN_LOGIC = 'Logika Jika-Maka',
  PIXEL_ART = 'Pixel Art',
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

// --- CODING EXERCISES ---
export type ColorCodingExerciseType = 'sequence' | 'matching' | 'pattern';

interface ColorCodingConfig extends BaseExerciseConfig {
  exerciseType: ColorCodingExerciseType;
  colors: string[]; // Array of colors for the exercise
  instruction: string;
}

export interface SequenceStep {
  id: string;
  icon: string; // emoji or text
  label: string;
}

interface SequenceCodingConfig extends BaseExerciseConfig {
  steps: SequenceStep[];
  instruction: string;
}

export interface IfThenRule {
  id: string;
  condition: string; // e.g., "Jika angka genap", "Jika di baris pertama"
  action: string; // e.g., "Warnai biru", "Gambar bintang"
  emoji?: string;
}

interface IfThenLogicConfig extends BaseExerciseConfig {
  rules: IfThenRule[];
  instruction: string;
  items: number; // Jumlah item untuk diterapkan rules (misalnya 10 kotak)
}

interface PixelArtConfig extends BaseExerciseConfig {
  gridRows: number;
  gridCols: number;
  colorPalette: string[];
  instruction: string;
  prefilledCells?: { row: number; col: number; color: string }[];
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
  | { id: string; type: ExerciseType.JUZ_AMMA; config: JuzAmmaConfig; pageNumber: number }
  | { id: string; type: ExerciseType.COLOR_CODING; config: ColorCodingConfig; pageNumber: number }
  | { id: string; type: ExerciseType.SEQUENCE_CODING; config: SequenceCodingConfig; pageNumber: number }
  | { id: string; type: ExerciseType.IF_THEN_LOGIC; config: IfThenLogicConfig; pageNumber: number }
  | { id: string; type: ExerciseType.PIXEL_ART; config: PixelArtConfig; pageNumber: number };

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
  },
  {
    number: 104,
    name: 'Al-Humaza',
    arabicName: 'الْهُمَزَة',
    verses: [
      { number: 1, arabic: 'وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ', translation: 'Celakalah bagi setiap pengumpat dan pencela' },
      { number: 2, arabic: 'الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ', translation: 'Yang mengumpulkan harta dan menghitung-hitung' },
      { number: 3, arabic: 'يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ', translation: 'Dia mengira bahwa hartanya itu dapat mengekalkannya' },
      { number: 4, arabic: 'كَلَّا ۖ لَيُنبَذَنَّ فِي الْحُطَمَةِ', translation: 'Sekali-kali tidak! Pasti dia akan dilemparkan ke dalam (neraka) Hutamah' },
      { number: 5, arabic: 'وَمَا أَدْرَاكَ مَا الْحُطَمَةُ', translation: 'Dan tahukah kamu apakah (neraka) Hutamah itu?' },
      { number: 6, arabic: 'نَارُ اللَّهِ الْمُوقَدَةُ', translation: '(Yaitu) api (azab) Allah yang dinyalakan' },
      { number: 7, arabic: 'الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ', translation: 'Yang (membakar) sampai ke hati' },
      { number: 8, arabic: 'إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ', translation: 'Sungguh, api itu ditutup rapat atas mereka' },
      { number: 9, arabic: 'فِي عَمَدٍ مُّمَدَّدَةٍ', translation: 'Dalam tiang-tiang yang panjang' }
    ]
  },
  {
    number: 103,
    name: 'Al-Asr',
    arabicName: 'الْعَصْر',
    verses: [
      { number: 1, arabic: 'وَالْعَصْرِ', translation: 'Demi masa' },
      { number: 2, arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', translation: 'Sungguh, manusia berada dalam kerugian' },
      { number: 3, arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', translation: 'Kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran' }
    ]
  },
  {
    number: 102,
    name: 'At-Takathur',
    arabicName: 'التَّكَاثُر',
    verses: [
      { number: 1, arabic: 'أَلْهَاكُمُ التَّكَاثُرُ', translation: 'Bermegah-megahan telah melalaikan kamu' },
      { number: 2, arabic: 'حَتَّىٰ زُرْتُمُ الْمَقَابِرَ', translation: 'Sampai kamu masuk ke dalam kubur' },
      { number: 3, arabic: 'كَلَّا سَوْفَ تَعْلَمُونَ', translation: 'Sekali-kali tidak! Kelak kamu akan mengetahui (akibat perbuatanmu itu)' },
      { number: 4, arabic: 'ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ', translation: 'Sekali-kali tidak! Kelak kamu akan mengetahui' },
      { number: 5, arabic: 'كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ', translation: 'Sekali-kali tidak! Sekiranya kamu mengetahui dengan pasti' },
      { number: 6, arabic: 'لَتَرَوُنَّ الْجَحِيمَ', translation: 'Niscaya kamu benar-benar akan melihat neraka Jahim' },
      { number: 7, arabic: 'ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ', translation: 'Kemudian kamu pasti akan melihatnya dengan yakin' },
      { number: 8, arabic: 'ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ', translation: 'Kemudian kamu pasti akan ditanyai pada hari itu tentang kenikmatan (yang kamu megah-megahkan di dunia itu)' }
    ]
  },
  {
    number: 101,
    name: "Al-Qari'ah",
    arabicName: 'الْقَارِعَة',
    verses: [
      { number: 1, arabic: 'الْقَارِعَةُ', translation: 'Hari Kiamat' },
      { number: 2, arabic: 'مَا الْقَارِعَةُ', translation: 'Apakah hari Kiamat itu?' },
      { number: 3, arabic: 'وَمَا أَدْرَاكَ مَا الْقَارِعَةُ', translation: 'Dan tahukah kamu apakah hari Kiamat itu?' },
      { number: 4, arabic: 'يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ', translation: 'Pada hari itu manusia seperti laron yang beterbangan' },
      { number: 5, arabic: 'وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنفُوشِ', translation: 'Dan gunung-gunung seperti bulu yang dihambur-hamburkan' },
      { number: 6, arabic: 'فَأَمَّا مَنثَقُلَتْ مَوَازِينُهُ', translation: 'Adapun orang yang berat timbangan (kebaikan)nya' },
      { number: 7, arabic: 'فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ', translation: 'Maka dia berada dalam kehidupan yang memuaskan' },
      { number: 8, arabic: 'وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ', translation: 'Dan adapun orang yang ringan timbangan (kebaikan)nya' },
      { number: 9, arabic: 'فَأُمُّهُ هَاوِيَةٌ', translation: 'Maka tempat kembalinya adalah neraka Hawiyah' },
      { number: 10, arabic: 'وَمَا أَدْرَاكَ مَا هِيَهْ', translation: 'Dan tahukah kamu apakah neraka Hawiyah itu?' },
      { number: 11, arabic: 'نَارٌ حَامِيَةٌ', translation: 'Yaitu api yang sangat panas' }
    ]
  },
  {
    number: 100,
    name: 'Al-Adiyat',
    arabicName: 'الْعَادِيَات',
    verses: [
      { number: 1, arabic: 'وَالْعَادِيَاتِ ضَبْحًا', translation: 'Demi kuda perang yang berlari kencang terengah-engah' },
      { number: 2, arabic: 'فَالْمُورِيَاتِ قَدْحًا', translation: 'Dan kuda yang mencetuskan api dengan (membenturkan) kuku (ke batu)' },
      { number: 3, arabic: 'فَالْمُغِيرَاتِ صُبْحًا', translation: 'Dan kuda yang menyerang dengan tiba-tiba pada waktu pagi' },
      { number: 4, arabic: 'فَأَثَرْنَ بِهِ نَقْعًا', translation: 'Maka ia menerbangkan debu' },
      { number: 5, arabic: 'فَوَسَطْنَ بِهِ جَمْعًا', translation: 'Lalu menyerbu ke tengah-tengah kumpulan musuh' },
      { number: 6, arabic: 'إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ', translation: 'Sungguh, manusia itu sangat ingkar kepada Tuhannya' },
      { number: 7, arabic: 'وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ', translation: 'Dan sungguh, dia menjadi saksi atas keingkarannya itu' },
      { number: 8, arabic: 'وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ', translation: 'Dan sungguh, cintanya kepada harta benar-benar berlebihan' },
      { number: 9, arabic: 'أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ', translation: 'Maka tidakkah dia mengetahui apabila apa yang di dalam kubur dikeluarkan?' },
      { number: 10, arabic: 'وَحُصِّلَ مَا فِي الصُّدُورِ', translation: 'Dan apa yang tersimpan dalam hati dilahirkan?' },
      { number: 11, arabic: 'إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌ', translation: 'Sungguh, Tuhan mereka pada hari itu Mahateliti terhadap keadaan mereka' }
    ]
  },
  {
    number: 99,
    name: 'Az-Zalzalah',
    arabicName: 'الزَّلْزَلَة',
    verses: [
      { number: 1, arabic: 'إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا', translation: 'Apabila bumi digoncangkan dengan goncangannya (yang dahsyat)' },
      { number: 2, arabic: 'وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا', translation: 'Dan bumi telah mengeluarkan beban-beban berat (yang dikandung)nya' },
      { number: 3, arabic: 'وَقَالَ الْإِنسَانُ مَا لَهَا', translation: 'Dan manusia bertanya, "Apa yang terjadi pada bumi ini?"' },
      { number: 4, arabic: 'يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا', translation: 'Pada hari itu bumi menyampaikan beritanya' },
      { number: 5, arabic: 'بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا', translation: 'Karena Tuhanmu telah memerintahkan (yang sedemikian itu) kepadanya' },
      { number: 6, arabic: 'يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ', translation: 'Pada hari itu manusia keluar dari kuburnya dalam keadaan bermacam-macam, agar diperlihatkan kepada mereka (balasan) pekerjaan mereka' },
      { number: 7, arabic: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ', translation: 'Maka barangsiapa mengerjakan kebaikan seberat zarrah, niscaya dia akan melihat (balasan)nya' },
      { number: 8, arabic: 'وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ', translation: 'Dan barangsiapa mengerjakan kejahatan seberat zarrah, niscaya dia akan melihat (balasan)nya' }
    ]
  },
  {
    number: 98,
    name: 'Al-Bayyinah',
    arabicName: 'الْبَيِّنَة',
    verses: [
      { number: 1, arabic: 'لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ', translation: 'Orang-orang kafir dari golongan Ahli Kitab dan orang-orang musyrik tidak akan meninggalkan (agamanya) sebelum datang kepada mereka bukti yang nyata' },
      { number: 2, arabic: 'رَسُولٌ مِّنَ اللَّهِ يَتْلُو صُحُفًا مُّطَهَّرَةً', translation: 'Yaitu seorang Rasul dari Allah (Muhammad) yang membacakan lembaran-lembaran yang suci (Al-Quran)' },
      { number: 3, arabic: 'فِيهَا كُتُبٌ قَيِّمَةٌ', translation: 'Di dalamnya terdapat kitab-kitab yang bernilai luhur' },
      { number: 4, arabic: 'وَمَا تَفَرَّقَ الَّذِينَ أُوتُوا الْكِتَابَ إِلَّا مِن بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَةُ', translation: 'Dan tidaklah berpecah belah orang-orang yang telah diberi Al-Kitab melainkan setelah bukti yang nyata itu datang kepada mereka' },
      { number: 5, arabic: 'وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ ۚ وَذَٰلِكَ دِينُ الْقَيِّمَةِ', translation: 'Padahal mereka hanya diperintah menyembah Allah dengan ikhlas menaati-Nya semata-mata karena (menjalankan) agama, dan juga agar melaksanakan salat dan menunaikan zakat; dan yang demikian itulah agama yang lurus (benar)' },
      { number: 6, arabic: 'إِنَّ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ فِي نَارِ جَهَنَّمَ خَالِدِينَ فِيهَا ۚ أُولَٰئِكَ هُمْ شَرُّ الْبَرِيَّةِ', translation: 'Sungguh, orang-orang kafir dari golongan Ahli Kitab dan orang-orang musyrik (akan masuk) ke neraka Jahanam; mereka kekal di dalamnya. Mereka itu adalah seburuk-buruk makhluk' },
      { number: 7, arabic: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أُولَٰئِكَ هُمْ خَيْرُ الْبَرِيَّةِ', translation: 'Sungguh, orang-orang yang beriman dan mengerjakan kebajikan, mereka itulah sebaik-baik makhluk' },
      { number: 8, arabic: 'جَزَاؤُهُمْ عِندَ رَبِّهِمْ جَنَّاتُ عَدْنٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا أَبَدًا ۖ رَّضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ ۚ ذَٰلِكَ لِمَنْ خَشِيَ رَبَّهُ', translation: 'Balasan mereka di sisi Tuhan mereka ialah surga Adn yang mengalir di bawahnya sungai-sungai; mereka kekal di dalamnya selama-lamanya. Allah rida terhadap mereka dan mereka pun rida kepada-Nya. Yang demikian itu adalah (balasan) bagi orang yang takut kepada Tuhannya' }
    ]
  },
  {
    number: 97,
    name: 'Al-Qadr',
    arabicName: 'الْقَدْر',
    verses: [
      { number: 1, arabic: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', translation: 'Sungguh, Kami telah menurunkannya (Al-Quran) pada malam kemuliaan' },
      { number: 2, arabic: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ', translation: 'Dan tahukah kamu apakah malam kemuliaan itu?' },
      { number: 3, arabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ', translation: 'Malam kemuliaan itu lebih baik daripada seribu bulan' },
      { number: 4, arabic: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ', translation: 'Pada malam itu turun para malaikat dan Ruh (Jibril) dengan izin Tuhannya untuk mengatur semua urusan' },
      { number: 5, arabic: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ', translation: 'Sejahteralah (malam itu) sampai terbit fajar' }
    ]
  },
  {
    number: 96,
    name: 'Al-Alaq',
    arabicName: 'الْعَلَق',
    verses: [
      { number: 1, arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', translation: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan' },
      { number: 2, arabic: 'خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ', translation: 'Dia telah menciptakan manusia dari segumpal darah' },
      { number: 3, arabic: 'اقْرَأْ وَرَبُّكَ الْأَكْرَمُ', translation: 'Bacalah, dan Tuhanmulah Yang Mahamulia' },
      { number: 4, arabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ', translation: 'Yang mengajar (manusia) dengan pena' },
      { number: 5, arabic: 'عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ', translation: 'Dia mengajarkan manusia apa yang tidak diketahuinya' },
      { number: 6, arabic: 'كَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ', translation: 'Sekali-kali tidak! Sungguh, manusia itu benar-benar melampaui batas' },
      { number: 7, arabic: 'أَن رَّآهُ اسْتَغْنَىٰ', translation: 'Apabila melihat dirinya serba cukup' },
      { number: 8, arabic: 'إِنَّ إِلَىٰ رَبِّكَ الرُّجْعَىٰ', translation: 'Sungguh, hanya kepada Tuhanmulah tempat kembali' },
      { number: 9, arabic: 'أَرَأَيْتَ الَّذِي يَنْهَىٰ', translation: 'Bagaimana pendapatmu tentang orang yang melarang' },
      { number: 10, arabic: 'عَبْدًا إِذَا صَلَّىٰ', translation: 'Seorang hamba ketika dia melaksanakan salat' },
      { number: 11, arabic: 'أَرَأَيْتَ إِن كَانَ عَلَى الْهُدَىٰ', translation: 'Bagaimana pendapatmu jika dia (orang yang salat itu) berada di atas kebenaran' },
      { number: 12, arabic: 'أَوْ أَمَرَ بِالتَّقْوَىٰ', translation: 'Atau dia menyuruh bertakwa?' },
      { number: 13, arabic: 'أَرَأَيْتَ إِن كَذَّبَ وَتَوَلَّىٰ', translation: 'Bagaimana pendapatmu jika dia (yang melarang itu) mendustakan dan berpaling?' },
      { number: 14, arabic: 'أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَىٰ', translation: 'Tidakkah dia mengetahui bahwa Allah melihat (segala perbuatannya)?' },
      { number: 15, arabic: 'كَلَّا لَئِن لَّمْ يَنتَهِ لَنَسْفَعًا بِالنَّاصِيَةِ', translation: 'Sekali-kali tidak! Sungguh, jika dia tidak berhenti (berbuat demikian) niscaya Kami tarik ubun-ubunnya' },
      { number: 16, arabic: 'نَاصِيَةٍ كَاذِبَةٍ خَاطِئَةٍ', translation: 'Yaitu ubun-ubun orang yang mendustakan lagi durhaka' },
      { number: 17, arabic: 'فَلْيَدْعُ نَادِيَهُ', translation: 'Maka biarlah dia memanggil golongannya (untuk menolongnya)' },
      { number: 18, arabic: 'سَنَدْعُ الزَّبَانِيَةَ', translation: 'Kelak Kami akan memanggil malaikat Zabaniah (penjaga neraka)' },
      { number: 19, arabic: 'كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِب ۩', translation: 'Sekali-kali jangan! Janganlah kamu patuh kepadanya; dan sujud dan dekatkanlah (dirimu kepada Allah)' }
    ]
  },
  {
    number: 95,
    name: 'At-Tin',
    arabicName: 'التِّين',
    verses: [
      { number: 1, arabic: 'وَالتِّينِ وَالزَّيْتُونِ', translation: 'Demi (buah) Tin dan (buah) Zaitun' },
      { number: 2, arabic: 'وَطُورِ سِينِينَ', translation: 'Demi gunung Sinai' },
      { number: 3, arabic: 'وَهَٰذَا الْبَلَدِ الْأَمِينِ', translation: 'Dan demi negeri (Mekah) yang aman ini' },
      { number: 4, arabic: 'لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ', translation: 'Sungguh, Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya' },
      { number: 5, arabic: 'ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ', translation: 'Kemudian Kami kembalikan dia ke tempat yang serendah-rendahnya' },
      { number: 6, arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ', translation: 'Kecuali orang-orang yang beriman dan mengerjakan kebajikan; maka mereka akan mendapat pahala yang tidak ada putus-putusnya' },
      { number: 7, arabic: 'فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ', translation: 'Maka apa yang menyebabkan (orang) mendustakanmu (tentang) hari pembalasan setelah (adanya keterangan-keterangan) itu?' },
      { number: 8, arabic: 'أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ', translation: 'Bukankah Allah hakim yang paling adil?' }
    ]
  },
  {
    number: 94,
    name: 'Ash-Sharh',
    arabicName: 'الشَّرْح',
    verses: [
      { number: 1, arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', translation: 'Bukankah Kami telah melapangkan dadamu (Muhammad)?' },
      { number: 2, arabic: 'وَوَضَعْنَا عَنكَ وِزْرَكَ', translation: 'Dan Kami pun telah menurunkan bebanmu darimu' },
      { number: 3, arabic: 'الَّذِي أَنقَضَ ظَهْرَكَ', translation: 'Yang memberatkan punggungmu' },
      { number: 4, arabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ', translation: 'Dan Kami tinggikan sebutan (nama)mu bagimu' },
      { number: 5, arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Maka sesungguhnya bersama kesulitan ada kemudahan' },
      { number: 6, arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Sesungguhnya bersama kesulitan ada kemudahan' },
      { number: 7, arabic: 'فَإِذَا فَرَغْتَ فَانصَبْ', translation: 'Maka apabila engkau telah selesai (dari sesuatu urusan), tetaplah bekerja keras (untuk urusan yang lain)' },
      { number: 8, arabic: 'وَإِلَىٰ رَبِّكَ فَارْغَب', translation: 'Dan hanya kepada Tuhanmulah engkau berharap' }
    ]
  },
  {
    number: 93,
    name: 'Ad-Duha',
    arabicName: 'الضُّحَى',
    verses: [
      { number: 1, arabic: 'وَالضُّحَىٰ', translation: 'Demi waktu matahari sepenggalahan naik' },
      { number: 2, arabic: 'وَالَّيْلِ إِذَا سَجَىٰ', translation: 'Dan demi malam apabila telah sunyi' },
      { number: 3, arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', translation: 'Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak (pula) membenci(mu)' },
      { number: 4, arabic: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ', translation: 'Dan sungguh, yang kemudian itu lebih baik bagimu daripada yang permulaan' },
      { number: 5, arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', translation: 'Dan sungguh, kelak Tuhanmu pasti memberikan karunia-Nya kepadamu, sehingga engkau menjadi puas' },
      { number: 6, arabic: 'أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ', translation: 'Bukankah Dia mendapatimu sebagai seorang yatim, lalu Dia melindungimu' },
      { number: 7, arabic: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', translation: 'Dan Dia mendapatimu sebagai seorang yang bingung, lalu Dia memberikan petunjuk' },
      { number: 8, arabic: 'وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ', translation: 'Dan Dia mendapatimu sebagai seorang yang kekurangan, lalu Dia memberikan kecukupan' },
      { number: 9, arabic: 'فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ', translation: 'Maka terhadap anak yatim janganlah engkau berlaku sewenang-wenang' },
      { number: 10, arabic: 'وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ', translation: 'Dan terhadap orang yang meminta-minta janganlah engkau menghardik(nya)' },
      { number: 11, arabic: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ', translation: 'Dan terhadap nikmat Tuhanmu hendaklah engkau nyatakan (dengan bersyukur)' }
    ]
  },
  {
    number: 92,
    name: 'Al-Layl',
    arabicName: 'اللَّيْل',
    verses: [
      { number: 1, arabic: 'وَالَّيْلِ إِذَا يَغْشَىٰ', translation: 'Demi malam apabila menutupi (cahaya siang)' },
      { number: 2, arabic: 'وَالنَّهَارِ إِذَا تَجَلَّىٰ', translation: 'Dan demi siang apabila terang benderang' },
      { number: 3, arabic: 'وَمَا خَلَقَ الذَّكَرَ وَالْأُنثَىٰ', translation: 'Dan demi (penciptaan) laki-laki dan perempuan' },
      { number: 4, arabic: 'إِنَّ سَعْيَكُمْ لَشَتَّىٰ', translation: 'Sungguh, usaha kamu memang berbeda-beda' },
      { number: 5, arabic: 'فَأَمَّا مَنْ أَعْطَىٰ وَاتَّقَىٰ', translation: 'Adapun orang yang memberikan (hartanya di jalan Allah) dan bertakwa' },
      { number: 6, arabic: 'وَصَدَّقَ بِالْحُسْنَىٰ', translation: 'Dan membenarkan (adanya pahala) yang terbaik' },
      { number: 7, arabic: 'فَسَنُيَسِّرُهُ لِلْيُسْرَىٰ', translation: 'Maka akan Kami mudahkan baginya jalan menuju kemudahan' },
      { number: 8, arabic: 'وَأَمَّا مَن بَخِلَ وَاسْتَغْنَىٰ', translation: 'Dan adapun orang yang kikir dan merasa dirinya cukup' },
      { number: 9, arabic: 'وَكَذَّبَ بِالْحُسْنَىٰ', translation: 'Serta mendustakan (pahala) yang terbaik' },
      { number: 10, arabic: 'فَسَنُيَسِّرُهُ لِلْعُسْرَىٰ', translation: 'Maka akan Kami mudahkan baginya jalan menuju kesukaran' },
      { number: 11, arabic: 'وَمَا يُغْنِي عَنْهُ مَالُهُ إِذَا تَرَدَّىٰ', translation: 'Dan hartanya tidak bermanfaat baginya apabila dia telah binasa' },
      { number: 12, arabic: 'إِنَّ عَلَيْنَا لَلْهُدَىٰ', translation: 'Sungguh, kewajiban Kami memberi petunjuk' },
      { number: 13, arabic: 'وَإِنَّ لَنَا لَلْآخِرَةَ وَالْأُولَىٰ', translation: 'Dan sungguh, milik Kami kehidupan akhirat dan kehidupan dunia' },
      { number: 14, arabic: 'فَأَنذَرْتُكُمْ نَارًا تَلَظَّىٰ', translation: 'Maka Aku telah memperingatkan kamu dengan (azab) api yang menyala-nyala' },
      { number: 15, arabic: 'لَا يَصْلَاهَا إِلَّا الْأَشْقَى', translation: 'Tidak ada yang masuk ke dalamnya kecuali orang yang paling celaka' },
      { number: 16, arabic: 'الَّذِي كَذَّبَ وَتَوَلَّىٰ', translation: 'Yang mendustakan (kebenaran) dan berpaling (dari iman)' },
      { number: 17, arabic: 'وَسَيُجَنَّبُهَا الْأَتْقَى', translation: 'Dan kelak akan dijauhkan dari (neraka) itu orang yang paling takwa' },
      { number: 18, arabic: 'الَّذِي يُؤْتِي مَالَهُ يَتَزَكَّىٰ', translation: 'Yang menafkahkan hartanya (di jalan Allah) untuk membersihkan (diri)nya' },
      { number: 19, arabic: 'وَمَا لِأَحَدٍ عِندَهُ مِن نِّعْمَةٍ تُجْزَىٰ', translation: 'Padahal tidak ada seseorang yang memberi nikmat kepadanya yang harus dibalasnya' },
      { number: 20, arabic: 'إِلَّا ابْتِغَاءَ وَجْهِ رَبِّهِ الْأَعْلَىٰ', translation: 'Tetapi (dia memberikan itu semata-mata) karena mencari keridhaan Tuhannya Yang Mahatinggi' },
      { number: 21, arabic: 'وَلَسَوْفَ يَرْضَىٰ', translation: 'Dan kelak dia pasti mendapat kepuasan' }
    ]
  },
  {
    number: 91,
    name: 'Ash-Shams',
    arabicName: 'الشَّمْس',
    verses: [
      { number: 1, arabic: 'وَالشَّمْسِ وَضُحَاهَا', translation: 'Demi matahari dan cahayanya pada pagi hari' },
      { number: 2, arabic: 'وَالْقَمَرِ إِذَا تَلَاهَا', translation: 'Demi bulan apabila mengiringinya' },
      { number: 3, arabic: 'وَالنَّهَارِ إِذَا جَلَّاهَا', translation: 'Demi siang apabila menampakkannya' },
      { number: 4, arabic: 'وَالَّيْلِ إِذَا يَغْشَاهَا', translation: 'Demi malam apabila menutupinya' },
      { number: 5, arabic: 'وَالسَّمَاءِ وَمَا بَنَاهَا', translation: 'Demi langit dan (Allah) yang membangunnya' },
      { number: 6, arabic: 'وَالْأَرْضِ وَمَا طَحَاهَا', translation: 'Demi bumi dan (Allah) yang menghamparkannya' },
      { number: 7, arabic: 'وَنَفْسٍ وَمَا سَوَّاهَا', translation: 'Demi jiwa serta penyempurnaannya' },
      { number: 8, arabic: 'فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا', translation: 'Maka Dia mengilhamkan kepadanya (jalan) kejahatan dan ketakwaannya' },
      { number: 9, arabic: 'قَدْ أَفْلَحَ مَن زَكَّاهَا', translation: 'Sungguh beruntung orang yang menyucikannya (jiwa itu)' },
      { number: 10, arabic: 'وَقَدْ خَابَ مَن دَسَّاهَا', translation: 'Dan sungguh rugi orang yang mengotorinya' },
      { number: 11, arabic: 'كَذَّبَتْ ثَمُودُ بِطَغْوَاهَا', translation: 'Kaum Tsamud telah mendustakan (Rasul) karena kedurhakaannya' },
      { number: 12, arabic: 'إِذِ انبَعَثَ أَشْقَاهَا', translation: 'Ketika bangkit orang yang paling celaka di antara mereka' },
      { number: 13, arabic: 'فَقَالَ لَهُمْ رَسُولُ اللَّهِ نَاقَةَ اللَّهِ وَسُقْيَاهَا', translation: 'Lalu Rasul Allah (Saleh) berkata kepada mereka, "(Ini) unta betina Allah, dan (ini) gilirannya minum"' },
      { number: 14, arabic: 'فَكَذَّبُوهُ فَعَقَرُوهَا فَدَمْدَمَ عَلَيْهِمْ رَبُّهُم بِذَنبِهِمْ فَسَوَّاهَا', translation: 'Namun mereka mendustakannya lalu mereka menyembelih (unta betina) itu, maka Tuhan mereka membinasakan mereka disebabkan dosa mereka, lalu Dia meratakan (azab-Nya atas) mereka' },
      { number: 15, arabic: 'وَلَا يَخَافُ عُقْبَاهَا', translation: 'Dan Dia tidak takut akan akibat (dari membinasakan) mereka' }
    ]
  },
  {
    number: 90,
    name: 'Al-Balad',
    arabicName: 'الْبَلَد',
    verses: [
      { number: 1, arabic: 'لَا أُقْسِمُ بِهَٰذَا الْبَلَدِ', translation: 'Aku bersumpah dengan negeri ini (Mekah)' },
      { number: 2, arabic: 'وَأَنتَ حِلٌّ بِهَٰذَا الْبَلَدِ', translation: 'Dan engkau (Muhammad) bertempat di negeri ini' },
      { number: 3, arabic: 'وَوَالِدٍ وَمَا وَلَدَ', translation: 'Dan demi bapak dan anaknya' },
      { number: 4, arabic: 'لَقَدْ خَلَقْنَا الْإِنسَانَ فِي كَبَدٍ', translation: 'Sungguh, Kami telah menciptakan manusia berada dalam kesusahan' },
      { number: 5, arabic: 'أَيَحْسَبُ أَن لَّن يَقْدِرَ عَلَيْهِ أَحَدٌ', translation: 'Apakah dia (manusia) mengira bahwa tidak ada seorang pun yang mampu terhadapnya?' },
      { number: 6, arabic: 'يَقُولُ أَهْلَكْتُ مَالًا لُّبَدًا', translation: 'Dia berkata, "Aku telah menghabiskan harta yang banyak"' },
      { number: 7, arabic: 'أَيَحْسَبُ أَن لَّمْ يَرَهُ أَحَدٌ', translation: 'Apakah dia mengira bahwa tidak ada seorang pun yang melihatnya?' },
      { number: 8, arabic: 'أَلَمْ نَجْعَل لَّهُ عَيْنَيْنِ', translation: 'Bukankah Kami telah menjadikan untuknya sepasang mata' },
      { number: 9, arabic: 'وَلِسَانًا وَشَفَتَيْنِ', translation: 'Lidah dan sepasang bibir' },
      { number: 10, arabic: 'وَهَدَيْنَاهُ النَّجْدَيْنِ', translation: 'Dan Kami telah menunjukkan kepadanya dua jalan (kebajikan dan kejahatan)' },
      { number: 11, arabic: 'فَلَا اقْتَحَمَ الْعَقَبَةَ', translation: 'Tetapi dia tidak menempuh jalan yang mendaki (dan sulit)' },
      { number: 12, arabic: 'وَمَا أَدْرَاكَ مَا الْعَقَبَةُ', translation: 'Dan tahukah kamu apakah jalan yang mendaki (dan sulit) itu?' },
      { number: 13, arabic: 'فَكُّ رَقَبَةٍ', translation: 'Yaitu melepaskan budak dari perbudakan' },
      { number: 14, arabic: 'أَوْ إِطْعَامٌ فِي يَوْمٍ ذِي مَسْغَبَةٍ', translation: 'Atau memberi makan pada hari kelaparan' },
      { number: 15, arabic: 'يَتِيمًا ذَا مَقْرَبَةٍ', translation: 'Kepada anak yatim yang ada hubungan kerabat' },
      { number: 16, arabic: 'أَوْ مِسْكِينًا ذَا مَتْرَبَةٍ', translation: 'Atau kepada orang miskin yang sangat fakir' },
      { number: 17, arabic: 'ثُمَّ كَانَ مِنَ الَّذِينَ آمَنُوا وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا بِالْمَرْحَمَةِ', translation: 'Kemudian dia termasuk orang-orang yang beriman dan saling berpesan untuk bersabar dan saling berpesan untuk berkasih sayang' },
      { number: 18, arabic: 'أُولَٰئِكَ أَصْحَابُ الْمَيْمَنَةِ', translation: 'Mereka itulah golongan kanan' },
      { number: 19, arabic: 'وَالَّذِينَ كَفَرُوا بِآيَاتِنَا هُمْ أَصْحَابُ الْمَشْأَمَةِ', translation: 'Dan orang-orang yang kafir terhadap ayat-ayat Kami, mereka itu golongan kiri' },
      { number: 20, arabic: 'عَلَيْهِمْ نَارٌ مُّؤْصَدَةٌ', translation: 'Mereka berada dalam neraka yang ditutup rapat' }
    ]
  },
  {
    number: 89,
    name: 'Al-Fajr',
    arabicName: 'الْفَجْر',
    verses: [
      { number: 1, arabic: 'وَالْفَجْرِ', translation: 'Demi fajar' },
      { number: 2, arabic: 'وَلَيَالٍ عَشْرٍ', translation: 'Dan malam yang sepuluh' },
      { number: 3, arabic: 'وَالشَّفْعِ وَالْوَتْرِ', translation: 'Dan yang genap dan yang ganjil' },
      { number: 4, arabic: 'وَاللَّيْلِ إِذَا يَسْرِ', translation: 'Dan malam apabila berlalu' },
      { number: 5, arabic: 'هَلْ فِي ذَٰلِكَ قَسَمٌ لِّذِي حِجْرٍ', translation: 'Pada yang demikian itu terdapat sumpah (yang dapat diterima) oleh orang yang berakal' },
      { number: 6, arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِعَادٍ', translation: 'Tidakkah engkau (Muhammad) memperhatikan bagaimana Tuhanmu berbuat terhadap (kaum) \'Ad?' },
      { number: 7, arabic: 'إِرَمَ ذَاتِ الْعِمَادِ', translation: 'Yaitu penduduk Iram yang mempunyai bangunan-bangunan yang tinggi' },
      { number: 8, arabic: 'الَّتِي لَمْ يُخْلَقْ مِثْلُهَا فِي الْبِلَادِ', translation: 'Yang belum pernah dibangun (suatu kota) seperti itu, di negeri-negeri lain' },
      { number: 9, arabic: 'وَثَمُودَ الَّذِينَ جَابُوا الصَّخْرَ بِالْوَادِ', translation: 'Dan kaum Tsamud yang memotong batu-batu besar di lembah' },
      { number: 10, arabic: 'وَفِرْعَوْنَ ذِي الْأَوْتَادِ', translation: 'Dan Fir\'aun yang mempunyai pasak-pasak (tentara yang banyak)' },
      { number: 11, arabic: 'الَّذِينَ طَغَوْا فِي الْبِلَادِ', translation: 'Yang berbuat sewenang-wenang dalam negeri' },
      { number: 12, arabic: 'فَأَكْثَرُوا فِيهَا الْفَسَادَ', translation: 'Lalu mereka berbuat banyak kerusakan di dalamnya' },
      { number: 13, arabic: 'فَصَبَّ عَلَيْهِمْ رَبُّكَ سَوْطَ عَذَابٍ', translation: 'Karena itu Tuhanmu menimpakan kepada mereka cemeti azab' },
      { number: 14, arabic: 'إِنَّ رَبَّكَ لَبِالْمِرْصَادِ', translation: 'Sungguh, Tuhanmu benar-benar mengawasi' },
      { number: 15, arabic: 'فَأَمَّا الْإِنسَانُ إِذَا مَا ابْتَلَاهُ رَبُّهُ فَأَكْرَمَهُ وَنَعَّمَهُ فَيَقُولُ رَبِّي أَكْرَمَنِ', translation: 'Adapun manusia, apabila Tuhannya mengujinya lalu Dia dimuliakan-Nya dan diberi-Nya kesenangan, maka dia akan berkata, "Tuhanku telah memuliakanku"' },
      { number: 16, arabic: 'وَأَمَّا إِذَا مَا ابْتَلَاهُ فَقَدَرَ عَلَيْهِ رِزْقَهُ فَيَقُولُ رَبِّي أَهَانَنِ', translation: 'Dan apabila Dia mengujinya lalu membatasi rezekinya maka dia berkata, "Tuhanku menghinakanku"' },
      { number: 17, arabic: 'كَلَّا ۖ بَل لَّا تُكْرِمُونَ الْيَتِيمَ', translation: 'Sekali-kali tidak (demikian), sebenarnya kamu tidak memuliakan anak yatim' },
      { number: 18, arabic: 'وَلَا تَحَاضُّونَ عَلَىٰ طَعَامِ الْمِسْكِينِ', translation: 'Dan kamu tidak saling mendorong untuk memberi makan orang miskin' },
      { number: 19, arabic: 'وَتَأْكُلُونَ التُّرَاثَ أَكْلًا لَّمًّا', translation: 'Dan kamu memakan harta pusaka dengan cara mencampur baurkan (yang halal dan yang haram)' },
      { number: 20, arabic: 'وَتُحِبُّونَ الْمَالَ حُبًّا جَمًّا', translation: 'Dan kamu mencintai harta benda dengan kecintaan yang berlebihan' },
      { number: 21, arabic: 'كَلَّا إِذَا دُكَّتِ الْأَرْضُ دَكًّا دَكًّا', translation: 'Sekali-kali tidak! Apabila bumi diguncang berturut-turut' },
      { number: 22, arabic: 'وَجَاءَ رَبُّكَ وَالْمَلَكُ صَفًّا صَفًّا', translation: 'Dan datanglah Tuhanmu; sedang para malaikat berbaris-baris' },
      { number: 23, arabic: 'وَجِيءَ يَوْمَئِذٍ بِجَهَنَّمَ ۚ يَوْمَئِذٍ يَتَذَكَّرُ الْإِنسَانُ وَأَنَّىٰ لَهُ الذِّكْرَىٰ', translation: 'Dan pada hari itu diperlihatkan neraka Jahanam; pada hari itulah manusia teringat akan tetapi tidak berguna lagi mengingat itu (baginya)' },
      { number: 24, arabic: 'يَقُولُ يَا لَيْتَنِي قَدَّمْتُ لِحَيَاتِي', translation: 'Dia berkata, "Alangkah baiknya kiranya aku dahulu mengerjakan (amal saleh) untuk hidupku ini"' },
      { number: 25, arabic: 'فَيَوْمَئِذٍ لَّا يُعَذِّبُ عَذَابَهُ أَحَدٌ', translation: 'Maka pada hari itu tidak ada seorang pun yang menyiksa seperti siksa-Nya' },
      { number: 26, arabic: 'وَلَا يُوثِقُ وَثَاقَهُ أَحَدٌ', translation: 'Dan tidak ada yang dapat mengikat seperti ikatan-Nya' },
      { number: 27, arabic: 'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ', translation: 'Wahai jiwa yang tenang!' },
      { number: 28, arabic: 'ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً', translation: 'Kembalilah kepada Tuhanmu dengan hati yang rida dan diridai-Nya' },
      { number: 29, arabic: 'فَادْخُلِي فِي عِبَادِي', translation: 'Maka masuklah ke dalam golongan hamba-hamba-Ku' },
      { number: 30, arabic: 'وَادْخُلِي جَنَّتِي', translation: 'Dan masuklah ke dalam surga-Ku' }
    ]
  },
  {
    number: 88,
    name: 'Al-Ghashiyah',
    arabicName: 'الْغَاشِيَة',
    verses: [
      { number: 1, arabic: 'هَلْ أَتَاكَ حَدِيثُ الْغَاشِيَةِ', translation: 'Sudahkah sampai kepadamu berita (tentang hari) yang menutupi (segala sesuatu)?' },
      { number: 2, arabic: 'وُجُوهٌ يَوْمَئِذٍ خَاشِعَةٌ', translation: 'Pada hari itu banyak wajah yang tertunduk terhina' },
      { number: 3, arabic: 'عَامِلَةٌ نَّاصِبَةٌ', translation: 'Bekerja keras lagi kepayahan' },
      { number: 4, arabic: 'تَصْلَىٰ نَارًا حَامِيَةً', translation: 'Memasuki api yang sangat panas (neraka)' },
      { number: 5, arabic: 'تُسْقَىٰ مِنْ عَيْنٍ آنِيَةٍ', translation: 'Diberi minum dari sumber air yang mendidih' },
      { number: 6, arabic: 'لَّيْسَ لَهُمْ طَعَامٌ إِلَّا مِن ضَرِيعٍ', translation: 'Tidak ada makanan bagi mereka selain dari pohon yang berduri' },
      { number: 7, arabic: 'لَّا يُسْمِنُ وَلَا يُغْنِي مِن جُوعٍ', translation: 'Yang tidak menggemukkan dan tidak pula menghilangkan lapar' },
      { number: 8, arabic: 'وُجُوهٌ يَوْمَئِذٍ نَّاعِمَةٌ', translation: 'Pada hari itu banyak wajah yang berseri-seri' },
      { number: 9, arabic: 'لِّسَعْيِهَا رَاضِيَةٌ', translation: 'Merasa senang karena usahanya' },
      { number: 10, arabic: 'فِي جَنَّةٍ عَالِيَةٍ', translation: 'Berada dalam surga yang tinggi' },
      { number: 11, arabic: 'لَّا تَسْمَعُ فِيهَا لَاغِيَةً', translation: 'Tidak mendengar di dalamnya perkataan yang sia-sia' },
      { number: 12, arabic: 'فِيهَا عَيْنٌ جَارِيَةٌ', translation: 'Di dalamnya ada mata air yang mengalir' },
      { number: 13, arabic: 'فِيهَا سُرُرٌ مَّرْفُوعَةٌ', translation: 'Di dalamnya ada dipan-dipan yang ditinggikan' },
      { number: 14, arabic: 'وَأَكْوَابٌ مَّوْضُوعَةٌ', translation: 'Dan gelas-gelas yang tersedia' },
      { number: 15, arabic: 'وَنَمَارِقُ مَصْفُوفَةٌ', translation: 'Dan bantal-bantal yang tersusun' },
      { number: 16, arabic: 'وَزَرَابِيُّ مَبْثُوثَةٌ', translation: 'Dan permadani-permadani yang terhampar' },
      { number: 17, arabic: 'أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ', translation: 'Maka tidakkah mereka memperhatikan unta, bagaimana diciptakan?' },
      { number: 18, arabic: 'وَإِلَى السَّمَاءِ كَيْفَ رُفِعَتْ', translation: 'Dan langit, bagaimana ditinggikan?' },
      { number: 19, arabic: 'وَإِلَى الْجِبَالِ كَيْفَ نُصِبَتْ', translation: 'Dan gunung-gunung bagaimana ditegakkan?' },
      { number: 20, arabic: 'وَإِلَى الْأَرْضِ كَيْفَ سُطِحَتْ', translation: 'Dan bumi bagaimana dihamparkan?' },
      { number: 21, arabic: 'فَذَكِّرْ إِنَّمَا أَنتَ مُذَكِّرٌ', translation: 'Maka berilah peringatan, karena sesungguhnya engkau (Muhammad) hanyalah pemberi peringatan' },
      { number: 22, arabic: 'لَّسْتَ عَلَيْهِم بِمُصَيْطِرٍ', translation: 'Engkau bukanlah orang yang berkuasa atas mereka' },
      { number: 23, arabic: 'إِلَّا مَن تَوَلَّىٰ وَكَفَرَ', translation: 'Kecuali orang yang berpaling dan kafir' },
      { number: 24, arabic: 'فَيُعَذِّبُهُ اللَّهُ الْعَذَابَ الْأَكْبَرَ', translation: 'Maka Allah akan mengazabnya dengan azab yang sangat besar' },
      { number: 25, arabic: 'إِنَّ إِلَيْنَا إِيَابَهُمْ', translation: 'Sungguh, kepada Kami tempat kembali mereka' },
      { number: 26, arabic: 'ثُمَّ إِنَّ عَلَيْنَا حِسَابَهُم', translation: 'Kemudian sungguh, kewajiban Kami menghisab mereka' }
    ]
  },
  {
    number: 87,
    name: "Al-A'la",
    arabicName: 'الْأَعْلَى',
    verses: [
      { number: 1, arabic: 'سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى', translation: 'Sucikanlah nama Tuhanmu Yang Mahatinggi' },
      { number: 2, arabic: 'الَّذِي خَلَقَ فَسَوَّىٰ', translation: 'Yang menciptakan, lalu menyempurnakan (penciptaan-Nya)' },
      { number: 3, arabic: 'وَالَّذِي قَدَّرَ فَهَدَىٰ', translation: 'Dan yang menentukan kadar (masing-masing) dan memberi petunjuk' },
      { number: 4, arabic: 'وَالَّذِي أَخْرَجَ الْمَرْعَىٰ', translation: 'Dan yang menumbuhkan rerumputan' },
      { number: 5, arabic: 'فَجَعَلَهُ غُثَاءً أَحْوَىٰ', translation: 'Lalu dijadikan-Nya (rumput-rumput) itu kering kehitam-hitaman' },
      { number: 6, arabic: 'سَنُقْرِئُكَ فَلَا تَنسَىٰ', translation: 'Kami akan membacakan (Al-Quran) kepadamu (Muhammad) sehingga engkau tidak akan lupa' },
      { number: 7, arabic: 'إِلَّا مَا شَاءَ اللَّهُ ۚ إِنَّهُ يَعْلَمُ الْجَهْرَ وَمَا يَخْفَىٰ', translation: 'Kecuali jika Allah menghendaki. Sungguh, Dia mengetahui yang terang dan yang tersembunyi' },
      { number: 8, arabic: 'وَنُيَسِّرُكَ لِلْيُسْرَىٰ', translation: 'Dan Kami akan memudahkan bagimu ke jalan yang mudah' },
      { number: 9, arabic: 'فَذَكِّرْ إِن نَّفَعَتِ الذِّكْرَىٰ', translation: 'Maka berikanlah peringatan karena peringatan itu bermanfaat' },
      { number: 10, arabic: 'سَيَذَّكَّرُ مَن يَخْشَىٰ', translation: 'Orang yang takut (kepada Allah) akan mendapat pelajaran' },
      { number: 11, arabic: 'وَيَتَجَنَّبُهَا الْأَشْقَى', translation: 'Dan orang yang celaka (kafir) akan menjauhinya' },
      { number: 12, arabic: 'الَّذِي يَصْلَى النَّارَ الْكُبْرَىٰ', translation: 'Yang akan memasuki api yang besar (neraka)' },
      { number: 13, arabic: 'ثُمَّ لَا يَمُوتُ فِيهَا وَلَا يَحْيَىٰ', translation: 'Kemudian dia di dalamnya tidak akan mati dan tidak (pula) hidup' },
      { number: 14, arabic: 'قَدْ أَفْلَحَ مَن تَزَكَّىٰ', translation: 'Sungguh beruntung orang yang menyucikan diri' },
      { number: 15, arabic: 'وَذَكَرَ اسْمَ رَبِّهِ فَصَلَّىٰ', translation: 'Dan mengingat nama Tuhannya, lalu dia salat' },
      { number: 16, arabic: 'بَلْ تُؤْثِرُونَ الْحَيَاةَ الدُّنْيَا', translation: 'Padahal kamu (orang-orang kafir) memilih kehidupan dunia' },
      { number: 17, arabic: 'وَالْآخِرَةُ خَيْرٌ وَأَبْقَىٰ', translation: 'Sedangkan kehidupan akhirat itu lebih baik dan lebih kekal' },
      { number: 18, arabic: 'إِنَّ هَٰذَا لَفِي الصُّحُفِ الْأُولَىٰ', translation: 'Sungguh, ini terdapat dalam kitab-kitab yang dahulu' },
      { number: 19, arabic: 'صُحُفِ إِبْرَاهِيمَ وَمُوسَىٰ', translation: 'Yaitu kitab-kitab Ibrahim dan Musa' }
    ]
  },
  {
    number: 86,
    name: 'At-Tariq',
    arabicName: 'الطَّارِق',
    verses: [
      { number: 1, arabic: 'وَالسَّمَاءِ وَالطَّارِقِ', translation: 'Demi langit dan yang datang pada malam hari' },
      { number: 2, arabic: 'وَمَا أَدْرَاكَ مَا الطَّارِقُ', translation: 'Dan tahukah kamu apakah yang datang pada malam hari itu?' },
      { number: 3, arabic: 'النَّجْمُ الثَّاقِبُ', translation: 'Yaitu bintang yang bersinar tajam' },
      { number: 4, arabic: 'إِن كُلُّ نَفْسٍ لَّمَّا عَلَيْهَا حَافِظٌ', translation: 'Setiap orang pasti ada penjaganya' },
      { number: 5, arabic: 'فَلْيَنظُرِ الْإِنسَانُ مِمَّ خُلِقَ', translation: 'Maka hendaklah manusia memperhatikan dari apa dia diciptakan' },
      { number: 6, arabic: 'خُلِقَ مِن مَّاءٍ دَافِقٍ', translation: 'Dia diciptakan dari air (mani) yang terpancar' },
      { number: 7, arabic: 'يَخْرُجُ مِن بَيْنِ الصُّلْبِ وَالتَّرَائِبِ', translation: 'Yang keluar dari antara tulang sulbi dan tulang dada' },
      { number: 8, arabic: 'إِنَّهُ عَلَىٰ رَجْعِهِ لَقَادِرٌ', translation: 'Sungguh, (Allah) benar-benar kuasa mengembalikannya (hidup sesudah mati)' },
      { number: 9, arabic: 'يَوْمَ تُبْلَى السَّرَائِرُ', translation: 'Pada hari ditampakkan segala rahasia' },
      { number: 10, arabic: 'فَمَا لَهُ مِن قُوَّةٍ وَلَا نَاصِرٍ', translation: 'Maka (manusia) tidak mempunyai kekuatan dan tidak (pula) penolong' },
      { number: 11, arabic: 'وَالسَّمَاءِ ذَاتِ الرَّجْعِ', translation: 'Demi langit yang mengandung hujan' },
      { number: 12, arabic: 'وَالْأَرْضِ ذَاتِ الصَّدْعِ', translation: 'Dan bumi yang mempunyai tumbuh-tumbuhan' },
      { number: 13, arabic: 'إِنَّهُ لَقَوْلٌ فَصْلٌ', translation: 'Sungguh, (Al-Quran) itu benar-benar firman yang memisahkan (antara yang hak dan yang batil)' },
      { number: 14, arabic: 'وَمَا هُوَ بِالْهَزْلِ', translation: 'Dan (Al-Quran) itu bukanlah senda gurau' },
      { number: 15, arabic: 'إِنَّهُمْ يَكِيدُونَ كَيْدًا', translation: 'Sungguh, mereka merencanakan tipu daya yang jahat' },
      { number: 16, arabic: 'وَأَكِيدُ كَيْدًا', translation: 'Dan Aku pun membuat rencana (pula) dengan sebaik-baiknya' },
      { number: 17, arabic: 'فَمَهِّلِ الْكَافِرِينَ أَمْهِلْهُمْ رُوَيْدًا', translation: 'Maka beri tangguhlah orang-orang kafir itu, beri tangguhlah mereka sebentar (saja)' }
    ]
  },
  {
    number: 85,
    name: 'Al-Buruj',
    arabicName: 'الْبُرُوج',
    verses: [
      { number: 1, arabic: 'وَالسَّمَاءِ ذَاتِ الْبُرُوجِ', translation: 'Demi langit yang mempunyai gugusan bintang' },
      { number: 2, arabic: 'وَالْيَوْمِ الْمَوْعُودِ', translation: 'Dan hari yang dijanjikan' },
      { number: 3, arabic: 'وَشَاهِدٍ وَمَشْهُودٍ', translation: 'Dan yang menyaksikan dan yang disaksikan' },
      { number: 4, arabic: 'قُتِلَ أَصْحَابُ الْأُخْدُودِ', translation: 'Binasalah orang-orang yang membuat parit' },
      { number: 5, arabic: 'النَّارِ ذَاتِ الْوَقُودِ', translation: 'Api yang mempunyai bahan bakar' },
      { number: 6, arabic: 'إِذْ هُمْ عَلَيْهَا قُعُودٌ', translation: 'Ketika mereka duduk di sekitarnya' },
      { number: 7, arabic: 'وَهُمْ عَلَىٰ مَا يَفْعَلُونَ بِالْمُؤْمِنِينَ شُهُودٌ', translation: 'Dan mereka menyaksikan apa yang mereka perbuat terhadap orang-orang mukmin' },
      { number: 8, arabic: 'وَمَا نَقَمُوا مِنْهُمْ إِلَّا أَن يُؤْمِنُوا بِاللَّهِ الْعَزِيزِ الْحَمِيدِ', translation: 'Dan mereka tidak menyiksa orang-orang mukmin itu melainkan karena orang-orang mukmin itu beriman kepada Allah Yang Mahaperkasa, Maha Terpuji' },
      { number: 9, arabic: 'الَّذِي لَهُ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ ۚ وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ شَهِيدٌ', translation: 'Yang memiliki kerajaan langit dan bumi; dan Allah Maha Menyaksikan segala sesuatu' },
      { number: 10, arabic: 'إِنَّ الَّذِينَ فَتَنُوا الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ ثُمَّ لَمْ يَتُوبُوا فَلَهُمْ عَذَابُ جَهَنَّمَ وَلَهُمْ عَذَابُ الْحَرِيقِ', translation: 'Sungguh, orang-orang yang mendatangkan cobaan kepada orang-orang mukmin laki-laki dan perempuan kemudian mereka tidak bertobat, maka mereka akan mendapat azab Jahanam dan mereka akan mendapat azab (neraka) yang membakar' },
      { number: 11, arabic: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ جَنَّاتٌ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ ۚ ذَٰلِكَ الْفَوْزُ الْكَبِيرُ', translation: 'Sungguh, orang-orang yang beriman dan mengerjakan kebajikan, mereka akan mendapat surga yang mengalir di bawahnya sungai-sungai. Itulah kemenangan yang besar' },
      { number: 12, arabic: 'إِنَّ بَطْشَ رَبِّكَ لَشَدِيدٌ', translation: 'Sungguh, azab Tuhanmu sangat keras' },
      { number: 13, arabic: 'إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ', translation: 'Sungguh, Dialah yang menciptakan (makhluk) pertama kali dan menghidupkannya (kembali)' },
      { number: 14, arabic: 'وَهُوَ الْغَفُورُ الْوَدُودُ', translation: 'Dan Dialah Yang Maha Pengampun, Maha Pengasih' },
      { number: 15, arabic: 'ذُو الْعَرْشِ الْمَجِيدُ', translation: 'Yang mempunyai \'Arsy, lagi Mahamulia' },
      { number: 16, arabic: 'فَعَّالٌ لِّمَا يُرِيدُ', translation: 'Maha Kuasa berbuat apa yang Dia kehendaki' },
      { number: 17, arabic: 'هَلْ أَتَاكَ حَدِيثُ الْجُنُودِ', translation: 'Sudahkah sampai kepadamu (Muhammad) kisah bala tentara' },
      { number: 18, arabic: 'فِرْعَوْنَ وَثَمُودَ', translation: 'Yaitu (tentara) Fir\'aun dan Tsamud?' },
      { number: 19, arabic: 'بَلِ الَّذِينَ كَفَرُوا فِي تَكْذِيبٍ', translation: 'Namun orang-orang yang kafir (tetap) dalam keadaan mendustakan (kebenaran)' },
      { number: 20, arabic: 'وَاللَّهُ مِن وَرَائِهِم مُّحِيطٌ', translation: 'Padahal Allah meliputi (ilmu dan kekuasaan-Nya) dari belakang (segala perbuatan) mereka' },
      { number: 21, arabic: 'بَلْ هُوَ قُرْآنٌ مَّجِيدٌ', translation: 'Bahkan ini (yang mereka dustakan itu) adalah Al-Quran yang mulia' },
      { number: 22, arabic: 'فِي لَوْحٍ مَّحْفُوظٍ', translation: 'Yang (tersimpan) dalam Lauh Mahfuz' }
    ]
  },
  {
    number: 84,
    name: 'Al-Inshiqaq',
    arabicName: 'الانْشِقَاق',
    verses: [
      { number: 1, arabic: 'إِذَا السَّمَاءُ انشَقَّتْ', translation: 'Apabila langit terbelah' },
      { number: 2, arabic: 'وَأَذِنَتْ لِرَبِّهَا وَحُقَّتْ', translation: 'Dan patuh kepada Tuhannya, dan sudah semestinya langit itu patuh' },
      { number: 3, arabic: 'وَإِذَا الْأَرْضُ مُدَّتْ', translation: 'Dan apabila bumi diratakan' },
      { number: 4, arabic: 'وَأَلْقَتْ مَا فِيهَا وَتَخَلَّتْ', translation: 'Dan memuntahkan apa yang ada di dalamnya dan menjadi kosong' },
      { number: 5, arabic: 'وَأَذِنَتْ لِرَبِّهَا وَحُقَّتْ', translation: 'Dan patuh kepada Tuhannya, dan sudah semestinya bumi itu patuh' },
      { number: 6, arabic: 'يَا أَيُّهَا الْإِنسَانُ إِنَّكَ كَادِحٌ إِلَىٰ رَبِّكَ كَدْحًا فَمُلَاقِيهِ', translation: 'Wahai manusia! Sungguh, kamu telah bekerja keras menuju Tuhanmu, maka kamu akan menemui-Nya' },
      { number: 7, arabic: 'فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِيَمِينِهِ', translation: 'Adapun orang yang catatan (amal)nya diberikan dari sebelah kanannya' },
      { number: 8, arabic: 'فَسَوْفَ يُحَاسَبُ حِسَابًا يَسِيرًا', translation: 'Maka dia akan diperiksa dengan pemeriksaan yang mudah' },
      { number: 9, arabic: 'وَيَنقَلِبُ إِلَىٰ أَهْلِهِ مَسْرُورًا', translation: 'Dan dia akan kembali kepada kaumnya (di surga) dengan gembira' },
      { number: 10, arabic: 'وَأَمَّا مَنْ أُوتِيَ كِتَابَهُ وَرَاءَ ظَهْرِهِ', translation: 'Dan adapun orang yang catatan (amal)nya diberikan dari belakang punggungnya' },
      { number: 11, arabic: 'فَسَوْفَ يَدْعُو ثُبُورًا', translation: 'Maka dia akan berteriak, "Celakalah aku!"' },
      { number: 12, arabic: 'وَيَصْلَىٰ سَعِيرًا', translation: 'Dan dia akan masuk ke dalam api yang menyala-nyala (neraka)' },
      { number: 13, arabic: 'إِنَّهُ كَانَ فِي أَهْلِهِ مَسْرُورًا', translation: 'Sungguh, dahulu dia (di dunia) bergembira bersama kaumnya' },
      { number: 14, arabic: 'إِنَّهُ ظَنَّ أَن لَّن يَحُورَ', translation: 'Sesungguhnya dia mengira bahwa dia tidak akan kembali (kepada Tuhannya)' },
      { number: 15, arabic: 'بَلَىٰ إِنَّ رَبَّهُ كَانَ بِهِ بَصِيرًا', translation: 'Tidak demikian, sungguh, Tuhannya Maha Melihat keadaannya' },
      { number: 16, arabic: 'فَلَا أُقْسِمُ بِالشَّفَقِ', translation: 'Aku bersumpah demi cahaya merah di waktu senja' },
      { number: 17, arabic: 'وَاللَّيْلِ وَمَا وَسَقَ', translation: 'Dan demi malam dan apa yang diselubunginya' },
      { number: 18, arabic: 'وَالْقَمَرِ إِذَا اتَّسَقَ', translation: 'Dan demi bulan apabila jadi purnama' },
      { number: 19, arabic: 'لَتَرْكَبُنَّ طَبَقًا عَن طَبَقٍ', translation: 'Sungguh, kamu pasti akan melewati tingkat demi tingkat' },
      { number: 20, arabic: 'فَمَا لَهُمْ لَا يُؤْمِنُونَ', translation: 'Mengapa mereka tidak beriman?' },
      { number: 21, arabic: 'وَإِذَا قُرِئَ عَلَيْهِمُ الْقُرْآنُ لَا يَسْجُدُونَ ۩', translation: 'Dan apabila Al-Quran dibacakan kepada mereka, mereka tidak (mau) bersujud' },
      { number: 22, arabic: 'بَلِ الَّذِينَ كَفَرُوا يُكَذِّبُونَ', translation: 'Bahkan orang-orang kafir itu mendustakan(nya)' },
      { number: 23, arabic: 'وَاللَّهُ أَعْلَمُ بِمَا يُوعُونَ', translation: 'Dan Allah lebih mengetahui apa yang mereka simpan (dalam hati mereka)' },
      { number: 24, arabic: 'فَبَشِّرْهُم بِعَذَابٍ أَلِيمٍ', translation: 'Maka gembirakanlah mereka dengan azab yang pedih' },
      { number: 25, arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ', translation: 'Kecuali orang-orang yang beriman dan mengerjakan kebajikan, mereka akan mendapat pahala yang tidak putus-putusnya' }
    ]
  },
  {
    number: 83,
    name: 'Al-Mutaffifin',
    arabicName: 'الْمُطَفِّفِين',
    verses: [
      { number: 1, arabic: 'وَيْلٌ لِّلْمُطَفِّفِينَ', translation: 'Celakalah bagi orang-orang yang curang' },
      { number: 2, arabic: 'الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ', translation: 'Yaitu orang-orang yang apabila menerima takaran dari orang lain mereka minta dicukupkan' },
      { number: 3, arabic: 'وَإِذَا كَالُوهُمْ أَو وَّزَنُوهُمْ يُخْسِرُونَ', translation: 'Dan apabila mereka menakar atau menimbang (untuk orang lain), mereka mengurangi' },
      { number: 4, arabic: 'أَلَا يَظُنُّ أُولَٰئِكَ أَنَّهُم مَّبْعُوثُونَ', translation: 'Tidakkah mereka itu mengira, bahwa mereka akan dibangkitkan' },
      { number: 5, arabic: 'لِيَوْمٍ عَظِيمٍ', translation: 'Pada hari yang besar' },
      { number: 6, arabic: 'يَوْمَ يَقُومُ النَّاسُ لِرَبِّ الْعَالَمِينَ', translation: 'Yaitu pada hari ketika semua manusia berdiri di hadapan Tuhan seluruh alam?' },
      { number: 7, arabic: 'كَلَّا إِنَّ كِتَابَ الْفُجَّارِ لَفِي سِجِّينٍ', translation: 'Sekali-kali tidak! Sungguh, catatan (amal) orang yang durhaka benar-benar tersimpan dalam Sijjin' },
      { number: 8, arabic: 'وَمَا أَدْرَاكَ مَا سِجِّينٌ', translation: 'Dan tahukah kamu apakah Sijjin itu?' },
      { number: 9, arabic: 'كِتَابٌ مَّرْقُومٌ', translation: 'Yaitu kitab yang berisi catatan (amal)' },
      { number: 10, arabic: 'وَيْلٌ يَوْمَئِذٍ لِّلْمُكَذِّبِينَ', translation: 'Celakalah pada hari itu bagi orang-orang yang mendustakan' },
      { number: 11, arabic: 'الَّذِينَ يُكَذِّبُونَ بِيَوْمِ الدِّينِ', translation: 'Yaitu orang-orang yang mendustakan hari pembalasan' },
      { number: 12, arabic: 'وَمَا يُكَذِّبُ بِهِ إِلَّا كُلُّ مُعْتَدٍ أَثِيمٍ', translation: 'Dan tidak ada yang mendustakannya kecuali setiap orang yang melampaui batas lagi berdosa' },
      { number: 13, arabic: 'إِذَا تُتْلَىٰ عَلَيْهِ آيَاتُنَا قَالَ أَسَاطِيرُ الْأَوَّلِينَ', translation: 'Apabila dibacakan kepadanya ayat-ayat Kami, dia berkata, "(Ini adalah) dongeng orang-orang dahulu"' },
      { number: 14, arabic: 'كَلَّا ۖ بَلْ ۜ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا يَكْسِبُونَ', translation: 'Sekali-kali tidak, sebenarnya apa yang mereka kerjakan itu menutupi hati mereka' },
      { number: 15, arabic: 'كَلَّا إِنَّهُمْ عَن رَّبِّهِمْ يَوْمَئِذٍ لَّمَحْجُوبُونَ', translation: 'Sekali-kali tidak, sesungguhnya mereka pada hari itu benar-benar terhalang dari (melihat) Tuhan mereka' },
      { number: 16, arabic: 'ثُمَّ إِنَّهُمْ لَصَالُو الْجَحِيمِ', translation: 'Kemudian sungguh, mereka benar-benar akan masuk neraka' },
      { number: 17, arabic: 'ثُمَّ يُقَالُ هَٰذَا الَّذِي كُنتُم بِهِ تُكَذِّبُونَ', translation: 'Kemudian dikatakan (kepada mereka), "Inilah (azab) yang dahulu kamu mendustakannya"' },
      { number: 18, arabic: 'كَلَّا إِنَّ كِتَابَ الْأَبْرَارِ لَفِي عِلِّيِّينَ', translation: 'Sekali-kali tidak! Sungguh, catatan (amal) orang yang berbuat kebajikan benar-benar tersimpan dalam \'Illiyyin' },
      { number: 19, arabic: 'وَمَا أَدْرَاكَ مَا عِلِّيُّونَ', translation: 'Dan tahukah kamu apakah \'Illiyyin itu?' },
      { number: 20, arabic: 'كِتَابٌ مَّرْقُومٌ', translation: 'Yaitu kitab yang berisi catatan (amal)' },
      { number: 21, arabic: 'يَشْهَدُهُ الْمُقَرَّبُونَ', translation: 'Yang disaksikan oleh (malaikat-malaikat) yang didekatkan (kepada Allah)' },
      { number: 22, arabic: 'إِنَّ الْأَبْرَارَ لَفِي نَعِيمٍ', translation: 'Sungguh, orang-orang yang berbuat kebajikan benar-benar berada dalam (surga yang penuh) kenikmatan' },
      { number: 23, arabic: 'عَلَى الْأَرَائِكِ يَنظُرُونَ', translation: 'Di atas dipan-dipan mereka memandang' },
      { number: 24, arabic: 'تَعْرِفُ فِي وُجُوهِهِمْ نَضْرَةَ النَّعِيمِ', translation: 'Kamu dapat mengetahui dari wajah mereka kesenangan hidup yang penuh kenikmatan' },
      { number: 25, arabic: 'يُسْقَوْنَ مِن رَّحِيقٍ مَّخْتُومٍ', translation: 'Mereka diberi minum dari khamar murni (tidak bercampur) yang (tempatnya) masih dilak (disegel)' },
      { number: 26, arabic: 'خِتَامُهُ مِسْكٌ ۚ وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ', translation: 'Laknya adalah kesturi; dan untuk yang demikian itu hendaknya orang berlomba-lomba' },
      { number: 27, arabic: 'وَمِزَاجُهُ مِن تَسْنِيمٍ', translation: 'Dan campurannya dari Tasnim' },
      { number: 28, arabic: 'عَيْنًا يَشْرَبُ بِهَا الْمُقَرَّبُونَ', translation: 'Yaitu mata air yang diminum oleh orang-orang yang didekatkan (kepada Allah)' },
      { number: 29, arabic: 'إِنَّ الَّذِينَ أَجْرَمُوا كَانُوا مِنَ الَّذِينَ آمَنُوا يَضْحَكُونَ', translation: 'Sesungguhnya orang-orang yang berdosa, dahulu (di dunia) adalah mereka yang menertawakan orang-orang yang beriman' },
      { number: 30, arabic: 'وَإِذَا مَرُّوا بِهِمْ يَتَغَامَزُونَ', translation: 'Dan apabila mereka (orang-orang yang beriman) melewati mereka, mereka saling mengedipkan mata (secara mengejek)' },
      { number: 31, arabic: 'وَإِذَا انقَلَبُوا إِلَىٰ أَهْلِهِمُ انقَلَبُوا فَكِهِينَ', translation: 'Dan apabila mereka kembali kepada kaumnya, mereka kembali dengan gembira' },
      { number: 32, arabic: 'وَإِذَا رَأَوْهُمْ قَالُوا إِنَّ هَٰؤُلَاءِ لَضَالُّونَ', translation: 'Dan apabila mereka (orang-orang kafir) melihat mereka (orang-orang mukmin), mereka mengatakan, "Sungguh, mereka itu benar-benar orang-orang yang sesat"' },
      { number: 33, arabic: 'وَمَا أُرْسِلُوا عَلَيْهِمْ حَافِظِينَ', translation: 'Padahal mereka (orang-orang kafir) tidak dikirim sebagai penjaga bagi mereka (orang-orang mukmin)' },
      { number: 34, arabic: 'فَالْيَوْمَ الَّذِينَ آمَنُوا مِنَ الْكُفَّارِ يَضْحَكُونَ', translation: 'Maka pada hari ini orang-orang yang beriman menertawakan orang-orang kafir' },
      { number: 35, arabic: 'عَلَى الْأَرَائِكِ يَنظُرُونَ', translation: 'Di atas dipan-dipan mereka memandang' },
      { number: 36, arabic: 'هَلْ ثُوِّبَ الْكُفَّارُ مَا كَانُوا يَفْعَلُونَ', translation: 'Apakah (belum) dibalas orang-orang kafir terhadap apa yang telah mereka kerjakan?' }
    ]
  },
  {
    number: 82,
    name: 'Al-Infitar',
    arabicName: 'الانْفِطَار',
    verses: [
      { number: 1, arabic: 'إِذَا السَّمَاءُ انفَطَرَتْ', translation: 'Apabila langit terbelah' },
      { number: 2, arabic: 'وَإِذَا الْكَوَاكِبُ انتَثَرَتْ', translation: 'Dan apabila bintang-bintang berjatuhan' },
      { number: 3, arabic: 'وَإِذَا الْبِحَارُ فُجِّرَتْ', translation: 'Dan apabila lautan dijadikan meluap' },
      { number: 4, arabic: 'وَإِذَا الْقُبُورُ بُعْثِرَتْ', translation: 'Dan apabila kuburan-kuburan dibongkar' },
      { number: 5, arabic: 'عَلِمَتْ نَفْسٌ مَّا قَدَّمَتْ وَأَخَّرَتْ', translation: 'Setiap orang mengetahui apa yang telah dikerjakannya dan yang dilalaikannya' },
      { number: 6, arabic: 'يَا أَيُّهَا الْإِنسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ', translation: 'Wahai manusia! Apakah yang telah memperdayakan kamu (berbuat durhaka) terhadap Tuhanmu Yang Mahamulia' },
      { number: 7, arabic: 'الَّذِي خَلَقَكَ فَسَوَّاكَ فَعَدَلَكَ', translation: 'Yang telah menciptakan kamu lalu menyempurnakan kejadianmu dan menjadikan (susunan tubuh)mu seimbang' },
      { number: 8, arabic: 'فِي أَيِّ صُورَةٍ مَّا شَاءَ رَكَّبَكَ', translation: 'Dalam bentuk apa pun Dia kehendaki, Dia menyusun tubuhmu' },
      { number: 9, arabic: 'كَلَّا بَلْ تُكَذِّبُونَ بِالدِّينِ', translation: 'Sekali-kali tidak (begitu yang kamu katakan), sebenarnya kamu mendustakan (hari) pembalasan' },
      { number: 10, arabic: 'وَإِنَّ عَلَيْكُمْ لَحَافِظِينَ', translation: 'Padahal sesungguhnya bagi kamu ada (malaikat-malaikat) penjaga' },
      { number: 11, arabic: 'كِرَامًا كَاتِبِينَ', translation: 'Yang mulia di sisi Allah dan yang mencatat (pekerjaan-pekerjaanmu)' },
      { number: 12, arabic: 'يَعْلَمُونَ مَا تَفْعَلُونَ', translation: 'Mereka mengetahui apa yang kamu kerjakan' },
      { number: 13, arabic: 'إِنَّ الْأَبْرَارَ لَفِي نَعِيمٍ', translation: 'Sungguh, orang-orang yang berbuat kebajikan benar-benar berada dalam (surga yang penuh) kenikmatan' },
      { number: 14, arabic: 'وَإِنَّ الْفُجَّارَ لَفِي جَحِيمٍ', translation: 'Dan sungguh, orang-orang yang durhaka benar-benar berada dalam neraka' },
      { number: 15, arabic: 'يَصْلَوْنَهَا يَوْمَ الدِّينِ', translation: 'Mereka masuk ke dalamnya pada hari pembalasan' },
      { number: 16, arabic: 'وَمَا هُمْ عَنْهَا بِغَائِبِينَ', translation: 'Dan mereka tidak akan (dapat) bersembunyi darinya' },
      { number: 17, arabic: 'وَمَا أَدْرَاكَ مَا يَوْمُ الدِّينِ', translation: 'Dan tahukah kamu apakah hari pembalasan itu?' },
      { number: 18, arabic: 'ثُمَّ مَا أَدْرَاكَ مَا يَوْمُ الدِّينِ', translation: 'Sekali lagi, tahukah kamu apakah hari pembalasan itu?' },
      { number: 19, arabic: 'يَوْمَ لَا تَمْلِكُ نَفْسٌ لِّنَفْسٍ شَيْئًا ۖ وَالْأَمْرُ يَوْمَئِذٍ لِّلَّهِ', translation: 'Yaitu pada hari (ketika) seseorang tidak berdaya sedikit pun untuk menolong orang lain. Dan segala urusan pada hari itu (dalam kekuasaan) Allah' }
    ]
  },
  {
    number: 81,
    name: 'At-Takwir',
    arabicName: 'التَّكْوِير',
    verses: [
      { number: 1, arabic: 'إِذَا الشَّمْسُ كُوِّرَتْ', translation: 'Apabila matahari digulung' },
      { number: 2, arabic: 'وَإِذَا النُّجُومُ انكَدَرَتْ', translation: 'Dan apabila bintang-bintang berjatuhan' },
      { number: 3, arabic: 'وَإِذَا الْجِبَالُ سُيِّرَتْ', translation: 'Dan apabila gunung-gunung dihancurkan' },
      { number: 4, arabic: 'وَإِذَا الْعِشَارُ عُطِّلَتْ', translation: 'Dan apabila unta-unta bunting ditinggalkan (tidak dipelihara)' },
      { number: 5, arabic: 'وَإِذَا الْوُحُوشُ حُشِرَتْ', translation: 'Dan apabila binatang-binatang liar dikumpulkan' },
      { number: 6, arabic: 'وَإِذَا الْبِحَارُ سُجِّرَتْ', translation: 'Dan apabila lautan dijadikan meluap' },
      { number: 7, arabic: 'وَإِذَا النُّفُوسُ زُوِّجَتْ', translation: 'Dan apabila roh-roh dipertemukan (dengan tubuhnya)' },
      { number: 8, arabic: 'وَإِذَا الْمَوْءُودَةُ سُئِلَتْ', translation: 'Dan apabila bayi-bayi perempuan yang dikubur hidup-hidup ditanyai' },
      { number: 9, arabic: 'بِأَيِّ ذَنبٍ قُتِلَتْ', translation: 'Karena dosa apakah dia dibunuh?' },
      { number: 10, arabic: 'وَإِذَا الصُّحُفُ نُشِرَتْ', translation: 'Dan apabila catatan-catatan (amal) dibuka' },
      { number: 11, arabic: 'وَإِذَا السَّمَاءُ كُشِطَتْ', translation: 'Dan apabila langit dilenyapkan' },
      { number: 12, arabic: 'وَإِذَا الْجَحِيمُ سُعِّرَتْ', translation: 'Dan apabila neraka Jahim dinyalakan' },
      { number: 13, arabic: 'وَإِذَا الْجَنَّةُ أُزْلِفَتْ', translation: 'Dan apabila surga didekatkan' },
      { number: 14, arabic: 'عَلِمَتْ نَفْسٌ مَّا أَحْضَرَتْ', translation: 'Setiap orang akan mengetahui apa yang telah diperbuatnya' },
      { number: 15, arabic: 'فَلَا أُقْسِمُ بِالْخُنَّسِ', translation: 'Aku bersumpah demi bintang yang beredar' },
      { number: 16, arabic: 'الْجَوَارِ الْكُنَّسِ', translation: 'Yang terbit dan terbenam' },
      { number: 17, arabic: 'وَاللَّيْلِ إِذَا عَسْعَسَ', translation: 'Dan demi malam apabila telah hampir meninggalkan gelapnya' },
      { number: 18, arabic: 'وَالصُّبْحِ إِذَا تَنَفَّسَ', translation: 'Dan demi subuh apabila fajarnya mulai menyingsing' },
      { number: 19, arabic: 'إِنَّهُ لَقَوْلُ رَسُولٍ كَرِيمٍ', translation: 'Sungguh, (Al-Quran) ini benar-benar firman (Allah yang dibawa oleh) utusan yang mulia (Jibril)' },
      { number: 20, arabic: 'ذِي قُوَّةٍ عِندَ ذِي الْعَرْشِ مَكِينٍ', translation: 'Yang mempunyai kekuatan, yang mempunyai kedudukan tinggi di sisi (Allah) yang mempunyai \'Arsy' },
      { number: 21, arabic: 'مُّطَاعٍ ثَمَّ أَمِينٍ', translation: 'Yang ditaati di sana (di alam malaikat) lagi dipercaya' },
      { number: 22, arabic: 'وَمَا صَاحِبُكُم بِمَجْنُونٍ', translation: 'Dan temanmu (Muhammad) bukanlah orang gila' },
      { number: 23, arabic: 'وَلَقَدْ رَآهُ بِالْأُفُقِ الْمُبِينِ', translation: 'Dan sungguh, Muhammad telah melihat (Jibril itu) di ufuk yang terang' },
      { number: 24, arabic: 'وَمَا هُوَ عَلَى الْغَيْبِ بِضَنِينٍ', translation: 'Dan dia (Muhammad) tidak kikir untuk menerangkan yang gaib' },
      { number: 25, arabic: 'وَمَا هُوَ بِقَوْلِ شَيْطَانٍ رَّجِيمٍ', translation: 'Dan (Al-Quran) itu bukanlah perkataan setan yang terkutuk' },
      { number: 26, arabic: 'فَأَيْنَ تَذْهَبُونَ', translation: 'Maka ke manakah kamu akan pergi?' },
      { number: 27, arabic: 'إِنْ هُوَ إِلَّا ذِكْرٌ لِّلْعَالَمِينَ', translation: '(Al-Quran) itu tidak lain hanyalah peringatan bagi seluruh alam' },
      { number: 28, arabic: 'لِمَن شَاءَ مِنكُمْ أَن يَسْتَقِيمَ', translation: 'Yaitu bagi siapa di antara kamu yang mau menempuh jalan yang lurus' },
      { number: 29, arabic: 'وَمَا تَشَاءُونَ إِلَّا أَن يَشَاءَ اللَّهُ رَبُّ الْعَالَمِينَ', translation: 'Dan kamu tidak mampu (menempuh jalan itu), kecuali apabila dikehendaki Allah, Tuhan seluruh alam' }
    ]
  },
  {
    number: 80,
    name: 'Abasa',
    arabicName: 'عَبَسَ',
    verses: [
      { number: 1, arabic: 'عَبَسَ وَتَوَلَّىٰ', translation: '(Muhammad) bermuka masam dan berpaling' },
      { number: 2, arabic: 'أَن جَاءَهُ الْأَعْمَىٰ', translation: 'Karena seorang buta datang kepadanya' },
      { number: 3, arabic: 'وَمَا يُدْرِيكَ لَعَلَّهُ يَزَّكَّىٰ', translation: 'Dan tahukah engkau (Muhammad) boleh jadi dia ingin menyucikan dirinya (dari dosa)' },
      { number: 4, arabic: 'أَوْ يَذَّكَّرُ فَتَنفَعَهُ الذِّكْرَىٰ', translation: 'Atau dia (ingin) mendapatkan pengajaran, yang memberi manfaat kepadanya?' },
      { number: 5, arabic: 'أَمَّا مَنِ اسْتَغْنَىٰ', translation: 'Adapun orang yang merasa dirinya serba cukup' },
      { number: 6, arabic: 'فَأَنتَ لَهُ تَصَدَّىٰ', translation: 'Maka engkau memberi perhatian kepadanya' },
      { number: 7, arabic: 'وَمَا عَلَيْكَ أَلَّا يَزَّكَّىٰ', translation: 'Padahal tidak ada (celaan) atasmu kalau dia tidak menyucikan diri (beriman)' },
      { number: 8, arabic: 'وَأَمَّا مَن جَاءَكَ يَسْعَىٰ', translation: 'Dan adapun orang yang datang kepadamu dengan bersegera (untuk mendapatkan pengajaran)' },
      { number: 9, arabic: 'وَهُوَ يَخْشَىٰ', translation: 'Sedang dia takut (kepada Allah)' },
      { number: 10, arabic: 'فَأَنتَ عَنْهُ تَلَهَّىٰ', translation: 'Maka engkau mengabaikannya' },
      { number: 11, arabic: 'كَلَّا إِنَّهَا تَذْكِرَةٌ', translation: 'Sekali-kali jangan (begitu)! Sungguh, (Al-Quran) itu adalah peringatan' },
      { number: 12, arabic: 'فَمَن شَاءَ ذَكَرَهُ', translation: 'Maka barangsiapa menghendaki, tentulah dia memperhatikannya' },
      { number: 13, arabic: 'فِي صُحُفٍ مُّكَرَّمَةٍ', translation: 'Di dalam kitab-kitab yang dimuliakan' },
      { number: 14, arabic: 'مَّرْفُوعَةٍ مُّطَهَّرَةٍ', translation: 'Yang ditinggikan lagi disucikan' },
      { number: 15, arabic: 'بِأَيْدِي سَفَرَةٍ', translation: '(Ditulis) oleh para penulis (malaikat)' },
      { number: 16, arabic: 'كِرَامٍ بَرَرَةٍ', translation: 'Yang mulia dan berbakti' },
      { number: 17, arabic: 'قُتِلَ الْإِنسَانُ مَا أَكْفَرَهُ', translation: 'Binasalah manusia! Alangkah kufurnya dia!' },
      { number: 18, arabic: 'مِنْ أَيِّ شَيْءٍ خَلَقَهُ', translation: 'Dari apakah (Allah) menciptakannya?' },
      { number: 19, arabic: 'مِن نُّطْفَةٍ خَلَقَهُ فَقَدَّرَهُ', translation: 'Dari setetes mani, Dia menciptakannya lalu menentukannya' },
      { number: 20, arabic: 'ثُمَّ السَّبِيلَ يَسَّرَهُ', translation: 'Kemudian jalannya Dia mudahkan' },
      { number: 21, arabic: 'ثُمَّ أَمَاتَهُ فَأَقْبَرَهُ', translation: 'Kemudian Dia mematikannya dan memasukkannya ke dalam kubur' },
      { number: 22, arabic: 'ثُمَّ إِذَا شَاءَ أَنشَرَهُ', translation: 'Kemudian apabila Dia menghendaki, Dia membangkitkannya kembali' },
      { number: 23, arabic: 'كَلَّا لَمَّا يَقْضِ مَا أَمَرَهُ', translation: 'Sekali-kali jangan! Manusia itu belum melaksanakan apa yang diperintahkan (Allah) kepadanya' },
      { number: 24, arabic: 'فَلْيَنظُرِ الْإِنسَانُ إِلَىٰ طَعَامِهِ', translation: 'Maka hendaklah manusia itu memperhatikan makanannya' },
      { number: 25, arabic: 'أَنَّا صَبَبْنَا الْمَاءَ صَبًّا', translation: 'Sesungguhnya Kami benar-benar telah mencurahkan air (dari langit)' },
      { number: 26, arabic: 'ثُمَّ شَقَقْنَا الْأَرْضَ شَقًّا', translation: 'Kemudian Kami belah bumi dengan sebaik-baiknya' },
      { number: 27, arabic: 'فَأَنبَتْنَا فِيهَا حَبًّا', translation: 'Lalu Kami tumbuhkan di (bumi) itu biji-bijian' },
      { number: 28, arabic: 'وَعِنَبًا وَقَضْبًا', translation: 'Dan anggur serta sayur-sayuran' },
      { number: 29, arabic: 'وَزَيْتُونًا وَنَخْلًا', translation: 'Dan zaitun serta kurma' },
      { number: 30, arabic: 'وَحَدَائِقَ غُلْبًا', translation: 'Dan kebun-kebun (yang) lebat' },
      { number: 31, arabic: 'وَفَاكِهَةً وَأَبًّا', translation: 'Dan buah-buahan serta rerumputan' },
      { number: 32, arabic: 'مَّتَاعًا لَّكُمْ وَلِأَنْعَامِكُمْ', translation: 'Untuk kesenanganmu dan untuk hewan ternakmu' },
      { number: 33, arabic: 'فَإِذَا جَاءَتِ الصَّاخَّةُ', translation: 'Maka apabila datang suara yang memekakkan (tiupan sangkakala yang kedua)' },
      { number: 34, arabic: 'يَوْمَ يَفِرُّ الْمَرْءُ مِنْ أَخِيهِ', translation: 'Pada hari ketika manusia lari dari saudaranya' },
      { number: 35, arabic: 'وَأُمِّهِ وَأَبِيهِ', translation: 'Dari ibu dan bapaknya' },
      { number: 36, arabic: 'وَصَاحِبَتِهِ وَبَنِيهِ', translation: 'Dari istri dan anak-anaknya' },
      { number: 37, arabic: 'لِكُلِّ امْرِئٍ مِّنْهُمْ يَوْمَئِذٍ شَأْنٌ يُغْنِيهِ', translation: 'Setiap orang dari mereka pada hari itu mempunyai urusan yang menyibukkannya' },
      { number: 38, arabic: 'وُجُوهٌ يَوْمَئِذٍ مُّسْفِرَةٌ', translation: 'Banyak wajah pada hari itu berseri-seri' },
      { number: 39, arabic: 'ضَاحِكَةٌ مُّسْتَبْشِرَةٌ', translation: 'Tertawa dan gembira ria' },
      { number: 40, arabic: 'وَوُجُوهٌ يَوْمَئِذٍ عَلَيْهَا غَبَرَةٌ', translation: 'Dan banyak (pula) wajah pada hari itu tertutup debu' },
      { number: 41, arabic: 'تَرْهَقُهَا قَتَرَةٌ', translation: 'Diliputi oleh kegelapan' },
      { number: 42, arabic: 'أُولَٰئِكَ هُمُ الْكَفَرَةُ الْفَجَرَةُ', translation: 'Mereka itulah orang-orang yang kafir lagi durhaka' }
    ]
  },
  {
    number: 79,
    name: "An-Nazi'at",
    arabicName: 'النَّازِعَات',
    verses: [
      { number: 1, arabic: 'وَالنَّازِعَاتِ غَرْقًا', translation: 'Demi (malaikat-malaikat) yang mencabut (roh) dengan keras' },
      { number: 2, arabic: 'وَالنَّاشِطَاتِ نَشْطًا', translation: 'Dan (malaikat-malaikat) yang mencabut (roh) dengan lemah lembut' },
      { number: 3, arabic: 'وَالسَّابِحَاتِ سَبْحًا', translation: 'Dan (malaikat-malaikat) yang turun dari langit dengan cepat' },
      { number: 4, arabic: 'فَالسَّابِقَاتِ سَبْقًا', translation: 'Dan (malaikat-malaikat) yang mendahului dengan kencang' },
      { number: 5, arabic: 'فَالْمُدَبِّرَاتِ أَمْرًا', translation: 'Dan (malaikat-malaikat) yang mengatur urusan (dunia)' },
      { number: 6, arabic: 'يَوْمَ تَرْجُفُ الرَّاجِفَةُ', translation: 'Pada hari ketika tiupan pertama menggoncangkan alam' },
      { number: 7, arabic: 'تَتْبَعُهَا الرَّادِفَةُ', translation: 'Tiupan kedua mengikutinya' },
      { number: 8, arabic: 'قُلُوبٌ يَوْمَئِذٍ وَاجِفَةٌ', translation: 'Hati manusia pada waktu itu sangat takut' },
      { number: 9, arabic: 'أَبْصَارُهَا خَاشِعَةٌ', translation: 'Pandangannya tertunduk' },
      { number: 10, arabic: 'يَقُولُونَ أَإِنَّا لَمَرْدُودُونَ فِي الْحَافِرَةِ', translation: 'Mereka berkata, "Apakah kami benar-benar dikembalikan kepada kehidupan semula?' },
      { number: 11, arabic: 'أَإِذَا كُنَّا عِظَامًا نَّخِرَةً', translation: 'Apakah (akan dibangkitkan juga) apabila kami telah menjadi tulang belulang yang hancur lumat?"' },
      { number: 12, arabic: 'قَالُوا تِلْكَ إِذًا كَرَّةٌ خَاسِرَةٌ', translation: 'Mereka berkata, "Kalau demikian, itu adalah suatu pengembalian yang merugikan"' },
      { number: 13, arabic: 'فَإِنَّمَا هِيَ زَجْرَةٌ وَاحِدَةٌ', translation: 'Sesungguhnya pengembalian itu hanyalah dengan satu kali tiupan saja' },
      { number: 14, arabic: 'فَإِذَا هُم بِالسَّاهِرَةِ', translation: 'Maka tiba-tiba mereka hidup kembali di permukaan bumi' },
      { number: 15, arabic: 'هَلْ أَتَاكَ حَدِيثُ مُوسَىٰ', translation: 'Sudahkah sampai kepadamu (Muhammad) kisah Musa?' },
      { number: 16, arabic: 'إِذْ نَادَاهُ رَبُّهُ بِالْوَادِ الْمُقَدَّسِ طُوًى', translation: 'Ketika Tuhannya memanggilnya di lembah suci, Tuwa' },
      { number: 17, arabic: 'اذْهَبْ إِلَىٰ فِرْعَوْنَ إِنَّهُ طَغَىٰ', translation: '"Pergilah kepada Fir\'aun, sungguh, dia telah melampaui batas"' },
      { number: 18, arabic: 'فَقُلْ هَل لَّكَ إِلَىٰ أَن تَزَكَّىٰ', translation: 'Dan katakanlah (kepada Fir\'aun), "Apakah engkau ingin membersihkan diri (dari kesesatan)?"' },
      { number: 19, arabic: 'وَأَهْدِيَكَ إِلَىٰ رَبِّكَ فَتَخْشَىٰ', translation: '"Dan kamu akan kupimpin ke jalan Tuhanmu agar engkau takut kepada-Nya?"' },
      { number: 20, arabic: 'فَأَرَاهُ الْآيَةَ الْكُبْرَىٰ', translation: 'Kemudian dia (Musa) memperlihatkan kepadanya mukjizat yang besar' },
      { number: 21, arabic: 'فَكَذَّبَ وَعَصَىٰ', translation: 'Tetapi dia (Fir\'aun) mendustakan dan mendurhakai' },
      { number: 22, arabic: 'ثُمَّ أَدْبَرَ يَسْعَىٰ', translation: 'Kemudian dia berpaling seraya berusaha menantang' },
      { number: 23, arabic: 'فَحَشَرَ فَنَادَىٰ', translation: 'Lalu dia mengumpulkan (pembesar-pembesarnya) dan berseru' },
      { number: 24, arabic: 'فَقَالَ أَنَا رَبُّكُمُ الْأَعْلَىٰ', translation: 'Maka dia berkata, "Akulah tuhanmu yang paling tinggi"' },
      { number: 25, arabic: 'فَأَخَذَهُ اللَّهُ نَكَالَ الْآخِرَةِ وَالْأُولَىٰ', translation: 'Maka Allah mengazabnya dengan azab di akhirat dan azab di dunia' },
      { number: 26, arabic: 'إِنَّ فِي ذَٰلِكَ لَعِبْرَةً لِّمَن يَخْشَىٰ', translation: 'Sungguh, pada yang demikian itu terdapat pelajaran bagi orang yang takut (kepada Allah)' },
      { number: 27, arabic: 'أَأَنتُمْ أَشَدُّ خَلْقًا أَمِ السَّمَاءُ ۚ بَنَاهَا', translation: 'Apakah kamu yang lebih sulit penciptaannya ataukah langit? (Allah) telah membangunnya' },
      { number: 28, arabic: 'رَفَعَ سَمْكَهَا فَسَوَّاهَا', translation: 'Dia meninggikan bangunannya lalu menyempurnakannya' },
      { number: 29, arabic: 'وَأَغْطَشَ لَيْلَهَا وَأَخْرَجَ ضُحَاهَا', translation: 'Dan Dia menjadikan malamnya gelap gulita, dan menampakkan siangnya' },
      { number: 30, arabic: 'وَالْأَرْضَ بَعْدَ ذَٰلِكَ دَحَاهَا', translation: 'Dan bumi setelah itu dihamparkan-Nya' },
      { number: 31, arabic: 'أَخْرَجَ مِنْهَا مَاءَهَا وَمَرْعَاهَا', translation: 'Dia mengeluarkan dari (bumi) itu mata airnya, dan (menumbuhkan) tumbuh-tumbuhannya' },
      { number: 32, arabic: 'وَالْجِبَالَ أَرْسَاهَا', translation: 'Dan gunung-gunung dipancangkan-Nya dengan teguh' },
      { number: 33, arabic: 'مَتَاعًا لَّكُمْ وَلِأَنْعَامِكُمْ', translation: 'Untuk kesenanganmu dan untuk hewan ternakmu' },
      { number: 34, arabic: 'فَإِذَا جَاءَتِ الطَّامَّةُ الْكُبْرَىٰ', translation: 'Maka apabila datang malapetaka yang besar (hari Kiamat)' },
      { number: 35, arabic: 'يَوْمَ يَتَذَكَّرُ الْإِنسَانُ مَا سَعَىٰ', translation: 'Pada hari (ketika) manusia teringat akan apa yang telah dikerjakannya' },
      { number: 36, arabic: 'وَبُرِّزَتِ الْجَحِيمُ لِمَن يَرَىٰ', translation: 'Dan diperlihatkan dengan jelas neraka Jahim kepada setiap orang yang melihat' },
      { number: 37, arabic: 'فَأَمَّا مَن طَغَىٰ', translation: 'Maka adapun orang yang melampaui batas' },
      { number: 38, arabic: 'وَآثَرَ الْحَيَاةَ الدُّنْيَا', translation: 'Dan lebih mengutamakan kehidupan dunia' },
      { number: 39, arabic: 'فَإِنَّ الْجَحِيمَ هِيَ الْمَأْوَىٰ', translation: 'Maka sungguh, nerakalah tempat tinggal(nya)' },
      { number: 40, arabic: 'وَأَمَّا مَنْ خَافَ مَقَامَ رَبِّهِ وَنَهَى النَّفْسَ عَنِ الْهَوَىٰ', translation: 'Dan adapun orang yang takut kepada kebesaran Tuhannya dan menahan diri dari (keinginan) hawa nafsunya' },
      { number: 41, arabic: 'فَإِنَّ الْجَنَّةَ هِيَ الْمَأْوَىٰ', translation: 'Maka sungguh, surgalah tempat tinggal(nya)' },
      { number: 42, arabic: 'يَسْأَلُونَكَ عَنِ السَّاعَةِ أَيَّانَ مُرْسَاهَا', translation: 'Mereka bertanya kepadamu (Muhammad) tentang hari Kiamat, "Kapankah terjadinya?"' },
      { number: 43, arabic: 'فِيمَ أَنتَ مِن ذِكْرَاهَا', translation: 'Untuk apa (kamu) menyebutkan (waktunya)?' },
      { number: 44, arabic: 'إِلَىٰ رَبِّكَ مُنتَهَاهَا', translation: 'Kepada Tuhanmulah (dikembalikan) kesudahannya (ketentuan waktunya)' },
      { number: 45, arabic: 'إِنَّمَا أَنتَ مُنذِرُ مَن يَخْشَاهَا', translation: 'Engkau (Muhammad) hanyalah pemberi peringatan bagi siapa yang takut kepadanya (hari Kiamat)' },
      { number: 46, arabic: 'كَأَنَّهُمْ يَوْمَ يَرَوْنَهَا لَمْ يَلْبَثُوا إِلَّا عَشِيَّةً أَوْ ضُحَاهَا', translation: 'Pada hari mereka melihat hari Kiamat, mereka merasa seakan-akan mereka tidak tinggal (di dunia) kecuali sebentar saja di waktu sore atau pagi hari' }
    ]
  },
  {
    number: 78,
    name: 'An-Naba',
    arabicName: 'النَّبَإ',
    verses: [
      { number: 1, arabic: 'عَمَّ يَتَسَاءَلُونَ', translation: 'Tentang apakah mereka saling bertanya-tanya?' },
      { number: 2, arabic: 'عَنِ النَّبَإِ الْعَظِيمِ', translation: 'Tentang berita yang besar (hari Kiamat)' },
      { number: 3, arabic: 'الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ', translation: 'Yang mereka berselisih padanya' },
      { number: 4, arabic: 'كَلَّا سَيَعْلَمُونَ', translation: 'Sekali-kali tidak! Kelak mereka akan mengetahui' },
      { number: 5, arabic: 'ثُمَّ كَلَّا سَيَعْلَمُونَ', translation: 'Kemudian sekali-kali tidak! Kelak mereka akan mengetahui' },
      { number: 6, arabic: 'أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا', translation: 'Bukankah Kami telah menjadikan bumi sebagai hamparan?' },
      { number: 7, arabic: 'وَالْجِبَالَ أَوْتَادًا', translation: 'Dan gunung-gunung sebagai pasak?' },
      { number: 8, arabic: 'وَخَلَقْنَاكُمْ أَزْوَاجًا', translation: 'Dan Kami menciptakan kamu berpasang-pasangan' },
      { number: 9, arabic: 'وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا', translation: 'Dan Kami menjadikan tidurmu untuk istirahat' },
      { number: 10, arabic: 'وَجَعَلْنَا اللَّيْلَ لِبَاسًا', translation: 'Dan Kami menjadikan malam sebagai pakaian' },
      { number: 11, arabic: 'وَجَعَلْنَا النَّهَارَ مَعَاشًا', translation: 'Dan Kami menjadikan siang untuk mencari penghidupan' },
      { number: 12, arabic: 'وَبَنَيْنَا فَوْقَكُمْ سَبْعًا شِدَادًا', translation: 'Dan Kami membangun di atas kamu tujuh (langit) yang kokoh' },
      { number: 13, arabic: 'وَجَعَلْنَا سِرَاجًا وَهَّاجًا', translation: 'Dan Kami jadikan (matahari) pelita yang sangat terang' },
      { number: 14, arabic: 'وَأَنزَلْنَا مِنَ الْمُعْصِرَاتِ مَاءً ثَجَّاجًا', translation: 'Dan Kami menurunkan dari awan air yang banyak tercurah' },
      { number: 15, arabic: 'لِّنُخْرِجَ بِهِ حَبًّا وَنَبَاتًا', translation: 'Agar Kami tumbuhkan dengan air itu biji-bijian dan tumbuh-tumbuhan' },
      { number: 16, arabic: 'وَجَنَّاتٍ أَلْفَافًا', translation: 'Dan kebun-kebun yang lebat' },
      { number: 17, arabic: 'إِنَّ يَوْمَ الْفَصْلِ كَانَ مِيقَاتًا', translation: 'Sungguh, hari keputusan (hari Kiamat) adalah waktu yang dijanjikan' },
      { number: 18, arabic: 'يَوْمَ يُنفَخُ فِي الصُّورِ فَتَأْتُونَ أَفْوَاجًا', translation: 'Pada hari ditiup sangkakala, lalu kamu datang berbondong-bondong' },
      { number: 19, arabic: 'وَفُتِحَتِ السَّمَاءُ فَكَانَتْ أَبْوَابًا', translation: 'Dan dibukalah langit, maka menjadi pintu-pintu' },
      { number: 20, arabic: 'وَسُيِّرَتِ الْجِبَالُ فَكَانَتْ سَرَابًا', translation: 'Dan dijalankan gunung-gunung maka menjadi fatamorgana' },
      { number: 21, arabic: 'إِنَّ جَهَنَّمَ كَانَتْ مِرْصَادًا', translation: 'Sungguh, neraka Jahanam itu (padanya ada malaikat) yang menanti' },
      { number: 22, arabic: 'لِّلطَّاغِينَ مَآبًا', translation: 'Bagi orang-orang yang melampaui batas, (sebagai) tempat kembali' },
      { number: 23, arabic: 'لَّابِثِينَ فِيهَا أَحْقَابًا', translation: 'Mereka tinggal di dalamnya bertahun-tahun' },
      { number: 24, arabic: 'لَّا يَذُوقُونَ فِيهَا بَرْدًا وَلَا شَرَابًا', translation: 'Mereka tidak merasakan kesejukan di dalamnya dan tidak (pula mendapat) minuman' },
      { number: 25, arabic: 'إِلَّا حَمِيمًا وَغَسَّاقًا', translation: 'Kecuali air yang mendidih dan nanah' },
      { number: 26, arabic: 'جَزَاءً وِفَاقًا', translation: 'Sebagai balasan yang setimpal' },
      { number: 27, arabic: 'إِنَّهُمْ كَانُوا لَا يَرْجُونَ حِسَابًا', translation: 'Sungguh, dahulu mereka tidak mengharapkan perhitungan (amal)' },
      { number: 28, arabic: 'وَكَذَّبُوا بِآيَاتِنَا كِذَّابًا', translation: 'Dan mereka mendustakan ayat-ayat Kami dengan pendustaan (yang sangat keras)' },
      { number: 29, arabic: 'وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ كِتَابًا', translation: 'Dan segala sesuatu telah Kami catat dalam kitab (Lauh Mahfuz)' },
      { number: 30, arabic: 'فَذُوقُوا فَلَن نَّزِيدَكُمْ إِلَّا عَذَابًا', translation: 'Maka rasakanlah! Kami tidak akan menambah kepada kamu selain azab' },
      { number: 31, arabic: 'إِنَّ لِلْمُتَّقِينَ مَفَازًا', translation: 'Sungguh, orang-orang yang bertakwa mendapat kemenangan' },
      { number: 32, arabic: 'حَدَائِقَ وَأَعْنَابًا', translation: 'Yaitu kebun-kebun dan buah anggur' },
      { number: 33, arabic: 'وَكَوَاعِبَ أَتْرَابًا', translation: 'Dan gadis-gadis remaja yang sebaya' },
      { number: 34, arabic: 'وَكَأْسًا دِهَاقًا', translation: 'Dan gelas-gelas yang penuh (berisi minuman)' },
      { number: 35, arabic: 'لَّا يَسْمَعُونَ فِيهَا لَغْوًا وَلَا كِذَّابًا', translation: 'Mereka tidak mendengar di dalamnya perkataan yang sia-sia dan tidak (pula perkataan) dusta' },
      { number: 36, arabic: 'جَزَاءً مِّن رَّبِّكَ عَطَاءً حِسَابًا', translation: 'Sebagai balasan dari Tuhanmu, pemberian yang cukup banyak' },
      { number: 37, arabic: 'رَّبِّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا الرَّحْمَٰنِ ۖ لَا يَمْلِكُونَ مِنْهُ خِطَابًا', translation: 'Tuhan (yang menguasai) langit dan bumi dan apa yang ada di antara keduanya; Yang Maha Pengasih. Mereka tidak dapat berbicara dengan Dia' },
      { number: 38, arabic: 'يَوْمَ يَقُومُ الرُّوحُ وَالْمَلَائِكَةُ صَفًّا ۖ لَّا يَتَكَلَّمُونَ إِلَّا مَنْ أَذِنَ لَهُ الرَّحْمَٰنُ وَقَالَ صَوَابًا', translation: 'Pada hari ketika Ruh (Jibril) dan para malaikat berdiri bershaf-shaf, mereka tidak berkata-kata kecuali siapa yang telah diberi izin kepadanya oleh Yang Maha Pengasih; dan dia berbicara dengan benar' },
      { number: 39, arabic: 'ذَٰلِكَ الْيَوْمُ الْحَقُّ ۖ فَمَن شَاءَ اتَّخَذَ إِلَىٰ رَبِّهِ مَآبًا', translation: 'Itulah hari yang pasti terjadi. Maka barangsiapa menghendaki, niscaya dia menempuh jalan kembali kepada Tuhannya' },
      { number: 40, arabic: 'إِنَّا أَنذَرْنَاكُمْ عَذَابًا قَرِيبًا يَوْمَ يَنظُرُ الْمَرْءُ مَا قَدَّمَتْ يَدَاهُ وَيَقُولُ الْكَافِرُ يَا لَيْتَنِي كُنتُ تُرَابًا', translation: 'Sungguh, Kami telah memperingatkan kepadamu (hai orang kafir) tentang azab yang dekat, pada hari ketika manusia melihat apa yang telah diperbuat oleh kedua tangannya; dan orang kafir berkata, "Alangkah baiknya sekiranya aku dahulu adalah tanah"' }
    ]
  }
];

export const getSurahData = (surahNumber: number): SurahData | undefined => {
  return juzAmmaData.find(s => s.number === surahNumber);
};

export const getSurahByName = (name: string): SurahData | undefined => {
  return juzAmmaData.find(s => s.name === name || s.arabicName === name);
};
