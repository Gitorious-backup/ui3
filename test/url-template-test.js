buster.testCase("URL", {
    "templatize": {
        "returns only path": function () {
            var url = gts.url.templatize("http://localhost:3000/", {
                ref: "master"
            });
            assert.equals(url, "/");
        },

        "replaces matched value with template token": function () {
            var url = gts.url.templatize("http://localhost:3000/master/", {
                ref: "master"
            });

            assert.equals(url, "/#{ref}/");
        },

        "replaces all occurrences of value": function () {
            var url = gts.url.templatize("http://localhost:3000/master/some/master", {
                ref: "master"
            });

            assert.equals(url, "/#{ref}/some/#{ref}");
        },

        "replaces all values": function () {
            var url = gts.url.templatize("http://localhost:3000/master:lib/file.js", {
                ref: "master",
                path: "lib/file.js"
            });

            assert.equals(url, "/#{ref}:#{path}");
        }
    },

    "currentRef": {
        "extracts master from tree URL": function () {
            var ref = gts.url.currentRef("http://localhost/tree/master:lib");
            assert.equals(ref, "master");
        },

        "does not fail when no ref": function () {
            var ref = gts.url.currentRef("http://localhost/");
            assert.isNull(ref);
        },

        "extracts ref with slashes": function () {
            var ref = gts.url.currentRef("http://localhost/blob/refs/heads/something:");
            assert.equals(ref, "refs/heads/something");
        }
    }
});