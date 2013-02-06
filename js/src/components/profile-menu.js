/*global cull*/
// The global, shared Gitorious namespace
var gts = this.gts || {};

/**
 * Builds the profile menu for the specified user and replaces the
 * login button. If there is no user, nothing happens.
 */
(function (e) {
    function button(text, path, icon) {
        var content = icon ? [e.i({className: "icon-" + icon}), text] : [text];
        return e.li(e.a({ href: path }, content));
    }

    gts.profileMenu = function (root, user) {
        if (!user) { return; }
        e.content([
            e.a({ className: "btn btn-inverse", href: user.dashboardPath },
                e.i({ className: "icon-user icon-white" }, user.login)),
            e.a({ className: "btn btn-inverse dropdown-toggle",
                  href: "#",
                  data: { toggle: "dropdown" }
                }, e.span({ className: "caret" }, " ")),
            e.ul({ className: "dropdown-menu" }, [
                button("Edit", user.editPath, "pencil"),
                button("Messages", user.messagesPath, "envelope"),
                e.li({ className: "divider" }),
                button("Dashboard", user.dashboardPath),
                button("Public profile", user.profilePath),
                button("Log out", user.logoutPath)
            ])
        ], root);
    };
}(cull.dom.el));
