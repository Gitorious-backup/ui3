/*global dome, gts*/

/**
 * A very simplified version of bootstrap's collapse - toggles the "in" class on
 * "collapse" elements when the associated trigger is clicked. Attaches a single
 * click listener to the body.
 */
this.gts.collapse = function () {
    dome.on(document.body, "click", function (e) {
        if (dome.data.get("toggle", e.target) !== "collapse") { return; }
        var target = dome.id(dome.data.get("target", e.target).slice(1));
        if (!target) { return; }
        dome.cn[dome.cn.has("in", target) ? "rm" : "add"]("in", target);
        e.preventDefault();
        e.stopPropagation();
    });
};
