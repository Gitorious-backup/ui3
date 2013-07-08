/*global cull, dome, gts*/
this.gts = this.gts || {};

/**
 * Create, display and edit comments.
 */
this.gts.comments = (function (el) {
    function renderCommentDate(comment) {
        var created = this.gts.timeago(el.span({ title: comment.createdAt }));
        if (comment.createdAt === comment.updatedAt) { return created; }
        return el.span([
            created,
            "(edited ",
            this.gts.timeago(el.span({ title: comment.updatedAt })),
            ")"
        ]);
    }

    function renderEditForm(comment) {
        console.log("Edit");
    }

    function renderEditLink(comment) {
        if (!comment.editPath) { return ""; }
        var link = el.a({
            href: comment.editPath,
            events: {
                click: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    renderEditForm(link.parentNode.parentNode);
                }
            }
        }, "Edit comment");

        return link;
    }

    /**
     * Renders a comment object:
     * {
     *    body: "string",
     *    createdAt: "YYYY-MM-DDTHH:MM:SS+HH:00",
     *    updatedAt: "YYYY-MM-DDTHH:MM:SS+HH:00",
     *    author: {
     *        avatarPath: "/some/path.png",
     *        profilePath: "/~user",
     *        name: "string",
     *        login: "string"
     *    },
     *    editPath: "/if/available/to/current/user"
     * }
     */
    function renderComment(comment) {
        var author = comment.author;
        return el.div({ className: "gts-comment" }, [
            el.p({ innerHTML: comment.body }),
            el.p([
                el.img({ src: author.avatarPath }),
                el.a({ href: author.profilePath }, author.name),
                renderCommentDate(comment),
                renderEditLink(comment)
            ])
        ]);
    }

    function renderComments(comments, container) {
        if (comments.length === 0) { return; }
        container.style.display = "block";
        var inner = document.createElement("div");
        container.appendChild(inner);
        dome.setContent(cull.map(renderComment, comments), inner);
    }

    function zeroPad(num) {
        return num < 10 ? "0" + num : num;
    }

    /**
     * Personalizes an existing form with a user.
     * {
     *   name: "Christian Johansen",
     *   login: "christian",
     *   unreadMessageCount: 5,
     *   dashboardPath: "/",
     *   profilePath: "/~christian",
     *   editPath: "/~christian/edit",
     *   messagesPath: "/messages",
     *   logoutPath: "/logout",
     *   avatarPath: "/some/avatar.png"
     * }
     */
    function personalizeForm(user, form) {
        form.style.display = "block";
        var ph = dome.byClass("gts-comment-author-ph", form)[0];
        if (!ph) { return ph; }
        var now = new Date();

        return dome.replace(ph, el.p([
            el.img({ src: user.avatarPath }),
            el.a({ href: user.profilePath }, user.name),
            " " + zeroPad(now.getHours()) + ":" + zeroPad(now.getMinutes())
        ]));
    }

    return {
        renderComments: renderComments,
        renderComment: renderComment,
        personalizeForm: personalizeForm
    };
}(dome.el));
