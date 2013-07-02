this.gts = this.gts || {};

this.gts.oidRefInterpolator = function (element, refs, urlTemplate) {
    var current = this.gts.refSelector.getCurrentRef("heads", element.innerHTML, refs);
    if (current) {
        element.title = current[1];
        element.innerHTML = current[0];
    }
};
