this.gts = this.gts || {};

this.gts.refSelector = (function () {
    function element(tagName, attrs, children) {
        var el = document.createElement(tagName);

        for (var prop in attrs) {
            el[prop] = attrs[prop];
        }

        children = children || [];
        for (var i = 0, l = children.length; i < l; ++i) {
            el.appendChild(children[i]);
        }

        return el;
    }

    function isBranch(refName, refs) {
        var i, l, tags = refs.tags || [];
        for (i = 0, l = tags.length; i < l; ++i) {
            if (tags[i] === refName) { return false; }
        }
        return true;
    }

    function currentRefLink(refs, current) {
        var type = isBranch(current, refs) ? "branch" : "tag";
        return element("a", {
            href: "#",
            className: "dropdown-toggle",
            innerHTML: "<span class=\"caret\"></span> <em>" +
                type + ":</em> " + current
        });
    }

    function refInput() {
        var li = element("li", {
            className: "gts-dropdown-input",
            innerHTML: "<strong>Enter ref: <input type=\"text\" " +
                "name=\"ref\" class=\"gts-ref-input\"></strong>"
        });
        li.onclick = function (e) { e.stopPropagation(); };
        return li;
    }

    function refItems(label, refs, urlTemplate) {
        var i, l, elements = [];
        elements.push(element("li", {
            className: "dropdown-label",
            innerHTML: "<strong>" + label + "</strong>"
        }));
        for (i = 0, l = refs.length; i < l; ++i) {
            elements.push(element("a", {
                href: (urlTemplate || "#{ref}").replace(/#\{ref\}/g, refs[i]),
                innerHTML: refs[i]
            }));
        }
        return elements;
    }

    function refsList(refs, urlTemplate) {
        return element(
            "ul",
            { className: "dropdown-menu" },
            [refInput()].
                concat(refItems("Branches", refs.branches || [], urlTemplate)).
                concat(refItems("Tags", refs.tags || [], urlTemplate)));
    }

    return function (refs, current, urlTemplate) {
        return element("div", {
            className: "dropdown gts-branch-selector pull-right"
        }, [currentRefLink(refs, current), refsList(refs, urlTemplate)]);
    };
}());