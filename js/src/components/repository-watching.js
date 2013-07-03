/*global gts, dome, reqwest*/
this.gts = this.gts || {};

/**
 * Generate and power the "Watch"/"Unwatch" button on repository pages. To use
 * this component, put a placeholder on the page, and call
 * repositoryWatching(placeHolder, repositoryWatch);
 * 
 * The viewstate object is expected to contain at least
 *   - watching (boolean)
 *   - watchPath (string)
 *   - unwatchPath (string, only required if watching is true)
 */
this.gts.repositoryWatching = (function () {
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
        ph.parentNode.insertBefore(link, ph);
        ph.parentNode.removeChild(ph);
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
    return repositoryWatching;
}());
