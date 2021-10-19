import "./styles.css";

import { useEffect, useState } from "react";
import { text } from "./text";

const TABLE_ID_PREFIX = "word_count_table";

export default function App() {
  const [words, setWords] = useState({});
  const [isDefaultSort, setIsDefaultSort] = useState(true);

  /**
   *
   * This is a simple application that injests some text,
   * parses all alphabetic words and displays the count of
   * the words in a table format. There is also a button
   * which allows users to sort the table by the count of
   * the words in descending order or by the default
   * alphabetic sort.
   *
   * Some assumptions have been made:
   * 1 - Excluding all numeric values (dates)
   * 2 - Added a default alphabetic sort
   * 3 - Word counts are case sensitive
   * 4 - Ignore the count of empty strings
   * 5 - No need to create subcomponents, simple enough
   *
   */

  useEffect(() => {
    // only need to initialize the state once
    initWords();
  }, []);

  const initWords = () => {
    // check if we have text to process
    if (text) {
      // removing all non-alphabetic characters
      // also keeping spaces, single quotes and a special character
      const formattedText = text.replace(/[^a-z é']/gi, " ");
      // splitting based on spaces and sorting alphabetically by default
      const splitText = formattedText
        .split(" ")
        .sort((a, b) => a.localeCompare(b));
      // check that there is some formatted, split text to process
      if (splitText?.length) {
        // initalize our map/object
        const wordsMap = {};
        // loop over all words
        splitText.forEach((split) => {
          if (!wordsMap[split]) {
            // if we don't already have this word, initalize it in the map
            wordsMap[split] = 0;
          }
          // increment the count of this word
          wordsMap[split] += 1;
        });
        // empty strings were making it through, just delete them from the map
        delete wordsMap[""];
        // update the state
        setWords(wordsMap);
      }
    }
  };

  const handleCountSort = (e) => {
    // prevent the default button logic
    e.preventDefault();
    // check that we have words to sort
    if (words) {
      // initialize new map to avoid side effects
      const sortedWords = Object.entries(words)
        // check if we want to sort alphabetically or by count descending
        .sort(([wordA, countA], [wordB, countB]) =>
          isDefaultSort ? countB - countA : wordA.localeCompare(wordB)
        )
        // reduce the object back into the map
        .reduce(
          (current, [word, count]) => ({ ...current, [word]: count }),
          {}
        );
      // reset words state and flip our sort type flag
      setWords(sortedWords);
      setIsDefaultSort(!isDefaultSort);
    }
  };

  return (
    <div id="app" className="App">
      <button id="sort_btn" onClick={handleCountSort}>
        {isDefaultSort ? "Sort by Count Descending" : "Sort Alphabetically"}
      </button>
      {words && Object.keys(words) && (
        <table id={`${TABLE_ID_PREFIX}`}>
          <thead id={`${TABLE_ID_PREFIX}_header`}>
            <tr id={`${TABLE_ID_PREFIX}_header_row`}>
              <th id={`${TABLE_ID_PREFIX}_header_word`}>Word</th>
              <th id={`${TABLE_ID_PREFIX}_header_count`}>Count</th>
            </tr>
          </thead>
          <tbody id={`${TABLE_ID_PREFIX}_body`}>
            {Object.keys(words).map((word, wordIndex) => {
              return (
                <tr
                  key={`${word}_${wordIndex}`}
                  id={`${TABLE_ID_PREFIX}_body_row_${wordIndex}`}
                >
                  <td id={`${TABLE_ID_PREFIX}_body_row_${wordIndex}_word`}>
                    {word}
                  </td>
                  <td id={`${TABLE_ID_PREFIX}_body_row_${wordIndex}_count`}>
                    {words[word]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
