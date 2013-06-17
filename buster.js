exports["Baseline"] = {
    sources: ["js/src/components/**/*.js"],
    testHelpers: ["js/test-libs/*.js"],
    tests: ["js/test/**/*-test.js"],
    extensions: [require("buster-html-doc")]
};

exports["Build test"] = {
    extends: "Baseline",
    libs: ["dist/gitorious3.min.js"]
};

exports["Browser tests"] = {
    extends: "Baseline",
    libs: [
        "js/lib/culljs/lib/cull.js",
        "js/lib/dome/lib/dome.js",
        "js/lib/dome/lib/event.js",
        "js/lib/spin.js/spin.js",
        "js/lib/when/when.js",
        "js/lib/bane/lib/bane.js",
        "js/lib/reqwest/reqwest.js",
        "js/lib/uinit/lib/uinit.js",
        "js/lib/showdown/src/showdown.js"
    ]
};
