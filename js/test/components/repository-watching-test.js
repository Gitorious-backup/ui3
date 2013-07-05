/*global buster, dome, gts*/

buster.testCase("Repository watching", {
    setUp: function () {
        this.el = dome.el("div", dome.el("div"));
    },

    "replaces placeholder": function () {
        gts.repository.watching(this.el.firstChild, {
            watching: false,
            watchPath: "/watchit"
        });

        assert.equals(this.el.childNodes.length, 1);
        assert.match(this.el.firstChild.innerHTML, "Watch");
        assert.match(this.el.firstChild.href, "/watchit");
    },

    "renders unwatch link": function () {
        gts.repository.watching(this.el.firstChild, {
            watching: true,
            unwatchPath: "/dropit"
        });

        assert.match(this.el.firstChild.innerHTML, "Unwatch");
        assert.match(this.el.firstChild.href, "/dropit");
    },

    "toggleState": {
        setUp: function () {
            this.server = this.useFakeServer();
            this.link = this.el.firstChild;
            this.repository = {
                watching: false,
                watchPath: "/watchit"
            };
            gts.repository.watching(this.link, this.repository);
        },

        "displays spinner while loading": function () {
            gts.repository.watching.toggleState(this.link, this.repository);

            assert.match(this.link.innerHTML, "Loading");
        },

        "replaces spinner when server responds": function () {
            gts.repository.watching.toggleState(this.link, this.repository);
            this.server.requests[0].respond(200, { location: "/dropit" }, "");

            refute.match(this.link.innerHTML, "Loading");
            assert.match(this.link.innerHTML, "Unwatch");
            assert.equals(this.link.href, "/dropit");
        },

        "watches, then unwatches": function () {
            gts.repository.watching.toggleState(this.link, this.repository);
            this.server.requests[0].respond(200, { location: "/dropit" }, "");

            gts.repository.watching.toggleState(this.link, this.repository);
            this.server.requests[1].respond(200, {}, "");

            refute.match(this.link.innerHTML, "Loading");
            assert.match(this.link.innerHTML, "Watch");
            assert.equals(this.link.href, "/watchit");
        },

        "tells user to try again when request fails": function () {
            gts.repository.watching.toggleState(this.link, this.repository);
            this.server.requests[0].respond(500, {}, "");

            assert.match(this.link.innerHTML, "Failed");
        }
    }
});
