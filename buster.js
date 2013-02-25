exports["Baseline"] = {
    sources: ["js/src/app.js", "js/src/components/**/*.js"],
    testHelpers: ["js/test-libs/*.js"],
    tests: ["js/test/**/*-test.js"],
    extensions: [require("buster-html-doc")]
};

exports["Build test"] = {
    extends: "Baseline",
    libs: ["dist/gts-ui-deps.js"]
};

exports["Browser tests"] = {
    extends: "Baseline",
    libs: [
        "js/lib/when/when.js",
        "js/lib/bane/lib/bane.js",
        "js/lib/culljs/lib/cull.js",
        "js/lib/dome/lib/dome.js",
        "js/lib/dome/lib/event.js",
        "js/lib/spin.js/dist/spin.min.js"
    ]
};
