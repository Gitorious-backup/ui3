/*global cull, dome*/
this.gts.blob = (function () {
    function highlightLineOnFocus(element, start, end) {
        var highlight = function () { dome.cn.add("focus", this); };
        var dim = function () { dome.cn.rm("focus", this); };

        cull.doall(function (li) {
            dome.on(li, "mouseenter", highlight);
            dome.on(li, "mouseleave", dim);
        }, element.getElementsByTagName("li"));
    }

    function regionFromUrl(url) {
        var matches = url.match(/\#l(\d+)(?:-(\d+))?/i);
        if (!matches) { return; }
        var start = Math.min(matches[2] || matches[1], matches[1]);
        var end = Math.max(matches[2] || matches[1], matches[1]);
        return [start, end];
    }

    function highlightRegion(element, region) {
        // Line numbers are 1-based, but ElementLists are 0-indexed,
        // offset region accordingly
        var start = region[0] - 1;
        var end = region[1] - 1;
        var lines = element.getElementsByTagName("li");

        cull.doall(function (li, num) {
            var inRegion = start <= num && num <= end;
            dome.cn[inRegion ? "add" : "rm"]("region", li);
        }, element.getElementsByTagName("li"));
    }

    return {
        highlightLineOnFocus: highlightLineOnFocus,
        regionFromUrl: regionFromUrl,
        highlightRegion: highlightRegion
    };
}());
