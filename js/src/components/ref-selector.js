/*global cull, dome*/
// The global, shared Gitorious namespace
this.gts = this.gts || {};

/**
 * The ref selector builds an interactive "drop-down" menu from which the
 * user can select a head or tag, or lookup a specific ref. The menu will
 * reload the current page for the chosen ref.
 * 
 * gts.refSelector(refs, current, urlTemplate)
 * 
 * refs is an object containing available heads and tags and the oids they
 * refer to, e.g.:
 * 
 *     { "heads": [["production", "24e9c0d4ce36fbe1dfca4029e3bd206d64e2eecc"],
 *                 ["redesign", "4c22773401aa2cdd2391bc04443ad7eea193e7b6"],
 *                 ["web-hooks", "a08053012b9aee5d9733fceb2cf3083f29d9aa7d"],
 *                 ["master", "48ac677757da7ca052c59ebec0ded6e11eef2642"]],
 *       "tags": [["v2.4.3", "7a3cffcb3c3db89e8005962850e29a8aab2ab09b"]]
 *
 * current is the active ref on the current page, either the refname
 * or the actual oid.
 * 
 * urlTemplate is the URL that will be loaded, where the ref exists as a
 * placeholder, e.g. "/gitorious/mainline/source/#{ref}:lib". A suitable
 * template can be created from the current page's URL using
 * gts.url.templatize(window.location.href, { ref: currentRef });
 */
this.gts.refSelector = (function (e) {
    function tpl(template, ref) {
        return (template || "#{ref}").replace(/#\{ref\}/g, ref);
    }

    /**
     * Gets the current ref. type is {heads,tags,remotes} and
     * refs[type] is an array of ref tuples where each tuple contains
     * the object id and a ref (e.g. "master").
     */
    function getCurrent(type, refName, refs) {
        return cull.select(function (ref) {
            return ref[0] === refName || ref[1] === refName;
        }, refs[type] || [])[0];
    }

    function currentRefLink(refs, current) {
        var currentRef = getCurrent("heads", current, refs);
        var type = "branch";

        if (!currentRef) {
            currentRef = getCurrent("tags", current, refs);
            type = "tag";
        }

        if (!currentRef) {
            type = "ref";
        }

        return e.a({
            href: "#",
            className: "dropdown-toggle",
            innerHTML: "<span class=\"caret\"></span> <em>" +
                type + ":</em> " + ((currentRef && currentRef[0]) || current)
        });
    }

    function refInput(url) {
        var input = e.input({ type: "text", className: "gts-ref-input" });
        var form = e.form({
            className: "gts-ref-input",
            events: {
                submit: function (e) {
                    e.preventDefault();
                    window.location = tpl(url, input.value);
                }
            }
        }, [input]);

        return e.li({
            className: "gts-dropdown-input",
            events: { click: function (e) { e.stopPropagation(); } }
        }, [e.strong(["Enter ref: ", form])]);
    }

    function refItems(label, refs, urlTemplate) {
        var initial = [e.li({className: "dropdown-label"}, [e.strong(label)])];
        return cull.reduce(function (elements, ref) {
            var url = tpl(urlTemplate, ref[1]);
            elements.push(e.li(e.a({ href: url }, ref[0])));
            return elements;
        }, initial, refs.sort());
    }

    function refsList(refs, urlTemplate) {
        return e.ul({ className: "dropdown-menu" },
                    [refInput(urlTemplate)].
                    concat(refItems("Branches", refs.heads || [], urlTemplate)).
                    concat(refItems("Tags", refs.tags || [], urlTemplate)));
    }

    function build(refs, current, urlTemplate) {
        return e.div({
            className: "dropdown gts-branch-selector pull-right"
        }, [currentRefLink(refs, current), refsList(refs, urlTemplate)]);
    }

    function refSelector(placeholder, refs, ref, refUrlTemplate) {
        var selector = build(refs, ref, refUrlTemplate);
        placeholder.parentNode.insertBefore(selector, placeholder);
        placeholder.parentNode.removeChild(placeholder);
        this.gts.dropdown(selector);
    }

    refSelector.build = build;
    refSelector.getCurrentRef = getCurrent;
    return refSelector;
}(dome.el));
