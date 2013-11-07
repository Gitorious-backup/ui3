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
        timeout: 2500
    });

    $controller.on("click", "a", function (e) {
      var lis = $(this).parents(".nav").children();

      if (!lis.hasClass("active")) {
        activeLink = null;
        return;
      }

      lis.removeClass("active");
      activeLink = this.parentNode;
    });
  };
}());
