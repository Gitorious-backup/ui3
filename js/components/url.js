this.gts = this.gts || {};

this.gts.url = (function () {
    function path(url) {
        var pieces = url.split("/");
        pieces.shift();
        pieces.shift();
        pieces.shift();
        return "/" + pieces.join("/");
    }

    function templatize(url, values) {
        var newUrl = path(url);

        for (var n in values) {
            newUrl = newUrl.replace(new RegExp(values[n], "g"), "#{" + n + "}");
        }

        return newUrl;
    }

    function currentRef(url) {
        var refPath = url.split(/(blame|blob|tree|history|raw|source|readme)\//)[2];
        return refPath && refPath.split(":")[0] || null;
    }

    return {
        templatize: templatize,
        currentRef: currentRef
    };
}());
