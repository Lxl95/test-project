/**
 * Joins two strings with '@' symbol, but only shows '@' if both strings are non-empty
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {string} - Joined string
 */
function joinWithAt(str1, str2) {
    // Handle empty strings
    const trimmedStr1 = str1 ? str1.trim() : '';
    const trimmedStr2 = str2 ? str2.trim() : '';
    
    // If both strings are empty, return empty string
    if (!trimmedStr1 && !trimmedStr2) {
        return '';
    }
    
    // If only first string is empty, return second string
    if (!trimmedStr1) {
        return trimmedStr2;
    }
    
    // If only second string is empty, return first string
    if (!trimmedStr2) {
        return trimmedStr1;
    }
    
    // Both strings are non-empty, join with '@'
    return `${trimmedStr1}@${trimmedStr2}`;
}

// Example usage:
console.log(joinWithAt("hello", "world"));    // "hello@world"
console.log(joinWithAt("hello", ""));         // "hello"
console.log(joinWithAt("", "world"));         // "world"
console.log(joinWithAt("", ""));              // ""
console.log(joinWithAt("  hello  ", "world")); // "hello@world"
