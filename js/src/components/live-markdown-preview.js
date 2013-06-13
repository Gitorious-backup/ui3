/*global Showdown*/
this.gts.liveMarkdownPreview = function liveMarkdownPreview(textarea) {
    var target = document.getElementById(textarea.getAttribute("data-gts-preview-target"));
    if (!target || typeof Showdown === "undefined") { return; }
    var converter = new Showdown.converter();
    var previous, content;

    var cageSeed = new Date().getTime();

    function zeroPad(num) {
        return num < 10 ? "0" + num : num;
    }

    function signature() {
        var now = new Date();
        return "<p>" +
            "<img width=\"24\" height=\"24\" class=\"gts-avatar\" alt=\"avatar\" src=\"http://cageme.herokuapp.com/24/24?" +
            cageSeed + "\">" +
            "<a href=\"/~zmalltalker\">Marius Mathiesen</a>" +
            zeroPad(now.getHours()) + ":" + zeroPad(now.getMinutes()) +
            ". <a href=\"#\">Edit comment</a></p>";
    }

    function setPreview(preview) {
        target.style.display = preview ? "block" : "none";
        target.getElementsByTagName("div")[0].innerHTML = preview;
    }

    function updatePreview() {
        content = textarea.value;
        if (content !== previous) {
            previous = content;
            setPreview(converter.makeHtml(content));
        }
        setTimeout(updatePreview, 20);
    }

    updatePreview();
};
