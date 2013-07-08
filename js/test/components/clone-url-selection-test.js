/*global buster, assert, jQuery, gts*/

buster.testCase("Clone URL selection", {
    setUp: function () {
        /*:DOC element = <div class="btn-group gts-repo-urls">
            <a class="btn gts-repo-url" href="git://gitorious.org/gitorious/mainline.git">Git</a>
            <a class="btn gts-repo-url" href="http://git.gitorious.org/gitorious/mainline.git">HTTP</a>
            <a class="active btn gts-repo-url" href="ssh://git@gitorious.org:gitorious/mainline.git">SSH</a>
            <input class="span4 gts-current-repo-url gts-select-onfocus" type="url" value="git@gitorious.org:gitorious/mainline.git">
            <button data-toggle="collapse" data-target="#repo-url-help" class="gts-repo-url-help btn">?</button>
          </div>*/
        this.input = this.element.getElementsByTagName("input")[0];
        this.buttons = this.element.getElementsByTagName("a");
    },

    "copies git:// href to input": function () {
        gts.cloneUrlSelection.select(this.element, this.buttons[0]);
        assert.equals(this.input.value, "git://gitorious.org/gitorious/mainline.git");
    },

    "copies ssh:// href to input": function () {
        gts.cloneUrlSelection.select(this.element, this.buttons[2]);
        assert.equals(this.input.value, "git@gitorious.org:gitorious/mainline.git");
    }
});
