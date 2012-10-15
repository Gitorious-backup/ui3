buster.testCase("Ref selector", {
    "returns div": function () {
        var element = gts.refSelector({});

        assert.tagName(element, "div");
        assert.className(element, "dropdown");
        assert.className(element, "gts-branch-selector");
    },

    "includes link to current branch": function () {
        var element = gts.refSelector({ heads: ["master"] }, "master");
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

    "includes link to current ref": function () {
        var element = gts.refSelector({ tags: ["v2.1.0"] }, "aabbcc4");

        assert.match(element.firstChild.innerHTML, "ref:");
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

    "sorts refs alpha-numerically": function () {
        var element = gts.refSelector({
            "heads": ["feature-B", "master", "feature-A"],
            "tags": ["0.7.0", "0.7.1", "1.3.1", "1.0.0"]
        });

        var list = element.childNodes[1];
        assert.match(list.childNodes[2].innerHTML, "feature-A");
        assert.match(list.childNodes[3].innerHTML, "feature-B");
        assert.match(list.childNodes[4].innerHTML, "master");
        assert.match(list.childNodes[6].innerHTML, "0.7.0");
        assert.match(list.childNodes[7].innerHTML, "0.7.1");
        assert.match(list.childNodes[8].innerHTML, "1.0.0");
        assert.match(list.childNodes[9].innerHTML, "1.3.1");
    },

    "does not propagate clicks on input": function () {
        var element = gts.refSelector({
            heads: ["libgit2", "master"],
            tags: ["v2.1.0", "v2.1.1"]
        }, "master");

        var event = jQuery.Event("click");
        event.stopPropagation = this.spy();
        jQuery(element).find("input[type=text]").trigger(event);

        assert.calledOnce(event.stopPropagation);
    },

    "uses URL template to generate links": function () {
        var element = gts.refSelector({
            heads: ["libgit2", "master"],
            tags: ["v2.1.0", "v2.1.1"]
        }, "master", "/dolt/#{ref}:");

        var list = element.childNodes[1];
        assert.match(list.childNodes[2].firstChild.href, "/dolt/libgit2:");
    }
});
