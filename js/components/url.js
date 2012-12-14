// The global, shared Gitorious namespace
this.gts = this.gts || {};

/**
 * URL utilities.
 * 
 * gts.url.templatize(url, values)
 *   Accepts a URL/path and replaces the provided values with placeholders,
 *   for use as a URL template.
 * 
 *     gts.url.templatize("/gitorious/mainline/source/master:lib", {
 *         ref: "master",
 *         path: "lib"
 *     }); //=> "/gitorious/mainline/source/#{ref}:#{path}"
 * 
 * gts.url.currentRef(url)
 *   Attempts to sniff out the ref from the provided URL.
 * 
 *     gts.url.currentRef("/gitorious/mainline/source/master:lib");
 *     //=> "master"
 * 
 *     gts.url.currentRef("/gitorious/mainline/readme/fd1765989eeb5dac6f8a41692b692815fa0bb0c8");
 *     //=> "fd1765989eeb5dac6f8a41692b692815fa0bb0c8"
 */
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
