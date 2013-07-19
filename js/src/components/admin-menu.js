/*global cull, dome, gts*/
this.gts = this.gts || {};

this.gts.adminMenu = (function (el) {
    /**
     * Build the project admin tab into the menu if the data indicates that
     * the current user can admin the repository. Initialize as a dropdown
     * toggler if built.
     */
    function bullet(type, text) {
        return [el.i({ className: type }), " " + text];
    }

    function link(href, type, text) {
        return el.a({ href: href }, bullet(type, text));
    }

    function edit(path, text) {
        return el.li(link(path, "icon-pencil", text));
    }

    function destroy(path, text) {
        return el.li(link(path, "icon-trash", text));
    }

    function build(data, options) {
        options = options || {};

        var children = [
            el.li(link(options.editPath || data.editPath, "icon-pencil", options.editText)),
            el.li(link(options.destroyPath || data.destroyPath, "icon-trash", options.destroyText)),
            el.li({ className: "divider" })
        ].concat(cull.map(function (item) {
            return el.li(link(item[0], "i", item[1]));
        }, cull.select(function (item) {
            return !!item[0];
        }, options.items)));

        return el[options.tagName || "li"]({ className: "pull-right dropdown" }, [
            el.a({
                href: "#",
                "data-toggle": "dropdown",
                className: "dropdown-toggle"
            }, bullet("icon-cog", "Admin")),
            el.ul({ className: "dropdown-menu" }, children)
        ]);
    }

    function adminMenu(placeholder, data, options) {
        options.tagName = placeholder.tagName.toLowerCase();
        var toggler = build(data, options);
        dome.replace(placeholder, toggler);
        gts.dropdown(toggler);

        if (dome.data.get("gts-active", toggler.parentNode) === "admin") {
            dome.cn.add("active", toggler);
        }
    }

    adminMenu.build = build;
    return adminMenu;
}(dome.el));
