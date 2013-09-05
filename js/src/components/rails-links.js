/*global dome*/
this.gts = this.gts || {};

this.gts.railsLinks = function (csrfParam, csrfToken) {
  dome.on(document.body, "click", function (e) {
    var method = dome.data.get("method", e.target);
    if (!method || method === "get") { return true; }
    e.preventDefault();
    e.stopPropagation();
    var href = e.target.href;

    var form = dome.el("form", {
      method: "post",
      action: href,
      style: { display: "none" }
    }, [
      dome.el("input", { name: "_method", value: method, type: "hidden" }),
      dome.el("input", { name: csrfParam, value: csrfToken, type: "hidden" })
    ]);

    var confirmMsg = dome.data.get("confirm", e.target);

    if (!confirmMsg || confirm(confirmMsg)) {
      document.body.appendChild(form);
      form.submit();
    }
  });
};
