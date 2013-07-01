/*global gts, reqwest, cull*/

// Environment variables
gts.app.env("url", window.location.href);
gts.app.env("redirect", function (url) { window.location = url; });

if (window.hasOwnProperty("onpopstate")) {
    window.onpopstate = function (event) {
        gts.app.env("url", window.location.href);
    };
}

// Data
gts.app.data("ref-url-template", function (url, ref) {
    return gts.url.templatize(url, { ref: ref });
}, {
    depends: ["url", "current-ref"],
    serializeArgs: function (url, ref) { return [url.split("#")[0], ref]; }
});

gts.app.data("repository-refs", function (url) {
    return reqwest({ url: url, type: "json" });
}, { depends: ["repository-refs-url"] });

gts.app.data("current-ref", gts.url.currentRef, { depends: ["url"] });
gts.app.data("user-repo-view-state", gts.cache(gts.userRepoViewState), {
    depends: ["user-repository-path"]
});
gts.app.data("current-user", cull.prop("user"), {
    depends: ["user-repo-view-state"]
});
gts.app.data("current-repository", cull.prop("repository"), {
    depends: ["user-repo-view-state"]
});
gts.app.data("repository-admin", cull.prop("admin"), {
    depends: ["current-repository"]
});
gts.app.data("blob-region", gts.blob.regionFromUrl, { depends: ["url"] });

// Features
// NB! While it is possible to lean on the function name when registering
// features, e.g. gts.app.feature(gts.googleAnalytics, { ... }); we don't do
// that, because uglify will strip out the function names, and the app will
// crash.
gts.app.feature("google-analytics", gts.googleAnalytics, {
    depends: ["analytics-account", "analytics-domain-name"]
});

gts.app.feature("csrf-param", cull.prop("content"), { elements: [".csrf-param"] });
gts.app.feature("csrf-token", cull.prop("content"), { elements: [".csrf-token"] });


gts.app.feature("dropdown", gts.dropdown, {
    elements: ["dropdown"]
});

gts.app.feature("ref-selector", gts.refSelector, {
    elements: ["gts-ref-selector-ph"],
    depends: ["repository-refs", "current-ref", "ref-url-template"]
});

gts.app.feature("repository-admin-menu", gts.repositoryAdmin, {
    elements: ["gts-repository-nav"],
    depends: ["repository-admin"]
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

gts.app.feature("track-blob-focus", gts.blob.trackFocus, {
    elements: ["gts-lines"],
    depends: ["redirect"]
});

gts.app.feature("live-markdown-preview", gts.liveMarkdownPreview, {
    elements: ["gts-live-markdown-preview"]
});

gts.app.feature("timeago", gts.timeago.periodic(60000), {
    elements: ["timeago"]
});

gts.app.feature("collapse", gts.collapse);

// Spin off app asynchronously so subsequent scripts have a chance
// to register loggers etc before we roll
setTimeout(function () {
    // Scan the document for data-gts-* attributes that set
    // "environment variables"
    gts.app.scanEnvAttrs(document.body, "data-gts-env-");
    gts.app.load(document.body);
}, 10);
