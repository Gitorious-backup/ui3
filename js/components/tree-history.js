/*global gts, cull, Spinner*/
// The global, shared Gitorious namespace
this.gts = this.gts || {};

/**
 * gts.treeHistory(tableElement, treeHistoryUrl)
 *
 * Loads the tree history JSON payload from Gitorious and annotates an
 * HTML table containing a Git tree with commit data. The HTML table
 * is expected to look like:
 * 
 * <table>
 *   <!-- Possible thead and tfoot, ignored -->
 *   <tbody>
 *     <tr>
 *       <td class="gts-name">
 *         <a href="/gitorious/gitorious/source/master:bin">
 *           <i class="icon icon-folder-close"></i>
 *           bin
 *         </a>
 *       </td>
 *       <td class="gts-commit-date"></td>
 *       <td class="gts-commit-oid"></td>
 *       <td></td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * treeHistory will fill out the commit date, oid and add the last commit
 * message to the last cell.
 * 
 * treeHistory also supports initial empty <td> elements, as created by Dolt
 * when directory hierarhy indentation is enabled.
 *
 * The treeHistoryUrl points to the tree history JSON resource, which
 * looks like
 * 
 *   [{ "name": "bin",
 *      "oid": "08e37640144b900e8e876f621332b64c39c79567",
 *      "filemode": 16384,
 *      "type": "tree",
 *      "history": [{
 *        "oid": "762d5a7186850dca6b507402ca7bbec2df2dea72",
 *        "author": {
 *          "name": "Marius Mathiesen",
 *          "email": "marius@gitorious.org"
 *        },
 *        "date": "2012-10-04T14:15:33+02:00",
 *        "summary": "Set ENV[\"HOME\"] to make resque work with SSH keys",
 *        "message": ""
 *      }, { ... }]
 *    }, { ... }]
 */
this.gts.treeHistory = (function (c, $) {
    var th = function (table, url) {
        var cell = $(table).find("tbody tr:first td")[2];
        var spinner = new Spinner({
            lines: 13,
            length: 1,
            width: 2,
            radius: 6,
            corners: 1,
            rotate: 0,
            color: "#000",
            speed: 1,
            trail: 60,
            shadow: false,
            hwaccel: true,
            className: "spinner",
            zIndex: 2e9,
            top: "auto",
            left: "auto"
        }).spin(cell);
        $.ajax({
            url: url,
            success: function (tree) {
                spinner.stop();
                th.annotate(table, tree);
            }
        });
    };

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"];

    function getFileMeta(fileName, tree) {
        return c.select(function (e) {
            return e.name === fileName;
        }, tree)[0];
    }

    function formatDate(dateStr) {
        if (!Date.parse) { return ""; }
        var d = new Date(Date.parse(dateStr));
        return months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear();
    }

    function getTreeIndent(cells) {
        for (var i = 0, l = cells.length; i < l; ++i) {
            if (c.dom.hasClassName("gts-name", cells[i])) {
                return i;
            }
        }

        return i;
    }

    th.annotateRow = function (tree, row) {
        var tds = row.getElementsByTagName("td");
        var offset = getTreeIndent(tds);
        var entry = getFileMeta($.trim($(tds[offset]).text()), tree);
        if (!entry) { return; }
        var commit = entry.history[0];
        tds[offset + 1].innerHTML = formatDate(commit.date);
        $(tds[offset + 2]).attr("data-gts-commit-oid", commit.oid);
        tds[offset + 2].innerHTML = "#" + commit.oid.slice(0, 7);
        tds[offset + 3].innerHTML = gts.abbrev(commit.summary, 50, " [...]") +
            " (" + commit.author.name + ")";
    };

    th.annotate = function (table, tree) {
        var rows = $(table).find("tbody tr");
        c.doall(c.partial(function (tree, row) {
            th.annotateRow(tree, row);
        }, tree), rows);
    };

    return th;
}(cull, jQuery));
