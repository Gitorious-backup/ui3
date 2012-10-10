// $(".gts-select-onfocus").focus(function () {
//     this.select();
// });

$(".gts-repo-url").click(function (e) {
    e.preventDefault();
    var btn = $(this);
    var parent  = btn.parent();
    parent.find(".gts-repo-url").removeClass("active");
    btn.addClass("active");
    parent.find(".gts-current-repo-url").val(btn.attr("href")).focus();
});

// $(".linenums li").mouseenter(function () {
//     $(this).addClass("focus");
// });

// $(".linenums li").mouseleave(function () {
//     $(this).removeClass("focus");
// });

// (function () {
//     var fileEl = document.getElementById("file");
//     var matches = window.location.href.match(/\#l(\d+)(?:-(\d+))?/);
//     if (!fileEl || !matches) { return; }
//     var lines = fileEl.getElementsByTagName("li");
//     var end = Math.max(matches[2] || matches[1], matches[1]);

//     for (var i = matches[1]; i <= end; ++i) {
//         $(lines[i - 1]).addClass("focus");
//     }
// }());

jQuery("[rel=tooltip]").tooltip();

jQuery("[data-preview-target]").each(function () {
    var textarea = this;
    var target = document.getElementById(this.getAttribute("data-preview-target"));
    if (!target || !Showdown) { return; }
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
});

// Lest ye forget
/*
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-52238-3']);
_gaq.push(['_setDomainName', '.gitorious.org']);
_gaq.push(['_trackPageview']);
(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
})();
*/

var gts = this.gts || {};

// VERY TMP/TODO

this.gts.loadRefs = function (repo, callback) {
    repo = repo ? "/" + repo : "";

    jQuery.ajax({
        url: repo + "/refs",
        success: function (refs) {
            callback(null, refs);
        }
    });
};

gts.run = function (env) {
    var placeHolder = document.getElementById("gts-ref-selector-ph");

    if (placeHolder) {
        gts.loadRefs(env.repository, function (err, refs) {
            var selector = gts.refSelector(refs, env.ref, env.refUrlTemplate);
            placeHolder.appendChild(selector);
            $(selector).find(".dropdown-toggle").dropdown();
        });
    }

    var treeBrowser = $("table[data-gts-tree-history]");

    if (treeBrowser.length > 0) {
        gts.treeHistory(treeBrowser[0], treeBrowser.attr("data-gts-tree-history"));
    }
};

(function () {
    var ref = gts.url.currentRef(window.location.href);

    gts.run({
        repository: "",
        ref: ref,
        refUrlTemplate: gts.url.templatize(window.location.href, { ref: ref })
    });
}());
