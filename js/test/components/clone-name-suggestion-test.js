/*global buster, dome, gts*/

buster.testCase("Clone name suggestion", {
    setUp: function () {
        this.form = dome.el("form", {
            "data": { "gts-repository-to-clone": "gitorious" }
        }, [
            dome.el("input", {
                checked: "checked",
                id: "repository_owner_type_user",
                name: "repository[owner_type]",
                value: "User",
                type: "radio",
                data: { "gts-cloning-user": "christian" }
            }),

            dome.el("input", {
                id: "repository_owner_type_group",
                name: "repository[owner_type]",
                type: "radio",
                value: "Group"
            }),

            dome.el("select", {
                id: "repository_owner_id_group_select",
                name: "repository[owner_id]"
            }, [
                dome.el("option", { value: 1 }, "gitorians"),
                dome.el("option", { value: 2 }, "blargians")
            ])
        ]);
    },

    "//suggests username-scoped clone name": function () {
        
    }
});
