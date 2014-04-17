/*global cull, dome, gts*/
this.gts = this.gts || {};

/**
 * Create, display and edit comments.
 */
this.gts.comments = (function (el) {

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
    function isLine(row, comment) {
        var region = comment.firstLine;

        var tuple = region.split("-").map(function (n) {
            return parseInt(n, 10);
        });
        var lineNums = row.querySelectorAll(".linenum");
        if (!lineNums[0] || !lineNums[1]) { return; }
        return cellIsLine(lineNums[0], tuple[0], tuple[1]) &&
            cellIsLine(lineNums[1], tuple[1], tuple[0]);
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
    function renderDiffComments(diff, diffComments, userViewState, createCommentUrl) {
        var user = userViewState.user;
        var path = diff.querySelector(".breadcrumb .gts-diff-summary .gts-path");
        var allComments = path && diffComments[path.innerHTML] || [];

        if (!user) {
            createCommentUrl = null;
        }

        var rows = diff.querySelectorAll('tr.gts-diff-add, tr.gts-diff-rm, tr.gts-diff-mod');

        cull.doall(function(row) {
            initializeDiffRow(row, allComments, user, createCommentUrl);
        }, rows);
    }

    function initializeDiffRow(row, allComments, user, createCommentUrl) {
        var comments = cull.select(cull.partial(isLine, row), allComments);
        var commentsTr = el.tr({ className: "gts-diff-comment" });
        commentsTr.appendChild(el.td());
        commentsTr.appendChild(el.td());
        var td = el.td();
        commentsTr.appendChild(td);
        row.parentNode.insertBefore(commentsTr, row.nextSibling);

        var component;

        if (comments.length > 0) {
            component = mountInlineCommentsSection(row, td, comments, createCommentUrl);
        }

        if (user) {
            dome.on(row, "mouseenter", cull.partial(showCommentButton, user, function() {
                if (!component) {
                    component = mountInlineCommentsSection(row, td, comments, createCommentUrl);
                }
                component.toggleForm();
            }));

            dome.on(row, "mouseleave", hideCommentButton);
        }
    }

    function mountInlineCommentsSection(row, td, comments, createCommentUrl) {
        var line = getDiffLine(row);
        var lines = line ? line + ":" + line + "+0" : "";

        var component = InlineCommentsSection({
            comments:         comments,
            lines:            lines,
            context:          getDiffContext(row),
            path:             getDiffPath(row),
            createCommentUrl: createCommentUrl
        });

        return React.renderComponent(component, td);
    }

    function renderComments(container, comments, user, createCommentUrl) {
        var component = CommentsSection({
            comments:         comments,
            createCommentUrl: createCommentUrl
        });

        React.renderComponent(component, container.querySelector('.comments-container'));
    }

    function getDiffLine(row) {
        return cull.map(function (ln) {
            var m = ln.innerHTML.match(/\d+/);
            return m && m[0] || "0";
        }, row.querySelectorAll(".linenum")).join("-");
    }

    function getDiffPath(row) {
        var container = row.parentNode.parentNode.parentNode.parentNode;
        return container.querySelector(".gts-path").innerHTML;
    }

    function diffPrefixFromClassName(element) {
        if (dome.cn.has("gts-diff-rm", element)) { return "-"; }
        if (dome.cn.has("gts-diff-add", element)) { return "+"; }
    }

    function getDiffContext(row) {
        var prefix = diffPrefixFromClassName(row);
        return cull.map(function (code) {
            return (diffPrefixFromClassName(code) || prefix) + (code.innerText || code.innerHTML);
        }, row.getElementsByTagName("code")).join("\n");
    }

    function showCommentButton(user, onClick) {
        var button = this.querySelector(".gts-add-diff-comment");
        if (button) {
            return dome.cn.rm("hidden", button);
        }

        var row = this;
        var tds = row.getElementsByTagName("td");

        // We need this extra container, because setting 'position: relative' on the
        // td element isn't enough to convince Firefox to do the right thing
        var container = el.div({ className: "gts-add-diff-comment-container" });
        container.innerHTML = tds[0].innerHTML;
        tds[0].innerHTML = "";

        container.appendChild(el.a({
            className: "gts-add-diff-comment",
            events: {
                click: function (e) {
                    e.preventDefault();
                    onClick();
                }
            }
        }, el.i({ className: "icon icon-comment" })));
        tds[0].appendChild(container);
    }

    var hide = cull.partial(dome.cn.add, "hidden");

    function hideCommentButton() {
        cull.doall(hide, this.querySelectorAll(".gts-add-diff-comment"));
    }

    function renderMrComments(container, comments, userViewState, commentsUrl, mergeRequestStatuses, currentMergeRequestStatus) {
        var createCommentUrl = userViewState.user ? commentsUrl : null;
        var component = MergeRequestCommentsSection({
            comments:                  comments,
            createCommentUrl:          createCommentUrl,
            currentMergeRequestStatus: currentMergeRequestStatus,
            mergeRequestStatuses:      JSON.parse(mergeRequestStatuses),
        });

        React.renderComponent(component, container.querySelector('.comments-container'));
    }

    return {
        renderDiffComments: renderDiffComments,
        renderComments:     renderComments,
        renderMrComments:   renderMrComments
    };
}(dome.el));
