export function toCamelCase(str) {
  // Step 1: Replace special characters and multiple spaces with a single space
  str = str.replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, " ");

  // Step 2: Split string by space
  let words = str.split(" ");

  // Step 3: Capitalize first letter of each word, except the first word
  for (let i = 0; i < words.length; i++) {
    if (i === 0) {
      words[i] = words[i].toLowerCase();
    } else {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
  }

  // Step 4 & 5: Remove leading and trailing spaces and join
  return words.join("");
}
