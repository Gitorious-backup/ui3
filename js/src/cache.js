this.gts = this.gts || {};

this.gts.cache = function (fn) {
    var cache = [];

    function equal(arr1, arr2) {
        if (arr1.length !== arr2.length) { return false; }
        for (var i = 0, l = arr1.length; i < l; ++i) {
            if (arr1[i] !== arr2[i]) { return false; }
        }
        return true;
    }

    return function () {
        var args = [].slice.call(arguments);
        var i, l, j, k, result;
        for (i = 0, l = cache.length; i < l; ++i) {
            if (equal(cache[i].args, args)) {
                return cache[i].result;
            }
        }

        result = fn.apply(self, args);
        cache.push({ args: args, result: result });
        return result;
    };
};
