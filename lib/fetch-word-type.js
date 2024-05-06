//node js script to fetch words from the website https://wordtype.org/of/${word}

export const fetchWordType = async (word) => {
  const decapitalizedWord = word.charAt(0).toLowerCase() + word.slice(1);
  const apiUrl = `https://wordtype.org/api/senses?term=${decapitalizedWord}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data[0].pos);

    //save all the pos values in an array
    const typeValues = data.map((item) => item.pos);
    console.log(typeValues);

    return typeValues; // Return the type of the word (noun, adv, verb, etc.)
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
};
