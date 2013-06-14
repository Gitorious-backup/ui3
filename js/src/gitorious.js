/*global gts, reqwest, cull*/

// Environment variables
gts.app.env("url", window.location.href);
gts.app.env("redirect", function (url) { window.location = url; });

if ("onpopstate" in window) {
    window.onpopstate = function (event) {
        gts.app.env("url", window.location.href);
    };
}

// Data
gts.app.data("ref-url-template", function (url, ref) {
    return gts.url.templatize(url, { ref: ref });
}, { depends: ["url", "current-ref"] });

gts.app.data("repository-refs", function (url) {
    return reqwest({ url: url, type: "json" });
}, { depends: ["repository-refs-url"] });

gts.app.data("current-ref", gts.url.currentRef, { depends: ["url"] });
gts.app.data("user-repo-view-state", gts.userRepoViewState, { depends: ["user-repository-path"] });
gts.app.data("current-user", cull.prop("user"), { depends: ["user-repo-view-state"] });
gts.app.data("blob-region", gts.blob.regionFromUrl, { depends: ["url"] });

// Features
// NB! While it is possible to lean on the function name when registering
// features, e.g. gts.app.feature(gts.googleAnalytics, { ... }); we don't do
// that, because uglify will strip out the function names, and the app will
// crash.
gts.app.feature("google-analytics", gts.googleAnalytics, {
    depends: ["analytics-account", "analytics-domain-name"]
});

gts.app.feature("ref-selector", gts.refSelector, {
    elements: ["gts-ref-selector-ph"],
    depends: ["repository-refs", "current-ref", "ref-url-template"]
});

gts.app.feature("tree-history", gts.treeHistory, {
    elements: ["gts-tree-explorer"],
    depends: ["tree-history-url"]
});

gts.app.feature("commit-linker", gts.commitLinker, {
    elements: ["gts-body"],
    depends: ["commit-url-template", "redirect"]
});

gts.app.feature("profile-menu", gts.profileMenu, {
    elements: ["login_button"],
    depends: ["current-user"]
});

gts.app.feature("clone-url-selection", gts.cloneUrlSelection, {
    elements: ["gts-repo-urls"]
});

gts.app.feature("highlight-region", gts.blob.highlightRegion, {
    elements: ["gts-lines"],
    depends: ["blob-region"]
});

gts.app.feature("highlight-line-mouseover", gts.blob.highlightLineOnFocus, {
    elements: ["gts-lines"]
});

gts.app.feature("live-markdown-preview", gts.liveMarkdownPreview, {
    elements: ["gts-live-markdown-preview"]
});

// Spin off app asynchronously so subsequent scripts have a chance
// to register loggers etc before we roll
setTimeout(function () {
    // Scan the document for data-gts-* attributes that set
    // "environment variables"
    gts.app.scanEnvAttrs(document.body, "data-gts-env-");
    gts.app.load(document.body);
}, 10);
