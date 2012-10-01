buster.testCase("Ref selector", {
    "returns div": function () {
        var element = gts.refSelector({});

        assert.tagName(element, "div");
        assert.className(element, "dropdown");
        assert.className(element, "gts-branch-selector");
    },

    "includes link to current branch": function () {
        var element = gts.refSelector({}, "master");
        var a = element.firstChild;

        assert.tagName(a, "a");
        assert.className(a, "dropdown-toggle");
        assert.match(a.innerHTML, "caret");
        assert.match(a.innerHTML, "branch:");
        assert.match(a.innerHTML, "master");
    },

    "includes link to current tag": function () {
        var element = gts.refSelector({ tags: ["v2.1.0"] }, "v2.1.0");

        assert.match(element.firstChild.innerHTML, "tag:");
    },

    "includes list of refs": function () {
        var element = gts.refSelector({});

        assert.tagName(element.childNodes[1], "ul");
        assert.className(element.childNodes[1], "dropdown-menu");
    },

    "includes ref input": function () {
        var list = gts.refSelector({}).childNodes[1];

        assert.className(list.firstChild, "gts-dropdown-input");
        assert.match(list.firstChild.innerHTML, "Enter ref:");
    },

    "links all heads": function () {
        var element = gts.refSelector({
            heads: ["libgit2", "master"],
            tags: ["v2.1.0", "v2.1.1"]
        }, "master");

        var list = element.childNodes[1];
        assert.className(list.childNodes[1], "dropdown-label");
        assert.match(list.childNodes[1].innerHTML, "Branches");
        assert.match(list.childNodes[2].innerHTML, "libgit2");
        assert.match(list.childNodes[3].innerHTML, "master");
    },

    "links all tags": function () {
        var element = gts.refSelector({
            heads: ["libgit2", "master"],
            tags: ["v2.1.0", "v2.1.1"]
        }, "master");

        var list = element.childNodes[1];
        assert.className(list.childNodes[4], "dropdown-label");
        assert.match(list.childNodes[4].innerHTML, "Tags");
        assert.match(list.childNodes[5].innerHTML, "v2.1.0");
        assert.match(list.childNodes[6].innerHTML, "v2.1.1");
    },

    "//does not propagate clicks on input": function () {},

    "uses URL template to generate links": function () {
        var element = gts.refSelector({
            heads: ["libgit2", "master"],
            tags: ["v2.1.0", "v2.1.1"]
        }, "master", "/dolt/#{ref}:");

        var list = element.childNodes[1];
        assert.match(list.childNodes[2].firstChild.href, "/dolt/libgit2:");
    }
});
