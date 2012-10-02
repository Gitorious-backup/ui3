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

    function formatCommitSummary(commit) {
        return "<span class=\"gts-commit-oid\" " + "data-gts-commit-oid=\"" +
            commit.oid + "\">#" + commit.oid.slice(0, 7) + "</span> " +
            commit.summary + " (" + commit.author.name + ")";
    }

    th.annotateRow = function (tree, row) {
        var tds = row.getElementsByTagName("td");
        var entry = getFileMeta($.trim($(tds[0]).text()), tree);
        if (!entry) { return; }
        var commit = entry.history[0];
        tds[1].innerHTML = formatDate(commit.date);
        tds[2].innerHTML = formatCommitSummary(commit);
    };

    th.annotate = function (table, tree) {
        var rows = $(table).find("tbody tr");
        c.doall(c.partial(function (tree, row) {
            th.annotateRow(tree, row);
        }, tree), rows);
    };

    return th;
}(cull, jQuery));
