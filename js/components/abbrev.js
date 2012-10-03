var gts = this.gts || {};

gts.abbrev = function (sentence, width, padding) {
    if (sentence.length <= width) { return sentence; }
    padding = padding || "";
    var words = sentence.split(" ");
    var result = [];
    var len;

    for (var i = 0, l = words.length; i < l; ++i) {
        len = result.join(" ").length + words[i].length + padding.length;
        if (len > width) { break; }
        result.push(words[i]);
    }

    return result.join(" ") + padding;
};