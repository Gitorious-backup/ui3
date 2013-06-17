// The global, shared Gitorious namespace
var gts = this.gts || {};

gts.googleAnalytics = function (account, domainName) {
    window._gaq = window._gaq || [];
    window._gaq.push(["_setAccount", account]);
    if (domainName) {
        window._gaq.push(["_setDomainName", domainName]);
    }
    window._gaq.push(["_trackPageview"]);
    var ga = document.createElement("script");
    ga.type = "text/javascript";
    ga.async = true;
    ga.src = ("https:" === document.location.protocol ?
              "https://ssl" :
              "http://www") + ".google-analytics.com/ga.js";
    (document.getElementsByTagName("head")[0] ||
     document.getElementsByTagName("body")[0]).appendChild(ga);
};
