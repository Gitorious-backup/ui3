/*global dome, gts*/
this.gts = this.gts || {};

/**
 * Mirrors the value of one field onto another by converting it to a
 * slug/url-friendly string as the source is updated. If the target
 * has been manually edited, it is no longer automatically updated.
 */
this.gts.slugify = (function () {
    function toSlug(text) {
        return text.toLowerCase().replace(/[^a-z0-9_\-]+/g, "-");
    }

    function safeToOverwrite(source, target) {
        return target.value === "" || toSlug(source.value) === target.value;
    }

    return function slugify(source, target) {
        var isLocked = safeToOverwrite(source, target);

        function attemptOverwrite() {
            if (!isLocked) {
                target.value = toSlug(source.value);
            }
        }

        dome.on(source, "keydown", function () {
            isLocked = safeToOverwrite(source, target);
        });

        dome.on(source, "keyup", attemptOverwrite);
        attemptOverwrite();
    };
}());
