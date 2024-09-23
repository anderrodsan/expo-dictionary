import AsyncStorage from "@react-native-async-storage/async-storage";
import translate from "translate-google-api";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

//fetch saved words
export const fetchSavedWords = async () => {
  try {
    const savedWordsString = await AsyncStorage.getItem("savedWords");
    if (savedWordsString) {
      //order the words based on their word.id (higher to lowest)
      const savedWords = JSON.parse(savedWordsString).sort(
        (a, b) => b.id - a.id
      );

      //console.log("savedWords", savedWords);
      //setSavedWords(savedWords);
      return savedWords;
    }
  } catch (error) {
    console.error("Error fetching saved words:", error);
  }
};

//fetch one random word that contains status == "new"
export const fetchNewWord = async ({ data, filteredStatus }) => {
  try {
    //const savedWordsString = await AsyncStorage.getItem("savedWords");
    if (data) {
      //console.log("data", data);
      //const savedWords = JSON.parse(data).reverse();

      const filteredWords =
        filteredStatus === "All"
          ? data
          : filteredStatus === "fav"
          ? data.filter((item) => item.fav === true)
          : data.filter((item) => item.status === filteredStatus);

      //select a random item from filteredWord
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const randomWord = filteredWords[randomIndex];
      return randomWord;
    }
  } catch (error) {
    console.error("Error fetching saved words:", error);
  }
};

//fetch a random word based on the status (the probability of showing a word is based on its status high > medium > low)
function getRandomWord({ words }) {
  //select a random number between 0 to 10
  const randomNumber = Math.floor(Math.random() * 10);

  //percenteges of each status 50% Hard, 40% Medium, 10% Easy

  if (randomNumber < 5) {
    const hardWords = words.find((word) => word.status === "High");
    //get a random word from the array
    const randomIndex = Math.floor(Math.random() * hardWords.length);
    const randomWord = hardWords[randomIndex];

    return randomWord;
  } else if (randomNumber < 9) {
    const mediumWords = words.find((word) => word.status === "Medium");
    const randomIndex = Math.floor(Math.random() * mediumWords.length);
    const randomWord = mediumWords[randomIndex];

    return randomWord;
  } else {
    const easyWords = words.find((word) => word.status === "Easy");
    const randomIndex = Math.floor(Math.random() * easyWords.length);
    const randomWord = easyWords[randomIndex];

    return randomWord;
  }
}

//add word to savedWords
export const saveWord = async ({ text, tag, lang1, lang2, swap }) => {
  try {
    // Check if text is not empty
    if (text.trim() !== "") {
      // Get existing words from AsyncStorage or initialize an empty array
      const existingWords = (await AsyncStorage.getItem("savedWords")) || "[]";
      const parsedWords = JSON.parse(existingWords);

      // Check if the Danish word is already saved
      const isWordSaved = parsedWords.some(
        (word) => word.lang1 === text.trim()
      );

      if (isWordSaved) {
        const newWord = parsedWords.find((word) => word.lang1 === text.trim());

        return newWord; // Exit early if the word is already saved
      }

      //if swap is false == danish -> english | true == english -> danish
      const lang1Word = swap
        ? (
            await translate(`${text.trim()}`, {
              from: lang2,
              to: lang1,
            })
          )[0] || null
        : text.trim();

      const lang2Word = swap
        ? text.trim()
        : (
            await translate(`${text.trim()}`, {
              from: lang1,
              to: lang2,
            })
          )[0] || null;

      //get the type of word (noun, adv, verb, etc.)
      /*const types = (await fetchWordType(englishWord)) || null;

      if (!types) {
        alert("Wrong Word");
        console.log("wrong word");
        return;
      }
      */

      // Create a new word object
      const newWord = {
        //give it the id +1 of the highest id word
        id: Math.max(...parsedWords.map((word) => word.id)) + 1 || 0,
        lang1: lang1Word,
        lang2: lang2Word,
        lang: lang1,
        tag: tag,
        status: "new",
        date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      };
      console.log("newWord", newWord);

      // Add the new word to the array
      parsedWords.push(newWord);

      // Save the updated words array back to AsyncStorage
      await AsyncStorage.setItem("savedWords", JSON.stringify(parsedWords));

      // Show success message or navigate to another screen
      //alert("Word saved successfully!");
      return newWord;
    } else {
      alert("Please enter a word.");
    }
  } catch (error) {
    console.error("Error saving word:", error);
    alert("An error occurred while saving the word. Please try again.");
  }
};

//remove item from data
export const removeWord = async ({ word }) => {
  console.log("word", word);
  try {
    // fetch data from AsyncStorage
    const existingWords = (await AsyncStorage.getItem("savedWords")) || "[]";

    //find the word to be removed by the id and remove it to the array
    const parsedWords = JSON.parse(existingWords);

    const newWords = parsedWords.filter((item) => item.id !== word.id);

    // Save the updated words array back to AsyncStorage
    await AsyncStorage.setItem("savedWords", JSON.stringify(newWords));
  } catch (error) {
    console.error("Error saving word:", error);
    alert("An error occurred while saving the word. Please try again.");
  }
};

//update a word
export const updateWord = async ({ word }) => {
  console.log("word", word);
  try {
    // fetch data from AsyncStorage
    const existingWords = (await AsyncStorage.getItem("savedWords")) || "[]";

    //find the word to be removed by the id and remove it to the array
    const parsedWords = JSON.parse(existingWords);

    const newWords = parsedWords.filter((item) => item.id !== word.id);

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
export const clearAllData = async () => {
  Alert.alert(
    "Clear All Data",
    "Are you sure you want to clear all the data?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            // Clear data from AsyncStorage
            await AsyncStorage.removeItem("savedWords");
            console.log("Data cleared from AsyncStorage.");
          } catch (error) {
            console.error("Error clearing data from AsyncStorage:", error);
          }
        },
      },
    ]
  );
};

export const toggleFavorite = ({ word }) => {
  //add new value pair fav: true or false
  word.fav = word.fav ? !word.fav : true;
  //console.log("word", word);
  updateWord({ word });
};

//Function to downoload saved words into a json file
export const downloadJSONData = async (data) => {
  // Create and save the JSON file
  const createAndSaveFile = async (data) => {
    const json = JSON.stringify(data);
    //the name of the file should be wordwise-date.json
    const dateString = new Date().toISOString().split("T")[0];
    const fileUri =
      FileSystem.documentDirectory + "wordwise-" + dateString + ".json";

    try {
      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      return fileUri;
    } catch (error) {
      console.error("Error writing file:", error);
      return null;
    }
  };

  // Share the file
  const shareFile = async (fileUri) => {
    try {
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  if (data) {
    const fileUri = await createAndSaveFile(data);
    if (fileUri) {
      await shareFile(fileUri);
    }
  } else {
    console.error("No data found");
  }
};

//Function to upload json file and rewrite the savedWords data
export const uploadJSONData = async () => {
  //select the file to be uploaded
  const fileUri = await DocumentPicker.getDocumentAsync();
  console.log("fileUri", fileUri.assets[0].uri);
  if (!fileUri) {
    //console.error("No file selected");
    return;
  }

  //read the .json file and save it in a json variable
  await FileSystem.readAsStringAsync(fileUri.assets[0].uri, {
    encoding: FileSystem.EncodingType.UTF8,
  })
    .then((data) => {
      //console.log("fileContent", data);
      //set the local async storage

      //send an alert saying the data will be overwritten, if accepted, overwrite the data
      Alert.alert(
        "Overwrite Data",
        "Are you sure you want to overwrite the data?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              try {
                AsyncStorage.setItem("savedWords", data);
                console.log("File uploaded successfully");
                //return the data
                return data;
              } catch (error) {
                console.error("Error uploading file:", error);
              }
            },
          },
        ]
      );
    })
    .catch((error) => {
      console.error("Error reading file:", error);
    });

  /*set the local async storage
  try {
    await AsyncStorage.setItem("savedWords", fileContent);
    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
  */
};

//get the names of different languages in the list: "da", "en", etc.
export const getLanguageList = (data) => {
  return Array.from(new Set(data.map((item) => item.lang)));
};

//get the words that include the lang: value ("da", "en", etc.)
export const getLanguageWords = (data, lang) => {
  return data.filter((item) => item.lang === lang);
};
