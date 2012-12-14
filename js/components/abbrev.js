// The global, shared Gitorious namespace
var gts = this.gts || {};

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
gts.abbrev = function (sentence, width, suffix) {
    if (sentence.length <= width) { return sentence; }
    suffix = suffix || "";
    var words = sentence.split(" ");
    var result = [];
    var len;

    for (var i = 0, l = words.length; i < l; ++i) {
        len = result.join(" ").length + words[i].length + suffix.length;
        if (len > width) { break; }
        result.push(words[i]);
    }

    return result.join(" ") + suffix;
};
