/*global buster, assert, dome, gts*/

buster.testCase("Live markdown preview", {
    setUp: function () {
        var el = dome.el("div", [
            dome.el("textarea"),
            dome.el("div", { id: "target" }, [dome.el("div")])
        ]);

        document.body.appendChild(el);
        this.textarea = el.firstChild;
        this.textarea.setAttribute("data-gts-preview-target", "target");
        this.target = el.lastChild.firstChild;
        this.clock = this.useFakeTimers();
    },

    "renders markdown as html in div": function () {
        gts.liveMarkdownPreview(this.textarea);
        this.textarea.innerHTML = "*hey*";

        this.clock.tick(50);

        assert.match(this.target.innerHTML, "<em>hey</em>");
    },

    "updates rendered html": function () {
        gts.liveMarkdownPreview(this.textarea);
        this.textarea.innerHTML = "*hey*";
        this.clock.tick(50);

        this.textarea.innerHTML = "# OH!";
        this.clock.tick(50);

        refute.match(this.target.innerHTML, "<em>hey</em>");
        assert.match(this.target.innerHTML, /<h1.*>OH!<\/h1>/);
    }
});
