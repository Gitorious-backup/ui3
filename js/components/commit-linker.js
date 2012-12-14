// The global, shared Gitorious namespace
var gts = this.gts || {};

/**
 */
gts.commitLinker = function (root, urlTemplate, handler) {
    var selector = ".gts-commit-oid";
    $(root).addClass("gts-commit-linker").on("click", selector, function (e) {
        handler(gts.url.render(urlTemplate, {
            oid: this.getAttribute("data-gts-commit-oid")
        }));
    });
};
