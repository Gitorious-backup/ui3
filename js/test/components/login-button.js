/*global buster, assert, gts, dome*/
buster.testCase("Login button", {
    "adds return to URL param": function () {
        var login = dome.div(dome.a({ href: "/login" }));
        gts.loginButton(login, "/go_here");
        assert.equals("/login?return_to=/go_here", login.firstChild.href);
    }
});
