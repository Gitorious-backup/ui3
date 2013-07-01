/*global cull, dome*/
this.gts = this.gts || {};

this.gts.cloneNameSuggestion = (function () {
    function prefix(name) {
        return /s$/.test(name) ? name : name + "s";
    }

    return function cloneNameSuggestion(form) {
        var repo = dome.data.get("gts-repository-to-clone", form);
        var userInput = dome.byId("repository_owner_type_user");
        var groupInput = dome.byId("repository_owner_type_group");
        var groupSelect = dome.byId("repository_owner_id_group_select");
        var nameInput = dome.byId("repository_name");

        var prefixes = cull.reduce(function (memo, option) {
            return memo.concat(prefix(option.innerHTML));
        }, [prefix(dome.data.get("gts-cloning-user", userInput))], groupSelect.options);

        function setSuggestion() {
            if (cull.indexOf(nameInput.value, prefixes) < 0) { return; }
            if (userInput.checked) {
                nameInput.value = prefixes[0] + "-" + repo;
                return;
            }
            if (groupSelect.checked) {
                var option = groupSelect.options[groupSelect.selectedIndex];
                nameInput.value = prefix(option.innerHTML) + "-" + repo;
            }
        }

        dome.on(userInput, "change", setSuggestion);
        dome.on(groupInput, "change", setSuggestion);
        dome.on(groupSelect, "change", setSuggestion);
    };
}());
