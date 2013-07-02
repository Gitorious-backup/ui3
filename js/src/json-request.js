/*global reqwest*/
this.gts = this.gts || {};

this.gts.jsonRequest = function (url) {
    return reqwest({ url: url, type: "json" });
};
