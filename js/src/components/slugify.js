/*global cull, dome, gts*/
this.gts = this.gts || {};

/**
 * Mirrors the value of one field onto another by converting it to a
 * slug/url-friendly string as the source is updated. If the target
 * has been manually edited, it is no longer automatically updated.
 */
this.gts.slugify = (function () {
    function toSlug(text) {
        return text.toLowerCase().replace(/[^a-z0-9_\-]+/g, "-").replace(/^\-|\-$/g, "");
    }

    function safeToOverwrite(source, target) {
        return target === "" || toSlug(source) === target;
    }

    return function slugify(source, target) {
        var currentSlugSource = source.value;

         function attemptOverwrite() {
            if (safeToOverwrite(currentSlugSource, target.value)) {
                target.value = toSlug(source.value);
                currentSlugSource = source.value;
            }
        }

        dome.on(source, "keyup", attemptOverwrite);
        dome.on(source, "focus", attemptOverwrite);
        attemptOverwrite();
    };
}());
