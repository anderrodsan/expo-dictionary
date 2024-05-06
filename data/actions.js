import AsyncStorage from "@react-native-async-storage/async-storage";
import translate from "translate-google-api";
import { fetchWordType } from "../lib/fetch-word-type";

//fetch saved words
export const fetchSavedWords = async ({ setSavedWords }) => {
  try {
    const savedWordsString = await AsyncStorage.getItem("savedWords");
    if (savedWordsString) {
      const savedWords = JSON.parse(savedWordsString).reverse();
      //console.log("savedWords", savedWords);
      setSavedWords(savedWords);
    }
  } catch (error) {
    console.error("Error fetching saved words:", error);
  }
};

//fetch one random word that contains status == "new"
export const fetchNewWord = async ({ setWord }) => {
  try {
    const savedWordsString = await AsyncStorage.getItem("savedWords");
    if (savedWordsString) {
      const savedWords = JSON.parse(savedWordsString).reverse();

      //filter the words that have the status == "new"
      const filteredWords =
        savedWords.filter((word) => word.status === "new") || [];

      //select a random item from filteredWord
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const randomWord = filteredWords[randomIndex];
      setWord(randomWord);
    }
  } catch (error) {
    console.error("Error fetching saved words:", error);
  }
};

//add word to savedWords
export const saveWord = async ({
  setLatestWord,
  setText,
  text,
  tag,
  inputRef,
  language,
}) => {
  try {
    // Check if text is not empty
    if (text.trim() !== "") {
      // Get existing words from AsyncStorage or initialize an empty array
      const existingWords = (await AsyncStorage.getItem("savedWords")) || "[]";
      const parsedWords = JSON.parse(existingWords);

      // Check if the Danish word is already saved
      const isWordSaved = parsedWords.some(
        (word) => word.danish === text.trim()
      );

      if (isWordSaved) {
        alert("This word is already saved.");
        // Remove focus from the input field
        inputRef.current.blur();
        return; // Exit early if the word is already saved
      }

      //if language is false == danish -> english | true == english -> danish
      const danishWord = language
        ? (
            await translate(`${text.trim()}`, {
              from: "en",
              to: "da",
            })
          )[0] || null
        : text.trim();

      const englishWord = language
        ? text.trim()
        : (
            await translate(`${text.trim()}`, {
              from: "da",
              to: "en",
            })
          )[0] || null;

      //get the type of word (noun, adv, verb, etc.)
      const types = (await fetchWordType(englishWord)) || null;

      if (!types) {
        alert("Wrong Word");
        console.log("wrong word");
        return;
      }

      // Create a new word object
      const newWord = {
        id: parsedWords.length + 1,
        danish: danishWord,
        english: englishWord,
        type: types,
        tag: tag,
        status: "new",
        date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      };
      console.log("newWord", newWord);

      // Add the new word to the array
      parsedWords.push(newWord);

      // Save the updated words array back to AsyncStorage
      await AsyncStorage.setItem("savedWords", JSON.stringify(parsedWords));

      // Reset the text input
      setText("");

      // Trigger a re-render of the component by toggling the 'refresh' state
      setLatestWord(newWord);

      // Show success message or navigate to another screen
      //alert("Word saved successfully!");
      // Remove focus from the input field
      inputRef.current.blur();
    } else {
      alert("Please enter a word.");
    }
  } catch (error) {
    console.error("Error saving word:", error);
    alert("An error occurred while saving the word. Please try again.");
  }
};

//remove item from data
export const removeWord = async ({ setSavedWords, word }) => {
  try {
    // fetch data from AsyncStorage
    const existingWords = (await AsyncStorage.getItem("savedWords")) || "[]";

    //find the word to be removed by the id and remove it to the array
    const parsedWords = JSON.parse(existingWords);

    const newWords = parsedWords.filter((item) => item.danish !== word);

    // Save the updated words array back to AsyncStorage
    await AsyncStorage.setItem("savedWords", JSON.stringify(newWords));
    fetchSavedWords({ setSavedWords });
  } catch (error) {
    console.error("Error saving word:", error);
    alert("An error occurred while saving the word. Please try again.");
  }
};

//update a word
export const updateWord = async ({ word }) => {
  try {
    // fetch data from AsyncStorage
    const existingWords = (await AsyncStorage.getItem("savedWords")) || "[]";

    //find the word to be removed by the id and remove it to the array
    const parsedWords = JSON.parse(existingWords);

    const newWords = parsedWords.filter((item) => item.danish !== word.danish);

    // Add the new word to the array

    newWords.push(word);

    // Save the updated words array back to AsyncStorage
    await AsyncStorage.setItem("savedWords", JSON.stringify(newWords));
  } catch (error) {
    console.error("Error saving word:", error);
    alert("An error occurred while saving the word. Please try again.");
  }
};

//clear all data
export const clearAllData = async ({ setSavedWords }) => {
  try {
    // Clear data from AsyncStorage
    await AsyncStorage.removeItem("savedWords");
    setSavedWords([]); // Clear the state
    console.log("Data cleared from AsyncStorage.");
  } catch (error) {
    console.error("Error clearing data from AsyncStorage:", error);
  }
};