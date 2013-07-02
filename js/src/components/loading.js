/*global Spinner, dome*/
this.gts = this.gts || {};

/**
 * Put a spinner in an element that's waiting to be loaded with some content.
 */
this.gts.loading = function (element) {
    dome.cn.add("loading", element);
    element.innerHTML = "";
    var text = document.createElement("span");
    text.innerHTML = "Loading...";

    var spinner = new Spinner({
        lines: 8,
        length: 2,
        width: 2,
        radius: 3,
        color: "#000",
        speed: 1,
        trail: 100,
        shadow: false
    }).spin();

    spinner.el.style.top = "10px";
    element.appendChild(spinner.el);
    element.appendChild(text);
};
