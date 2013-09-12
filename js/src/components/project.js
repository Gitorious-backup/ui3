/*global dome, gts*/
this.gts.project = {
    admin: function projectAdmin(placeholder, data) {
        return gts.adminMenu(placeholder, data, {
            editText: "Edit project",
            destroyText: "Delete project",
            items: [
                [data.editSlugPath, "Edit project slug"],
                [data.ownershipPath, "Transfer ownership"],
                [data.newRepositoryPath, "Add repository"],
                [data.membershipsPath, "Manage access"],
                [data.oauthSettingsPath, "Contribution settings"]
            ]
        });
    }
};