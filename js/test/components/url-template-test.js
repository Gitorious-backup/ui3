/*global buster, assert, refute, jQuery, gts*/
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
            var url = "http://localhost:3000/master/some/master";
            var template = gts.url.templatize(url, {
                ref: "master"
            });

            assert.equals(template, "/#{ref}/some/#{ref}");
        },

        "replaces all values": function () {
            var url = "http://localhost:3000/master:lib/file.js";
            var template = gts.url.templatize(url, {
                ref: "master",
                path: "lib/file.js"
            });

            assert.equals(template, "/#{ref}:#{path}");
        }
    },

    "render": {
        "renders templated URL": function () {
            var template = "/gitorious/mainline/source/#{ref}:#{path}";
            var url = gts.url.render(template, { ref: "master", path: "." });

            assert.equals("/gitorious/mainline/source/master:.", url);
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
            var url = "http://localhost/blob/refs/heads/something:";
            var ref = gts.url.currentRef(url);
            assert.equals(ref, "refs/heads/something");
        }
    }
});