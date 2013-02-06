/*global cull*/
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
 * gts.url.render(template, data)
 *   Renders a URL from the template.
 *
 *     gts.url.render("/gitorious/#{repo}", { repo: "mainline" });
 *     //=> "/gitorious/mainline"
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
        return cull.reduce(function (result, n) {
            return result.replace(new RegExp(values[n], "g"), "#{" + n + "}");
        }, path(url), cull.keys(values));
    }

    function render(template, data) {
        return cull.reduce(function (result, p) {
            return result.replace(new RegExp("#{" + p + "}", "g"), data[p]);
        }, template, cull.keys(data));
    }

    function currentRef(url) {
        var regexp = /(blame|blob|tree|history|raw|source|readme)\//;
        var refPath = url.split(regexp)[2];
        return refPath && refPath.split(":")[0] || null;
    }

    return {
        templatize: templatize,
        render: render,
        currentRef: currentRef
    };
}());
