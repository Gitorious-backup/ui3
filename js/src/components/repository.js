/*global dome, gts*/
this.gts = this.gts || {};

this.gts.repository = (function (el) {
    /**
     * Build the repository admin tab into the menu if the data indicates that
     * the current user can admin the repository. Initialize as a dropdown
     * toggler if built.
     */
    function bullet(type, text) {
        return [el.i({ className: type }), " " + text];
    }

    function link(href, type, text) {
        return el.a({ href: href }, bullet(type, text));
    }

    function build(data, tagName) {
        return el[tagName || "li"]({ className: "pull-right dropdown" }, [
            el.a({
                href: "#",
                "data-toggle": "dropdown",
                className: "dropdown-toggle"
            }, bullet("icon-cog", "Admin")),
            el.ul({ className: "dropdown-menu" }, [
                el.li(link(data.editPath, "icon-pencil", "Edit repository")),
                el.li(link(data.destroyPath, "icon-trash", "Delete repository")),
                el.li({ className: "divider" }),
                el.li(link(data.ownershipPath, "i", "Transfer ownership")),
                el.li(link(data.committershipsPath, "i", "Manage collaborators"))
            ])
        ]);
    }

    function repositoryAdmin(placeholder, data) {
        var toggler = build(data, placeholder.tagName.toLowerCase());
        dome.replace(placeholder, toggler);
        this.gts.dropdown(toggler);

        if (dome.data.get("gts-active", toggler.parentNode) === "admin") {
            dome.cn.add("active", toggler);
        }
    }

    repositoryAdmin.build = build;

    /**
     * Generate and power the "Watch"/"Unwatch" button on repository pages. To
     * use this component, put a placeholder on the page, and call
     * repositoryWatching(placeHolder, repositoryWatch);
     * 
     * The viewstate object is expected to contain at least
     *   - watching (boolean)
     *   - watchPath (string)
     *   - unwatchPath (string, only required if watching is true)
     */
    function render(link, repository) {
        if (repository.watching) {
            link.innerHTML = "<i class=\"icon icon-star\"></i> Unwatch";
            link.href = repository.unwatchPath;
        } else {
            link.innerHTML = "<i class=\"icon icon-star-empty\"></i> Watch";
            link.href = repository.watchPath;
        }
    }

    function unwatch(link, repository) {
        gts.request({
            url: repository.unwatchPath,
            method: "delete",
            type: "js",
            headers: {
                "Accept": "application/javascript, text/javascript"
            },
            success: function (xhr) {
                repository.watching = false;
                render(link, repository);
            },
            error: function () {
                link.innerHTML = "Failed, try watching again";
            }
        });
    }

    function watch(link, repository) {
        gts.request({
            url: repository.watchPath,
            method: "post",
            type: "text",
            headers: {
                "Accept": "application/javascript, text/javascript"
            },
            success: function (xhr) {
                repository.watching = true;
                repository.unwatchPath = xhr.getResponseHeader("location");
                render(link, repository);
            },
            error: function () {
                link.innerHTML = "Failed, try unwatching again";
            }
        });
    }

    function toggleState(link, repository) {
        gts.loading(link);
        if (repository.watching) {
            unwatch(link, repository);
        } else {
            watch(link, repository);
        }
    }

    function repositoryWatching(ph, repositoryWatch) {
        var link = dome.el("a", { className: "btn" });
        dome.replace(ph, link);
        render(link, repositoryWatch);
        dome.on(link, "click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleState(link, repositoryWatch);
        });
    };

    repositoryWatching.watch = watch;
    repositoryWatching.unwatch = unwatch;
    repositoryWatching.toggleState = toggleState;
    repositoryWatching.render = render;

    /**
     * Display button to clone repository if the current user is
     * offered a clone URL
     */
    function repositoryCloning(placeholder, repository) {
        if (!repository.clonePath) { return; }
        dome.replace(placeholder, dome.el("a", {
            href: repository.clonePath,
            className: "btn"
        }, "Clone"));
    }

    /**
     * Display button to merge repository clone if the current user
     * is offered a request merge URL.
     */
    function mergeRequest(placeholder, repository) {
        if (!repository.requestMergePath) { return; }
        dome.replace(placeholder, dome.el("li", { className: "pull-right" }, [
            dome.el("a", { href: repository.requestMergePath }, [
                dome.el("i", { className: "icon icon-random" }),
                " Request merge"
            ])
        ]));
    }

    return {
        admin: repositoryAdmin,
        watching: repositoryWatching,
        cloning: repositoryCloning,
        mergeRequest: mergeRequest
    };
}(dome.el));
