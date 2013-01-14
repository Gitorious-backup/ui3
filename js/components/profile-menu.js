// The global, shared Gitorious namespace
var gts = this.gts || {};

/**
 * Builds the profile menu for the specified user and replaces the
 * login button. If there is no user, nothing happens.
 */
gts.profileMenu = function (root, user) {
    if (!user) { return; }

    var html = "<a class=\"btn btn-inverse\" href=\"" + user.dashboardPath +
            "\"><i class=\"icon-user icon-white\"></i> ~" + user.login + "</a>";

    html += "<a class=\"btn btn-inverse dropdown-toggle\" " +
        "data-toggle=\"dropdown\" href=\"#\"><span class=\"caret\"></span></a>";

    html += "<ul class=\"dropdown-menu\">" +
        "<li><a href=\"" + user.editPath + "\"><i class=\"icon-pencil\"></i> Edit</a></li>" +
        "<li><a href=\"" + user.messagesPath + "\"><i class=\"icon-envelope\"></i> Messages</a></li>" +
        "<li class=\"divider\"></li>" +
        "<li><a href=\"" + user.dashboardPath + "\"><i class=\"i\"></i> Dashboard</a></li>" +
        "<li><a href=\"" + user.profilePath + "\"><i class=\"i\"></i> Public profile</a></li>" +
        "<li><a href=\"" + user.logoutPath + "\"><i class=\"i\"></i> Log out</a></li>" +
        "</ul>";

    root.innerHTML = html;
};
