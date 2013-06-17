/*global buster, assert, jQuery, gts*/

buster.testCase("Clone URL selection", {
    setUp: function () {
        /*:DOC element = <div class="btn-group gts-repo-urls">
            <a class="btn gts-repo-url" href="git://gitorious.org/gitorious/mainline.git">Git</a>
            <a class="btn gts-repo-url" href="http://git.gitorious.org/gitorious/mainline.git">HTTP</a>
            <a class="active btn gts-repo-url" href="git@gitorious.org:gitorious/mainline.git">SSH</a>
            <input class="span4 gts-current-repo-url gts-select-onfocus" type="url" value="git@gitorious.org:gitorious/mainline.git">
            <button data-toggle="collapse" data-target="#repo-url-help" class="gts-repo-url-help btn">?</button>
          </div>*/
        this.input = this.element.getElementsByTagName("input")[0];
        document.body.appendChild(this.element);
        var buttons = this.element.getElementsByTagName("a");
        this.click = function (num) {
            jQuery(buttons[num]).trigger("click");
        };
    },

    "// copies href to input on click": "Click triggering currently not working"
    /*function () {
        this.click(0);
        assert.equals(this.input.value, "git://gitorious.org/gitorious/mainline.git");
    }*/
});
