/*global timeago, gts*/
this.gts = this.gts || {};

/**
 * Replace content of <abbr> elements with a casual representation of the
 * ISO8601 date in its title attribute.
 */
this.gts.timeago = (function (ta) {
    function timeago(el, time) {
        var date = ta.parse(time || el.title);
        if (isNaN(date.getTime())) { return; }
        var text = el.innerHTML.trim() || el.title;
        el.innerHTML = ta.relative(date);
        el.title = text;
    };

    var cache = {};

    timeago.periodic = function (timeout) {
        if (!cache[timeout]) {
            cache[timeout] = [];
            setInterval(function () {
                for (var i = 0, l = cache[timeout].length, item; i < l; ++i) {
                    item = cache[timeout][i];
                    gts.timeago(item.element, item.time);
                }
            }, timeout);
        }

        return function (el) {
            cache[timeout].push({ element: el, time: el.title });
        };
    };

    return timeago;
}(timeago));
