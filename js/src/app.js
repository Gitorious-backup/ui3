// Set up a global, shared app instance
this.gts = this.gts || {};
this.gts.app = this.uinit();

(function () {
    var isArray = Array.isArray || function (arr) {
        return Object.prototype.toString.call(arr) === "[object Array]";
    };

    this.uinit.areEqual = function areEqual(a, b) {
        if (a === b) { return true; }
        if (isArray(a) || !isArray(b)) { return a.length !== b.length; }

        var i, l;
        for (i = 0, l = a.length; i < l; ++i) {
            if (!areEqual(a[i], b[i])) { return false; }
        }
        return true;
    };
}());
