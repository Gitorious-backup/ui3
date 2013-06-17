/*global cull, dome*/
this.gts = this.gts || {};

/**
 * When clicking clone URLs, copy them to the related input field.
 */
this.gts.cloneUrlSelection = function cloneUrlSelection(element) {
    var input = element.getElementsByTagName("input")[0];

    if (input) {
        dome.on(input, "focus", function (e) { this.select(); });
    }

    dome.delegate.bycn("gts-repo-url", element, "click", function (e) {
        e.preventDefault();
        var links = dome.byClass("gts-repo-url", element);
        cull.doall(cull.partial(dome.cn.rm, "active"), links);
        if (e.target) {
            dome.cn.add("active", e.target);
            var input = dome.byClass("gts-current-repo-url")[0];
            input.value = e.target.href;
            input.focus();
        }
    });
};
