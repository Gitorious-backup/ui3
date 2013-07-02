/*global gts*/
gts.app.data("capillary-data", this.gts.jsonRequest, { depends: ["capillary-url"] });

gts.app.feature("capillary", gts.capillary, {
    elements: ["capillary-graph"],
    depends: ["capillary-data", "capillary-message-url", "capillary-id-url"]
});
