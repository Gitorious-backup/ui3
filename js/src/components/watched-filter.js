this.gts = this.gts || {};

this.gts.watchedFilter = function (element) {
    var watched = $(element);

    var makeCurrent = function (newCurrent, current) {
        watched.find(".filters a").removeClass("current");
        $(newCurrent).addClass("current");
    };

    var swapAndMakeCurrent = function (klass, current) {
        watched.find(".favorite." + klass).show();
        watched.find(".favorite:not(." + klass + ")").hide();
        makeCurrent(current);
    };

    watched.find(".filters a.all").addClass("current");
    watched.find(".filters a").css({ "outline": "none" });

    watched.find(".filters a.all").click(function () {
        watched.find(".favorite").show();
        makeCurrent(this);
        return false;
    });

    watched.find(".filters a.repositories").click(function () {
        swapAndMakeCurrent("repository", this);
        return false;
    });

    watched.find(".filters a.merge-requests").click(function () {
        swapAndMakeCurrent("merge_request", this);
        return false;
    });

    watched.find(".filters a.mine").click(function () {
        swapAndMakeCurrent("mine", this);
        return false;
    });

    watched.find(".filters a.foreign").click(function () {
        swapAndMakeCurrent("foreign", this);
        return false;
    });
};
