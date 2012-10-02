exports["Browser tests"] = {
    libs: [
        "dist/gts-ui-deps.js"
    ],
    sources: ["js/components/**/*.js"],
    tests: ["test/**/*-test.js"],
    extensions: [require("buster-html-doc")]
};
