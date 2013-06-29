/*global dome*/
this.gts = this.gts || {};

/**
 * Build the repository admin tab into the menu if the data indicates that the
 * current user can admin the repository. Initialize as a dropdown toggler if built.
 */
this.gts.repositoryAdmin = (function (el) {
    function bullet(type, text) {
        return [el.i({ className: type }), " " + text];
    }

    function link(href, type, text) {
        return el.a({ href: href }, bullet(type, text));
    }

    function build(data) {
        var children = [
            el.li(link(data.editPath, "icon-pencil", "Edit repository")),
            el.li(link(data.destroyPath, "icon-trash", "Delete repository")),
            el.li({ className: "divider" }),
            el.li(link(data.ownershipPath, "i", "Transfer ownership")),
            el.li(link(data.committershipsPath, "i", "Manage collaborators"))
        ];

        if (data.membershipsPath) {
            children.push(el.li(link(data.membershipsPath, "i", "Manage access")));
        }

        return el.li({ className: "pull-right dropdown" }, [
            el.a({
                href: "#",
                "data-toggle": "dropdown",
                className: "dropdown-toggle"
            }, bullet("icon-cog", "Admin")),
            el.ul({ className: "dropdown-menu" }, children)
        ]);
    }

    function repositoryAdmin(placeholder, data) {
        var toggler = build(data);
        placeholder.appendChild(toggler);
        this.gts.dropdown(toggler);

        if (dome.data.get("gts-active", placeholder) === "admin") {
            dome.cn.add("active", toggler);
        }
    }

    repositoryAdmin.build = build;
    return repositoryAdmin;
}(dome.el));
