buster.testCase("Commit linker", {
    "triggers handler for gts-commit-oid link": function () {
        var callback = this.spy();
        var el = document.createElement("div");
        el.innerHTML = "<span class=\"gts-commit-oid\" data-gts-commit-oid=\"master\">master</span>";

        gts.commitLinker(el, "/gitorious/mainline/commit/#{oid}", callback);
        jQuery(el.firstChild).trigger("click");

        assert.calledOnceWith(callback, "/gitorious/mainline/commit/master");
    },

    "does not trigger handler for regular link": function () {
        var callback = this.spy();
        var el = document.createElement("div");
        el.innerHTML = "<span>master</span>";

        gts.commitLinker(el, "/gitorious/mainline/commit/#{oid}", callback);
        jQuery(el.firstChild).trigger("click");

        refute.called(callback);
    },

    "triggers handler for link added later": function () {
        var callback = this.spy();
        var el = document.createElement("div");

        gts.commitLinker(el, "/gitorious/mainline/commit/#{oid}", callback);
        el.innerHTML = "<span class=\"gts-commit-oid\" data-gts-commit-oid=\"master\">master</span>";
        jQuery(el.firstChild).trigger("click");

        assert.calledOnce(callback);
    },

    "adds class name to root element": function () {
        var el = document.createElement("div");
        gts.commitLinker(el, "/gitorious/mainline/commit/#{oid}");

        assert.className(el, "gts-commit-linker");
    }
});
