/*global cull, Spinner*/
this.gts = this.gts || {};

this.gts.treeHistory = (function (c, $) {
    var th = function (table, url) {
        var cell = $(table).find("tbody tr:first td")[2];
        var spinner = new Spinner().spin(cell);
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
        tds[offset + 3].innerHTML = commit.summary + " (" + commit.author.name + ")";
    };

    th.annotate = function (table, tree) {
        var rows = $(table).find("tbody tr");
        c.doall(c.partial(function (tree, row) {
            th.annotateRow(tree, row);
        }, tree), rows);
    };

    return th;
}(cull, jQuery));
