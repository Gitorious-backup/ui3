/*global cull*/
this.gts = this.gts || {};

this.gts.refSelector = (function () {
    var e = cull.dom.el;

    function tpl(template, ref) {
        return (template || "#{ref}").replace(/#\{ref\}/g, ref);
    }

    function isType(type, refName, refs) {
        return cull.some(function (ref) {
            return ref === refName;
        }, refs[type] || []);
    }

    function currentRefLink(refs, current) {
        var type = isType("heads", current, refs) ? "branch" :
                (isType("tags", current, refs) ? "tag" : "ref");
        return e.a({
            href: "#",
            className: "dropdown-toggle",
            innerHTML: "<span class=\"caret\"></span> <em>" +
                type + ":</em> " + current
        });
    }

    function refInput(url) {
        var input = e.input({ type: "text", className: "gts-ref-input" });
        var form = e.form({
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
            elements.push(e.li(e.a({ href: tpl(urlTemplate, ref) }, ref)));
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
