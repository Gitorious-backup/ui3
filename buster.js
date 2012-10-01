exports["Browser tests"] = {
    libs: [
        "js/libs/jquery.js",
        "lodash/lodash.min.js",
        "culljs/lib/cull.js",
        "js/libs/cullquery.js"
    ],
    sources: ["js/components/**/*.js"],
    tests: ["test/**/*-test.js"]
};
