/*global cull*/
this.gts = this.gts || {};

this.gts.refSelector = (function () {
    var e = cull.dom.el;

    function tpl(template, ref) {
        return (template || "#{ref}").replace(/#\{ref\}/g, ref);
    }

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
                type + ":</em> " + (currentRef && currentRef[0] || current)
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
        var initial = [e.li({ className: "dropdown-label" }, [e.strong(label)])];
        return cull.reduce(function (elements, ref) {
            elements.push(e.li(e.a({ href: tpl(urlTemplate, ref[1]) }, ref[0])));
            return elements;
        }, initial, refs.sort());
    }

    function refsList(refs, urlTemplate) {
        return e.ul({ className: "dropdown-menu" },
                    [refInput(urlTemplate)].
                    concat(refItems("Branches", refs.heads || [], urlTemplate)).
                    concat(refItems("Tags", refs.tags || [], urlTemplate)));
    }

    return function (refs, current, urlTemplate) {
        return e.div({
            className: "dropdown gts-branch-selector pull-right"
        }, [currentRefLink(refs, current), refsList(refs, urlTemplate)]);
    };
}());
