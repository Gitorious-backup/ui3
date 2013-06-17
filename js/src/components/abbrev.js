/*global cull*/
this.gts = this.gts || {};

/**
 * Abbreviates a string to fit within a predefined width. If the
 * string is shorter than, or just as long as the specified width, it
 * is returned untouched.
 *
 * If the optional suffix is provided, it is appended to the
 * abbreviated string, and the full length of the abbreviated string
 * with the suffix is guaranteed to not be wider than the specified
 * width.
 */
this.gts.abbrev = function (sentence, width, suffix) {
    if (sentence.length <= width) { return sentence; }
    suffix = suffix || "";

    return cull.reduce(function (words, word) {
        if (words.join(" ").length + word.length + suffix.length <= width) {
            words.push(word);
        }
        return words;
    }, [], sentence.split(" ")).join(" ") + suffix;
};
