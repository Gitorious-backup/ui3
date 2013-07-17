/*global gts, cull, reqwest*/

// Environment variables
gts.app.env("url", window.location.href);
gts.app.env("redirect", function (url) { window.location = url; });

if (window.hasOwnProperty("onpopstate")) {
    window.onpopstate = function (event) {
        gts.app.env("url", window.location.href);
    };
}

gts.request = function (options) {
    options.headers = options.headers || {};
    options.headers["X-CSRF-Token"] = gts.app.env["csrf-token"];
    reqwest(options);
};

(function () {
    var input = document.getElementById("project_title");
    if (input) { gts.app.env("project-title-input", input); }
    input = document.getElementById("project_slug");
    if (input) { gts.app.env("project-slug-input", input); }
}());

// Data
gts.app.data("ref-url-template", function (url, ref) {
    return gts.url.templatize(url, { ref: ref });
}, {
    depends: ["url", "current-ref"],
    serializeArgs: function (url, ref) { return [url.split("#")[0], ref]; }
});

gts.app.data("repository-refs", gts.jsonRequest, { depends: ["repository-refs-url"] });
gts.app.data("current-ref", gts.url.currentRef, { depends: ["url"] });
gts.app.data("user-view-state", gts.cache(gts.jsonRequest), {
    depends: ["user-view-state-path"]
});
gts.app.data("current-user", cull.prop("user"), { depends: ["user-view-state"] });
gts.app.data("repository-view-state", gts.cache(gts.jsonRequest), {
    depends: ["repository-view-state-path"]
});
gts.app.data("current-repository", cull.prop("repository"), {
    depends: ["repository-view-state"]
});
gts.app.data("repository-watch", cull.prop("watch"), {
    depends: ["current-repository"]
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

gts.app.feature("dropdown", gts.dropdown, {
    elements: ["dropdown"]
});

gts.app.feature("ref-selector", gts.refSelector, {
    elements: ["gts-ref-selector-ph"],
    depends: ["repository-refs", "current-ref", "ref-url-template"]
});

gts.app.feature("oid-ref-interpolator", gts.oidRefInterpolator, {
    elements: ["gts-oid"],
    depends: ["repository-refs", "ref-url-template"]
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

gts.app.feature("clone-name-suggestion", gts.cloneNameSuggestion, {
    elements: ["clone-repository-form"]
});

gts.app.feature("loading", gts.loading, {
    elements: ["loading"]
});

gts.app.feature("rails-links", gts.railsLinks, {
    depends: ["csrf-param", "csrf-token"]
});

gts.app.feature("repository-admin-menu", gts.repository.admin, {
    elements: ["gts-repository-admin-ph"],
    depends: ["repository-admin"]
});

gts.app.feature("repository-watching", gts.repository.watching, {
    elements: ["gts-watch-repository-ph"],
    depends: ["repository-watch"]
});

gts.app.feature("repository-cloning", gts.repository.cloning, {
    elements: ["gts-clone-repository-ph"],
    depends: ["current-repository"]
});

gts.app.feature("repository-merge-request", gts.repository.mergeRequest, {
    elements: ["gts-request-merge-ph"],
    depends: ["current-repository"]
});

gts.app.feature("slugify-project-title", gts.slugify, {
    depends: ["project-title-input", "project-slug-input"]
});

gts.app.feature("select-details", gts.selectDetails, {
    elements: ["gts-option-details"]
});

// Spin off app asynchronously so subsequent scripts have a chance
// to register loggers etc before we roll
setTimeout(function () {
    // Scan the document for data-gts-* attributes that set
    // "environment variables"
    gts.app.scanEnvAttrs(document.body, "data-gts-env-");
    gts.app.load(document.documentElement);
}, 10);
