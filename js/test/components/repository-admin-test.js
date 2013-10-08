/*global buster, assert, refute, gts*/

buster.testCase("Repository admin", {
    setUp: function () {
        this.data = {
            editPath: "/edit",
            destroyPath: "/destroy",
            ownershipPath: "/ownership",
            committershipsPath: "/committerships",
            webHooksPath: "/webhooks"
        };
        this.div = document.createElement("div");
        this.ph = document.createElement("div");
        this.div.appendChild(this.ph);
    },

    "includes link to admin pull-down": function () {
        gts.repository.admin(this.ph, this.data);

        assert.className(this.div.firstChild, "dropdown");
        assert.match(this.div.firstChild.innerHTML, "dropdown-toggle");
        assert.match(this.div.firstChild.innerHTML, "<i class=\"icon-cog\"></i> Admin");
    },

    "includes dropdown menu": function () {
        gts.repository.admin(this.ph, this.data);

        assert.match(this.div.firstChild.innerHTML, "<ul class=\"dropdown-menu");
    },

    "includes links": function () {
        gts.repository.admin(this.ph, this.data);

        assert.match(this.div.firstChild.innerHTML, "/edit");
        assert.match(this.div.firstChild.innerHTML, "/destroy");
        assert.match(this.div.firstChild.innerHTML, "/ownership");
        assert.match(this.div.firstChild.innerHTML, "/committerships");
        assert.match(this.div.firstChild.innerHTML, "/webhooks");
    }
});
