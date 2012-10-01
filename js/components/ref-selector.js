this.gts = this.gts || {};

this.gts.refSelector = (function () {
    function render(template, ref) {
        return (template || "#{ref}").replace(/#\{ref\}/g, ref);
    }

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

    function isType(type, refName, refs) {
        var i, l, typeRefs = refs[type] || [];
        for (i = 0, l = typeRefs.length; i < l; ++i) {
            if (typeRefs[i] === refName) { return true; }
        }
        return false;
    }

    function currentRefLink(refs, current) {
        var type = isType("heads", current, refs) ? "branch" :
                (isType("tags", current, refs) ? "tag" : "ref");
        return element("a", {
            href: "#",
            className: "dropdown-toggle",
            innerHTML: "<span class=\"caret\"></span> <em>" +
                type + ":</em> " + current
        });
    }

    function refInput(urlTemplate) {
        var li = element("li", {
            className: "gts-dropdown-input",
            innerHTML: "<strong>Enter ref: <form><input type=\"text\" " +
                "name=\"ref\" class=\"gts-ref-input\"></form></strong>"
        });
        jQuery(li).find("form").on("submit", function (e) {
            e.preventDefault();
            window.location = render(urlTemplate, this.firstChild.value);
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
            elements.push(element("li", {}, [
                element("a", {
                    href: render(urlTemplate, refs[i]),
                    innerHTML: refs[i]
                })]
            ));
        }
        return elements;
    }

    function refsList(refs, urlTemplate) {
        return element(
            "ul",
            { className: "dropdown-menu" },
            [refInput(urlTemplate)].
                concat(refItems("Branches", refs.heads || [], urlTemplate)).
                concat(refItems("Tags", refs.tags || [], urlTemplate)));
    }

    return function (refs, current, urlTemplate) {
        return element("div", {
            className: "dropdown gts-branch-selector pull-right"
        }, [currentRefLink(refs, current), refsList(refs, urlTemplate)]);
    };
}());