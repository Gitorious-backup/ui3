exports["Baseline"] = {
    rootPath: "js/",
    sources: ["src/components/**/*.js"],
    tests: ["test/**/*-test.js"],
    extensions: [require("buster-html-doc")]
};

exports["Build test"] = {
    extends: "Baseline",
    libs: ["dist/gts-ui-deps.js"]
};

exports["Browser tests"] = {
    extends: "Baseline",
    libs: [
        "lib/culljs/lib/cull.js",
        "lib/dome/lib/dome.js",
        "lib/dome/lib/event.js",
        "lib/spin.js/dist/spin.min.js"
    ]
};
