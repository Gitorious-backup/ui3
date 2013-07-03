/*global Spinner, dome*/
this.gts = this.gts || {};

/**
 * Put a spinner in an element that's waiting to be loaded with some content.
 */
this.gts.loading = function (element, options) {
    dome.cn.add("loading", element);
    element.innerHTML = "";
    options = options || {};

    var spinner = new Spinner({
        lines: options.hasOwnProperty("lines") ? options.lines : 8,
        length: options.hasOwnProperty("length") ? options.length : 2,
        width: options.hasOwnProperty("width") ? options.width : 2,
        radius: options.hasOwnProperty("radius") ? options.radius : 3,
        color: options.color || "#000",
        speed: options.hasOwnProperty("speed") ? options.speed : 1,
        trail: options.hasOwnProperty("trail") ? options.trail : 100,
        shadow: options.hasOwnProperty("shadow") ? options.shadow : false
    }).spin();

    spinner.el.style.top = options.topPos || "10px";
    element.appendChild(spinner.el);

    var text = options.hasOwnProperty("text") ? options.text : "Loading...";

    if (text) {
        var textEl = document.createElement("span");
        textEl.innerHTML = text;
        element.appendChild(textEl);
    }
};
