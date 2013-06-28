/*global gts*/

buster.testCase("Cache", {
    "caches function": function () {
        var spy = this.spy();
        var fn = gts.cache(spy);
        fn();
        fn();
        fn();

        assert.calledOnce(spy);
    },

    "caches function's return value": function () {
        var stub = this.stub().returns(42);
        var fn = gts.cache(stub);

        assert.equals(fn(), 42);
        assert.equals(fn(), 42);
        assert.equals(fn(), 42);
    },

    "caches function's return value per argument": function () {
        var adder = 1;
        var fn = gts.cache(function (a) {
            return a + adder;
        });

        assert.equals(fn(1), 2);
        adder = 2;
        assert.equals(fn(1), 2);
        assert.equals(fn(2), 4);
    },

    "caches function's return value per arguent set": function () {
        var adder = 1;
        var fn = gts.cache(function (a, b) {
            return a + b + adder;
        });

        var object = { valueOf: this.stub().returns(1) };
        assert.equals(fn(1, object), 3);
        adder = 2;
        assert.equals(fn(1, object), 3);
        assert.equals(fn(2, object), 5);
    }
});
