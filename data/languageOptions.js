//list of language options such as {value: "da", name: "Danish", original: "Dansk", text: "Skriv et ord..."}, {value: "en", name: "English", original: "English", text: "Type a word..."}, ... put the languages in order of importance
export const languageOptions = [
  { value: "ar", name: "Arabic", original: "العربية", text: "اكتب كلمة..." },
  {
    value: "eu",
    name: "Basque",
    original: "Euskara",
    text: "Hitza txertatu...",
  },
  {
    value: "bn",
    name: "Bengali",
    original: "বাংলা",
    text: "একটি শব্দ টাইপ করুন...",
  },
  {
    value: "ca",
    name: "Catalan",
    original: "Catalán",
    text: "Escriviu una paraula...",
  },
  { value: "zh", name: "Chinese", original: "中文", text: "输入一个单词..." },
  { value: "cs", name: "Czech", original: "Česky", text: "Zadejte slovo..." },
  { value: "da", name: "Danish", original: "Dansk", text: "Skriv et ord..." },
  {
    value: "nl",
    name: "Dutch",
    original: "Nederlands",
    text: "Typ een woord...",
  },
  { value: "en", name: "English", original: "English", text: "Type a word..." },
  { value: "fi", name: "Finnish", original: "Suomi", text: "Kirjoita sana..." },
  {
    value: "fr",
    name: "French",
    original: "Français",
    text: "Tapez une mot...",
  },
  {
    value: "de",
    name: "German",
    original: "Deutsch",
    text: "Gib ein Wort ein...",
  },
  {
    value: "el",
    name: "Greek",
    original: "Ελληνικά",
    text: "Πληκτρολογήστε λεξη...",
  },
  { value: "he", name: "Hebrew", original: "עברית", text: "הקלד מילה..." },
  { value: "hi", name: "Hindi", original: "हिंदी", text: "एक शब्द लिखे..." },
  {
    value: "hu",
    name: "Hungarian",
    original: "Magyar",
    text: "Írjon be egy szót...",
  },
  {
    value: "id",
    name: "Indonesian",
    original: "Bahasa Indonesia",
    text: "Ketik sebuah kata...",
  },
  {
    value: "it",
    name: "Italian",
    original: "Italiano",
    text: "Digita una parola...",
  },
  {
    value: "ja",
    name: "Japanese",
    original: "日本語",
    text: "単語を入力してください...",
  },
  { value: "ko", name: "Korean", original: "한국어", text: "단어 입력..." },
  { value: "la", name: "Latin", original: "Latin", text: "typus verbum" },
  {
    value: "ms",
    name: "Malay",
    original: "Bahasa Melayu",
    text: "Taip perkataan...",
  },
  { value: "no", name: "Norwegian", original: "Norsk", text: "Skriv ordet..." },
  {
    value: "fa",
    name: "Persian",
    original: "فارسی",
    text: "یک کلمه بنویسید...",
  },
  { value: "pl", name: "Polish", original: "Polski", text: "Wpisz słowo..." },
  {
    value: "pt",
    name: "Portuguese",
    original: "Português",
    text: "Digite uma palavra...",
  },
  {
    value: "ru",
    name: "Russian",
    original: "Русский",
    text: "Напишите слово...",
  },
  {
    value: "sk",
    name: "Slovak",
    original: "Slovensky",
    text: "Zadajte slovo...",
  },
  {
    value: "es",
    name: "Spanish",
    original: "Español",
    text: "Escribe una palabra...",
  },
  {
    value: "sv",
    name: "Swedish",
    original: "Svenska",
    text: "Skriv ett ord...",
  },
  { value: "th", name: "Thai", original: "ไทย", text: "ใส่คำเหมือน..." },
  {
    value: "tr",
    name: "Turkish",
    original: "Türkçe",
    text: "Kelimeyi yazın...",
  },
  {
    value: "uk",
    name: "Ukrainian",
    original: "Українська",
    text: "Введіть слово...",
  },
  {
    value: "vi",
    name: "Vietnamese",
    original: "Tiếng Việt",
    text: "Nhập tên văn bản...",
  },
];

//find the language name from the languageOptions
export const findLanguage = (lang) => {
  return languageOptions.find((option) => option.value === lang);
};
