/*global cull, dome*/
this.gts.blob = (function () {
    function getLineNum(element) {
        while (element && element.tagName !== "LI") {
            element = element.parentNode;
        }
        var lineNum = element && element.className.match(/L(\d+)/)[1];
        if (!lineNum) { return; }
        return parseInt(lineNum, 10) + 1;
    }

    function setRegion(element, region, redirect) {
        var regionStr = region[0] + (region[1] !== region[0] ? "-" + region[1] : "");
        redirect("#L" + regionStr);
        highlightRegion(element, region);
    }

    function orderedRegion(start, end) {
        return [
            Math.min(end || start, start),
            Math.max(end || start, start)
        ];
    }

    function trackSelectedRegion(element, redirect) {
        var shift = false, anchor;
        dome.on(document.body, "keydown", function (e) { shift = e.which === 16; });
        dome.on(document.body, "keyup", function (e) { shift = e.which !== 16; });

        dome.on(element, "click", function (e) {
            var region, currLine = getLineNum(e.target);
            if (!shift || !anchor) { anchor = e.target; }

            if (anchor && shift) {
                region = orderedRegion(getLineNum(anchor), currLine);
                e.preventDefault();
            } else {
                region = [currLine, currLine];
            }

            setRegion(element, region, redirect);
        });
    }

    function highlightLineOnFocus(element, redirect) {
        var highlight = function () { dome.cn.add("focus", this); };
        var dim = function () { dome.cn.rm("focus", this); };

        cull.doall(function (li) {
            dome.on(li, "mouseenter", highlight);
            dome.on(li, "mouseleave", dim);
        }, element.getElementsByTagName("li"));

        trackSelectedRegion(element, redirect);
    }

    function regionFromUrl(url) {
        var matches = url.match(/\#l(\d+)(?:-(\d+))?/i);
        if (!matches) { return; }
        return orderedRegion(matches[1], matches[2]);
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
