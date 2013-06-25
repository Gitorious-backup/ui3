/*global buster, assert, dome, gts*/
function zp(num) {
    return num < 10 ? "0" + num : num;
}

function toStr(date) {
    return date.getFullYear() + "-" + zp(date.getMonth() + 1) + "-" +
        zp(date.getDate()) + "T" + zp(date.getHours()) + ":" +
        zp(date.getMinutes()) + ":" + zp(date.getSeconds()) + "Z";
}

buster.testCase("Timeago", {
    "converts abbr content to casual date representation": function () {
        var el = dome.el("abbr", { title: "2008-02-27T00:23:00Z" });
        gts.timeago(el);
        assert.match(el.innerHTML, "ago");
    },

    "uses pre-existing content as title": function () {
        var el = dome.el("abbr", { title: "2008-02-27T00:23:00Z" }, "Today");
        gts.timeago(el);
        assert.match(el.title, "Today");
    },

    "does not use empty content as title": function () {
        var el = dome.el("abbr", { title: "2008-02-27T00:23:00Z" });
        gts.timeago(el);
        assert.match(el.title, "2008-02-27T00:23:00Z");
    },

    "leaves element untouched if no title": function () {
        var el = dome.el("abbr", "Hmm");
        gts.timeago(el);
        assert.equals(el.title, "");
        assert.equals(el.innerHTML, "Hmm");
    },

    "leaves element untouched if title contains invalid date": function () {
        var el = dome.el("abbr", { title: "Oops" }, "Hmm");
        gts.timeago(el);
        assert.equals(el.title, "Oops");
        assert.equals(el.innerHTML, "Hmm");
    },

    "periodically updates date representations": function () {
        var clock = this.useFakeTimers();
        var els = [
            dome.el("abbr", { title: toStr(new Date(0)) }),
            dome.el("abbr", { title: toStr(new Date(60000)) })
        ];

        var timeago = gts.timeago.periodic(60000);
        timeago(els[0]);
        timeago(els[1]);
        var contents = [els[0].innerHTML, els[1].innerHTML];

        clock.tick(59999);
        assert.equals(els[0].innerHTML, contents[0]);
        assert.equals(els[1].innerHTML, contents[1]);

        clock.tick(1);
        refute.equals(els[0].innerHTML, contents[0]);
        refute.equals(els[1].innerHTML, contents[1]);
    }
});
