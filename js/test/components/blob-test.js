/*global buster, assert, refute, jQuery, dome, gts*/

buster.testCase("Blob", {
    setUp: function () {
        this.el = dome.el("ol", [
            dome.el("li", { className: "L0" }, "First line"),
            dome.el("li", { className: "L1" }, "Second line"),
            dome.el("li", { className: "L2" }, "Third line"),
            dome.el("li", { className: "L3" }, "Fourth line")
        ]);
    },

    "regionFromUrl": {
        "extracts single line number": function () {
            var region = gts.blob.regionFromUrl("/some/url#l1");
            assert.equals(region, [1, 1]);
        },

        "extracts region": function () {
            var region = gts.blob.regionFromUrl("/some/url#l1-10");
            assert.equals(region, [1, 10]);
        },

        "extracts ordered region": function () {
            var region = gts.blob.regionFromUrl("/some/url#l29-8");
            assert.equals(region, [8, 29]);
        },

        "matches URL case-insensitively": function () {
            var region = gts.blob.regionFromUrl("/some/url#L9");
            assert.equals(region, [9, 9]);
        }
    },

    "highlightRegion": {
        "highlights first line": function () {
            gts.blob.highlightRegion(this.el, [1, 1]);
            assert.className(this.el.childNodes[0], "region");
            refute.className(this.el.childNodes[1], "region");
            refute.className(this.el.childNodes[2], "region");
            refute.className(this.el.childNodes[3], "region");
        },

        "highlights region": function () {
            gts.blob.highlightRegion(this.el, [2, 4]);
            refute.className(this.el.childNodes[0], "region");
            assert.className(this.el.childNodes[1], "region");
            assert.className(this.el.childNodes[2], "region");
            assert.className(this.el.childNodes[3], "region");
        },

        "un-highlights elements as region changes": function () {
            gts.blob.highlightRegion(this.el, [2, 4]);
            gts.blob.highlightRegion(this.el, [1, 2]);
            assert.className(this.el.childNodes[0], "region");
            assert.className(this.el.childNodes[1], "region");
            refute.className(this.el.childNodes[2], "region");
            refute.className(this.el.childNodes[3], "region");
        }
    },

    "trackFocus": {
        setUp: function () {
            // Required for event triggering to work
            document.body.appendChild(this.el);
            this.redirect = this.spy();
            gts.blob.trackFocus(this.el, this.redirect);
            var lines = this.el.getElementsByTagName("li");
            this.trigger = function (lineNum) {
                var line = jQuery(lines[lineNum]);
                line.trigger.apply(line, [].slice.call(arguments, 1));
            };
        },

        "selects first line as region": function () {
            this.trigger(0, "click");
            assert.className(this.el.childNodes[0], "region");
            assert.calledOnceWith(this.redirect, "#L1");
        },

        "selects discrete lines with multiple clicks": function () {
            this.trigger(0, "click");
            assert.className(this.el.childNodes[0], "region");

            this.trigger(1, "click");
            refute.className(this.el.childNodes[0], "region");
            assert.className(this.el.childNodes[1], "region");
        }
    }
});
