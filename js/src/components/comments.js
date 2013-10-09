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
            " (edited ",
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
     *        avatarUrl: "/some/path.png",
     *        profilePath: "/~user",
     *        name: "string",
     *        login: "string"
     *    },
     *    path: "some/file/diff",
     *    context: "context",
     *    firstLine: "1-0",
     *    lastLine: "2-0",
     *    editPath: "/if/available/to/current/user"
     * }
     */
    function renderComment(comment) {
        var author = comment.author;
        return el.div({ className: "gts-comment" }, [
            el.p({ innerHTML: comment.body }),
            el.p([
                el.img({
                    src: author.avatarUrl,
                    width: 24,
                    height: 24,
                    className: "gts-avatar"
                }),
                el.a({ href: author.profilePath }, author.name),
                " ",
                renderCommentDate(comment),
                " ",
                renderEditLink(comment)
            ])
        ]);
    }

    function cellIsLine(td, line, comparingTo) {
        if (line === 0) {
            if (!/(^|\s)L\d+(\s|$)/.test(td.className)) {
                return true;
            }
            line = comparingTo;
        }
        return dome.cn.has("L" + line, td);
    }

    /**
     * Predicate that checks if a table row represents a given line in a diff.
     * Region is a string representing a tuple, like "1-48", meaning "old line
     * 1, new line 48". When the first number is "0", it means that this is an
     * addition. When the second number is "0", it means this is a removal.
     */
    function isLine(region, row) {
        var tuple = region.split("-").map(function (n) {
            return parseInt(n, 10);
        });
        var lineNums = row.querySelectorAll(".linenum");
        if (!lineNums[0] || !lineNums[1]) { return; }
        return cellIsLine(lineNums[0], tuple[0], tuple[1]) &&
            cellIsLine(lineNums[1], tuple[1], tuple[0]);
    }

    function addDiffComment(ph, comment) {
        if (!ph) { return; }
        ph.appendChild(renderComment(comment));
    }

    function getDiffCommentPlaceholder(row, comment) {
        if (row.nextSibling && dome.cn.has("gts-diff-comment", row.nextSibling)) {
            return row.nextSibling.querySelector("td .gts-comments");
        }

        var lines = comment.firstLine ? comment.firstLine + ":" + comment.lastLine + "+0" : "";

        var placeholderCell = el.td([
            el.div({ className: "gts-comments" }),
            el.div({
                className: "gts-commentable",
                data: {
                    "gts-lines": lines,
                    "gts-context": comment.context,
                    "gts-path": comment.path
                }
            }),
            el.br(),
            el.br()
        ]);

        var firstRow = row.parentNode.getElementsByTagName("tr")[0];
        var width = firstRow.getElementsByTagName("td").length;
        var ph = el.tr({ className: "gts-diff-comment" });

        if (width === 3) {
            // 3 td elements => inline diffs
            // (old linenum, new linenum, diff)
            dome.append([el.td(), el.td(), placeholderCell], ph);
        } else {
            // 4 td elements => side-by-side diffs
            // (old linenum, old line, new linenum, new line)
            placeholderCell.setAttribute("colspan", "3");
            dome.append([el.td(), placeholderCell], ph);
        }

        if (row.nextSibling) {
            row.parentNode.insertBefore(ph, row.nextSibling);
        } else {
            row.appendChild(ph);
        }

        return placeholderCell.firstChild;
    }

    /**
     * Render any comments relating to this particular diff. The diff is a DOM
     * element with the following rough structure:
     *
     * <div class="gts-file" id="app/models/repository.rb">
     *   <ul class="pull-right gts-blob-view">
     *     <li class="active">Inline diffs</li>
     *     <li><a href="#">Side-by-side diff</a></li>
     *     <li><a href="#">Raw diff</a></li>
     *     <li><a href="#">Raw patch</a></li>
     *   </ul>
     *   <ul class="breadcrumb">
     *     <li class="gts-diff-summary">
     *       <a href="#"><i class="icon icon-file"></i> app/models/repository.rb</a>
     *       (<span class="gts-diff-add">+45</span>/<span class="gts-diff-rm">-22</span>)
     *     </li>
     *   </ul>
     *   <table class="gts-code-listing">
     *     <tr>
     *       <td class="linenum L45">45</td>
     *       <td class="linenum L45">45</td>
     *       <td class="gts-code"><code></code></td>
     *     </tr>
     *     ...
     *   </table>
     * </div>
     *
     * Diff comments is an object where the keys are file names and the values
     * are arrays of comments relating to the specific diff.
     */
    function renderDiffComments(diff, diffComments) {
        var link = diff.querySelector(".breadcrumb .gts-diff-summary a");
        var comments = link && diffComments[link.innerText.trim()]
        if (!comments || comments.length === 0) { return; }
        var rows = diff.getElementsByTagName("tr");

        cull.doall(function (comment) {
            var row = cull.first(cull.partial(isLine, comment.firstLine), rows);
            addDiffComment(getDiffCommentPlaceholder(row, comment), comment)
        }, comments);
    }

    function renderComments(container, comments) {
        if (comments.length === 0) { return; }
        container.style.display = "block";
        var inner = document.createElement("div");
        container.appendChild(inner);
        dome.setContent(cull.map(renderComment, comments), inner);
        dome.append([
            el.br(),
            el.div({ className: "gts-commentable" })
        ], inner);
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
     *   avatarUrl: "/some/avatar.png"
     * }
     */
    function personalizeForm(form, user) {
        form.style.display = "block";
        var ph = dome.byClass("gts-comment-author-ph", form)[0];
        if (!ph) { return ph; }
        var now = new Date();

        return dome.replace(ph, el.p([
            el.img({ src: user.avatarUrl, width: 24, height: 24 }),
            " ",
            el.a({ href: user.profilePath }, user.login),
            " " + zeroPad(now.getHours()) + ":" + zeroPad(now.getMinutes())
        ]));
    }

    function extractData(element, props) {
        return cull.reduce(function (data, prop) {
            var val = dome.data.get("gts-" + prop, element);
            if (!val) { return; }
            return data.concat(el.input({
                name: "comment[" + prop + "]",
                value: val,
                type: "hidden"
            }));
        }, [], props);
    }

    function updateCommentExtra(container, button) {
        dome.setContent(extractData(button, ["lines", "context", "path"]), container);
    }

    var currentlyCommenting;

    function enableCommenting(commentable, form, user) {
        var commentExtra = form.querySelector(".comment-extra");
        dome.append(el.button({
            className: "btn btn-primary",
            events: {
                click: function (e) {
                    if (currentlyCommenting) {
                        dome.cn.rm("hidden", currentlyCommenting);
                    }
                    updateCommentExtra(commentExtra, this.parentNode);
                    currentlyCommenting = this;
                    dome.cn.add("hidden", currentlyCommenting);
                    this.parentNode.appendChild(form);
                }
            }
        }, "Add comment"), commentable);
    }

    return {
        renderDiffComments: renderDiffComments,
        renderComments: renderComments,
        renderComment: renderComment,
        enableCommenting: enableCommenting,
        personalizeForm: personalizeForm
    };
}(dome.el));
