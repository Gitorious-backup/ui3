/*global cull, dome*/
this.gts = this.gts || {};

/**
 * When clicking clone URLs, copy them to the related input field.
 */
this.gts.cloneUrlSelection = (function () {
    function selectCloneUrl(element, selected) {
        var links = dome.byClass("gts-repo-url", element);
        cull.doall(cull.partial(dome.cn.rm, "active"), links);
        if (selected) {
            dome.cn.add("active", selected);
            var input = dome.byClass("gts-current-repo-url", element)[0];
            input.value = selected.getAttribute("href").replace("ssh://", "");
            input.focus();
        }
    }

    function cloneUrlSelection(element) {
        var input = element.getElementsByTagName("input")[0];

        if (input) {
            dome.on(input, "focus", function (e) { this.select(); });
        }

        dome.delegate.bycn("gts-repo-url", element, "click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            selectCloneUrl(element, e.target);
        });
    }

    cloneUrlSelection.select = selectCloneUrl;
    return cloneUrlSelection;
}());
