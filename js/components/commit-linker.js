// The global, shared Gitorious namespace
var gts = this.gts || {};

/**
 * Adds a live event handler to a root element that fires on any
 * element with the class "gts-commit-oid". This is used to link
 * commit oids from Dolt to commit pages in Gitorious.
 *
 * root - The root element where "gts-commit-oid" links are expected
 * urlTemplate - The URL template to link to. Should be a URL with the
 *               #{oid} placeholder.
 * handler - The function to call when a commit link is clicked. The
 *           handler will be called with the resolved URL as its only
 *           argument.
 */
gts.commitLinker = function (root, urlTemplate, handler) {
    var selector = ".gts-commit-oid";
    $(root).addClass("gts-commit-linker").on("click", selector, function (e) {
        handler(gts.url.render(urlTemplate, {
            oid: this.getAttribute("data-gts-commit-oid")
        }));
    });
};
