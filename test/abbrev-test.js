buster.testCase("Abbrev", {
    "returns short enough string": function () {
        assert.equals("Some string", gts.abbrev("Some string", 30));
    },

    "slices off end of too long string": function () {
        assert.equals("Some", gts.abbrev("Some string", 4));
    },

    "inserts padding in place of cut content": function () {
        assert.equals("Some...", gts.abbrev("Some string", 7, "..."));
    },

    "does not insert padding if string is short enough": function () {
        assert.equals("Some string", gts.abbrev("Some string", 11, "..."));
    },

    "does not cut words": function () {
        assert.equals("Some...", gts.abbrev("Some string", 10, "..."));
    }
});
