/*global buster, assert, dome, gts*/
buster.testCase("Comments", {
    "renderForm": {
        "renders comment div": function () {
            var div = gts.comments.renderComment({
                body: "<h2>Hey</h2>",
                createdAt: "2013-01-01T23:10:15+02:00",
                updatedAt: "2013-01-01T23:10:15+02:00",
                author: {
                    avatarUrl: "/some/avatar.png",
                    profilePath: "/~cjohansen",
                    name: "Christian Johansen",
                    login: "cjohansen"
                }
            });

            assert.tagName(div, "div");
            assert.className(div, "gts-comment");
            assert.equals(div.firstChild.firstChild.innerHTML, "Hey");
            assert.match(div.innerHTML, "/some/avatar.png");
            assert.match(div.innerHTML, "href=\"/~cjohansen\">Christian Johansen");
            assert.match(div.innerHTML, "2013");
            refute.match(div.innerHTML, "Edit comment");
            refute.match(div.innerHTML, "edited");
        },

        "renders editable comment": function () {
            var div = gts.comments.renderComment({
                body: "<h2>Hey</h2>",
                createdAt: "2013-01-01T23:10:15+02:00",
                updatedAt: "2013-01-01T23:10:15+02:00",
                editPath: "/comments/123456789/edit",
                author: {
                    avatarUrl: "/some/avatar.png",
                    profilePath: "/~cjohansen",
                    name: "Christian Johansen",
                    login: "cjohansen"
                }
            });

            assert.match(div.innerHTML, "/comments/123456789/edit");
            assert.match(div.innerHTML, "Edit comment");
        },

        "renders edited comment": function () {
            var div = gts.comments.renderComment({
                body: "<h2>Hey</h2>",
                createdAt: "2013-01-01T23:10:15+02:00",
                updatedAt: "2013-01-01T23:25:15+02:00",
                editPath: "/comments/123456789/edit",
                author: {
                    avatarUrl: "/some/avatar.png",
                    profilePath: "/~cjohansen",
                    name: "Christian Johansen",
                    login: "cjohansen"
                }
            });

            assert.match(div.innerHTML, "edited");
        }
    },

    "personalizeForm": {
        setUp: function () {
            this.form = dome.el("form", {
                style: { display: "none" }
            }, dome.el("div", { className: "gts-comment-author-ph" }));
        },

        "displays form": function () {
            gts.comments.personalizeForm(this.form, {});

            assert.equals(this.form.style.display, "block");
        },

        "renders user in placeholder": function () {
            this.useFakeTimers(new Date(2013, 0, 1, 12, 0, 0).getTime());

            gts.comments.personalizeForm(this.form, {
                login: "cjohansen",
                name: "Christian Johansen",
                avatarUrl: "/some/avatar.png",
                profilePath: "/~cjohansen"
            });

            assert.tagName(this.form.firstChild, "p");
            var markup = this.form.firstChild.innerHTML;
            assert.match(markup, "<img");
            assert.match(markup, "/some/avatar.png");
            assert.match(markup, "/~cjohansen");
            assert.match(markup, "Christian Johansen");
            assert.match(markup, "12:00");
        }
    },

    "renderComments": {
        "displays container": function () {
            var container = dome.el("div", { style: { display: "none" } });
            gts.comments.renderComments(container, [{ author: {} }]);

            assert.equals(container.style.display, "block");
        },

        "does not display container when no comments": function () {
            var container = dome.el("div", { style: { display: "none" } });
            gts.comments.renderComments(container, []);

            assert.equals(container.style.display, "none");
        },

        "renders all comments": function () {
            var container = dome.el("div", { style: { display: "none" } });
            gts.comments.renderComments(container, [{
                body: "One",
                createdAt: "2013-01-01T23:10:15+02:00",
                updatedAt: "2013-01-01T23:10:15+02:00",
                author: {
                    avatarUrl: "/some/avatar.png",
                    profilePath: "/~cjohansen",
                    name: "Christian Johansen",
                    login: "cjohansen"
                }
            }, {
                body: "Two",
                createdAt: "2013-01-01T23:10:15+02:00",
                updatedAt: "2013-01-01T23:10:15+02:00",
                author: {
                    avatarUrl: "/some/avatar.png",
                    profilePath: "/~cjohansen",
                    name: "Christian Johansen",
                    login: "cjohansen"
                }
            }]);

            assert.match(container.innerHTML, "One");
            assert.match(container.innerHTML, "Two");
        }
    }
});
