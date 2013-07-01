/*global cull, dome*/
this.gts = this.gts || {};

this.gts.cloneNameSuggestion = (function () {
    function repoName(name, repo) {
        var prefix = /s$/.test(name) ? name : name + "s";
        return prefix + "-" + repo;
    }

    return function cloneNameSuggestion(form) {
        var repo = dome.data.get("gts-repository-to-clone", form);
        var userInput = dome.id("repository_owner_type_user");
        var groupInput = dome.id("repository_owner_type_group");
        var groupSelect = dome.id("repository_owner_id_group_select");
        var nameInput = dome.id("repository_name");

        var names = cull.reduce(function (memo, option) {
            return memo.concat(repoName(option.innerHTML, repo));
        }, [repoName(dome.data.get("gts-cloning-user", userInput), repo)], groupSelect.options);

        function setSuggestion() {
            if (nameInput.value && cull.indexOf(nameInput.value, names) < 0) { return; }
            if (userInput.checked) {
                nameInput.value = names[0];
                return;
            }
            if (groupInput.checked) {
                var option = groupSelect.options[groupSelect.selectedIndex];
                nameInput.value = repoName(option.innerHTML, repo);
            }
        }

        dome.on(userInput, "click", setSuggestion);
        dome.on(groupInput, "click", setSuggestion);
        dome.on(groupSelect, "change", setSuggestion);
        setSuggestion();
    };
}());
