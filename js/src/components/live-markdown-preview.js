/*global Showdown*/

/**
 * Monitor a textarea and render a live preview of its content parsed as
 * Markdown. The textarea needs to have the data attribute
 * data-gts-preview-target set, and it should be an id of an element elsewhere
 * in the document. The target element needs to contain at least a div element,
 * which is where the preview will be rendered.
 * 
 * When previewing, the target will be hidden when the textarea is empty, and
 * shown with block display when there is content.
 */
this.gts.liveMarkdownPreview = function liveMarkdownPreview(textarea) {
    var attr = textarea.getAttribute("data-gts-preview-target");
    var target = document.getElementById(attr);
    if (!target || typeof Showdown === "undefined") { return; }
    var converter = new Showdown.converter();
    var previous, content;

    function setPreview(preview) {
        target.style.display = preview ? "block" : "none";
        target.getElementsByTagName("div")[0].innerHTML = preview;
    }

    function updatePreview() {
        content = textarea.value;
        if (content !== previous) {
            previous = content;
            setPreview(converter.makeHtml(content));
        }
        setTimeout(updatePreview, 20);
    }

    updatePreview();
};
