/*global cull, dome*/
this.gts = this.gts || {};

/**
 * Allows <select> options to have a data-description attribute that
 * contains details about the options that will be displayed in the
 * element whose id matches that of the select's data-target when
 * selected.
 */
this.gts.selectDetails = function (select) {
    var target = document.getElementById(dome.data.get("target", select));
    if (!target) { return; }

    function updateDescription(e) {
        target.innerHTML = dome.data.get("description", select.options[select.selectedIndex]);
    }

    dome.on(select, "change", updateDescription);
    updateDescription();
};
