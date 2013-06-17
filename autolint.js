module.exports = {
    paths: ["js/src/**/*.js", "js/test/**/*.js"],
    linter: "jslint",
    linterOptions: {
        sloppy: true,
        vars: true,
        browser: true,
        plusplus: true,
        nomen: true,
        predef: []
    },
    excludes: []
};
