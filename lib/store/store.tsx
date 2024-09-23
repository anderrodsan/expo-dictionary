import { create } from "zustand";

// store the wordlist
export const useWordList = create((set) => ({
  wordList: [],
  setWordList: (wordList) => set({ wordList }),
  //add new word to the wordlist
  addWord: (word) => set((state) => ({ wordList: [...state.wordList, word] })),
  //remove word from the wordlist
  removeWord: (word) =>
    set((state) => ({
      wordList: state.wordList.filter((w) => w.lang1 !== word.lang1),
    })),
}));

//store the language list from saved words
export const useLanguageList = create((set) => ({
  langList: [],
  setLangList: (langList) => set({ langList }),
}));

//store the selected language
export const useLang = create((set) => ({
  lang: "",
  setLang: (lang) => set({ lang }),
}));
