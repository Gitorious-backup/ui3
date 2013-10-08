/*global dome*/
// The global, shared Gitorious namespace
var gts = this.gts || {};

/**
 * Adds return to URL parameter when going to the login page
 */
gts.loginButton = function (button, url, user) {
  if (user) return;
  var link = button.getElementsByTagName("a")[0];
  var path = "/" + url.split("/").slice(3).join("/")
  link.href += (/\?/.test(link.href) ? "&" : "?") + "return_to=" + path;
};
