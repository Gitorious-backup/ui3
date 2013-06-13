/*global reqwest*/
this.gts.userRepoViewState = function (path) {
    return reqwest({ url: path, type: "json" });
};
