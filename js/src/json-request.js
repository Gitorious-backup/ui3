/*global gts*/
this.gts = this.gts || {};

this.gts.jsonRequest = function (url) {
    return gts.request({ url: url, type: "json" });
};
