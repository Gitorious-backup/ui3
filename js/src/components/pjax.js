this.gts = this.gts || {};

this.gts.pjax = (function () {
  var initialized, activeLink;

  return function (controller, container) {
    var $controller = jQuery(controller);

    if (!initialized) {
      $(container).on("pjax:end", function () {
        $(activeLink).addClass("active");
      });
      initialized = true;
    }

    $controller.pjax("a", container, {
      fragment: "#gts-pjax-container",
      timeout: 1000
    });

    $controller.on("click", "a", function (e) {
      e.preventDefault();

      // Tab bars have links inside li-elements in lists. If either li element
      // has the "active" class name, then assume a tab bar, and move the
      // active class over to the newly clicked link
      var lis = $(this.parentNode.parentNode.childNodes);

      if (!lis.hasClass("active")) {
        activeLink = null;
        return;
      }

      lis.removeClass("active");
      activeLink = this.parentNode;
    });
  };
}());
