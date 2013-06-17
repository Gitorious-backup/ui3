/*global buster, assert, gts*/

buster.testCase("Profile menu", {
    "does nothing when no user": function () {
        var el = document.createElement("div");
        gts.profileMenu(el, null);

        assert.equals(el.innerHTML, "");
    },

    "with user": {
        setUp: function () {
            this.el = document.createElement("div");
            var user = {
                dashboardPath: "/dashboard",
                login: "cjohansen",
                editPath: "/user/edit",
                messagesPath: "/messages",
                profilePath: "/~cjohansen",
                logoutPath: "/logout"
            };

            gts.profileMenu(this.el, user);
        },

        "adds button linking to dashboard": function () {
            assert.match(this.el.innerHTML, "href=\"/dashboard\">");
            assert.match(this.el.innerHTML, "cjohansen");
        },

        "adds dropdown button": function () {
            assert.match(this.el.innerHTML, "btn-inverse dropdown-toggle");
            assert.match(this.el.innerHTML, "span class=\"caret\"");
        },

        "adds dropdown menu": function () {
            var ul = this.el.getElementsByTagName("ul")[0];
            assert.className(ul, "dropdown-menu");
            assert.match(ul.innerHTML, "Edit");
            assert.match(ul.innerHTML, "Messages");
            assert.match(ul.innerHTML, "Dashboard");
            assert.match(ul.innerHTML, "Public profile");
            assert.match(ul.innerHTML, "Log out");
        }
    }
});
