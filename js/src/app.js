/*global gts, dome, cull, bane, when*/
this.gts = this.gts || {};

/**
 * An "app" is a mechanism for configuring "features"/UI components that should
 * launch on page load and possibly also at later times. A "feature" is simply a
 * function that may depend on an element, some data from the network and/or
 * local variables. The app defines an API for adding such features, and
 * provides a simple mechanism for them to declaratively state their
 * dependencies.
 * 
 * The app also has a mechanism for processing errors, logging debug information
 * and reloading the features if e.g. parts of the page has been
 * modified/reloaded.
 * 
 * Environment variables
 * 
 * Environment variables can be set by anyone at any time. This is typically
 * useful whenever a server-side HTML template needs to inject some data into
 * the client-side scripts, e.g.:
 * 
 *     <script>appInstance.env("ip_addr", "192.168.0.1");</script>
 * 
 * Features can list environment variables as dependencies.
 * 
 * Data
 * 
 * Some features may require access to data that is not immediately present in
 * the page. The typical example is data fetched via XMLHttpRequest, but 'data'
 * is by no means restricted to that.
 * 
 * Data is registered with a name and a function. The function will only ever be
 * called if a task depends on it via its name. The function may either return
 * some data directly, or return a promise. If it throws an error, or the
 * returned promise rejects, the error will be passed on to the app's failure
 * listeners. When the returned promise resolves, the result is passed to any
 * features waiting for the data. Data may also have dependencies (e.g. on
 * certain variables or other, see "Feature" below).
 * 
 * Feature
 * 
 * A "feature" is a function to be called on page load, and possibly also at a
 * later point (e.g. if parts of the page has been rebuilt). Features may
 * depend on specific elements to be available, data and environment variables.
 * A feature may also have additional data provided as input for when it is
 * called (if dependencies are resolved).
 * 
 * Events
 * 
 * The app emits the following events:
 * 
 * "loading" (name)
 * 
 * When a feature's dependencies are satiesfied, it is scheduled for loading. At
 * this point some of the feature's input may still be unresolved (if any of it
 * is the result of asynchronous operations). At this point, the feature may
 * still fail to load, if asynchronous dependencies fail to materialize.
 * 
 * "loaded" (name[, args...])
 *
 * When a feature has successfully materialized (i.e. the returned promise
 * resolved, or it didn't return a promise). If a feature depends on multiple
 * elements, this event will be emitted once per element. 
 *
 * "pending" (name)
 *
 * A feature's dependencies were not satiesfied, thus it was not loaded. To
 * investigate why the feature did not load, use the app object:
 * 
 *     app.on("pending", function (name) {
 *         app.dependencies(name); // [{ name: "A", loaded: false }, ...]
 *     });
 * 
 * "error" (error)
 * 
 * When errors occur, or promises are rejected as the app is loading features.
 */
this.gts.app = function () {
    var C = cull;

    /**
     * Check if `feature` has all its dependencies satiesfied in the `features`
     * object (which uses feature/dependency names as keys, feature descriptions
     * as values).
     */
    function dependenciesSatiesfied(features, feature) {
        return C.reduce(function (satiesfied, dep) {
            return satiesfied && features[dep] && features[dep].loaded;
        }, true, feature.depends || []);
    }

    /**
     * Return an array of "results" (return-values and/or resolved values from
     * returned promises) of the features listed in `dependencies`.
     */
    function dependencyResults(features, deps) {
        return C.map(function (dep) { return features[dep].result; }, deps);
    }

    /**
     * Mark the feature as loaded and load it when all arguments have
     * materialized.
     */
    function loadFeature(features, feature, element) {
        var args = dependencyResults(features, feature.depends || []);
        feature.loaded = true;
        var deferred = when.defer();
        feature.result = deferred.promise;
        when.all(args).then(function (materialized) {
            var allArgs = (element ? [element] : []).concat(materialized);
            deferred.resolve(feature.action.apply(null, allArgs));
        });
    }

    /**
     * Attempt to load a feature in a given context. If the feature depends on
     * elements, it will not be load if the provided context does not contain any
     * matching elements.
     */
    function tryFeatureInContext(features, feature, context) {
        var load = C.partial(loadFeature, features, feature);
        if (feature.elements) {
            C.doall(load, dome.byClass(feature.elements, context));
        } else {
            load();
        }
    }

    /**
     * When trying to load features, this function is used to determine if a
     * feature is ready to be proactively loaded (and has not already been
     * loaded).
     */
    function isReady(features, feature) {
        return !feature.lazy &&
            !feature.loaded &&
            feature.action &&
            dependenciesSatiesfied(features, feature);
    }

    /** Returns true if the feature is both pending (not loaded) and lazy */
    function pendingLazy(feature) {
        return feature && feature.lazy && !feature.loaded;
    };

    /**
     * For all the features in `featureArr`, find the unique set of dependencies
     * that are both pending and lazy.
     */
    function lazyDependencies(features, featureArr) {
        var getDep = function (dep) { return features[dep]; };
        return C.uniq(C.reduce(function (lazy, feature) {
            return lazy.concat(C.select(
                pendingLazy,
                C.map(getDep, feature.depends || [])
            ));
        }, [], featureArr));
    }

    /** Set properties on all objects in the collection */
    function setAll(objects, props) {
        return C.doall(function (object) {
            C.doall(function (prop) {
                object[prop] = props[prop];
            }, C.keys(props));
        }, objects);
    }

    /** Temporarily mark a set of features as eager (i.e. not lazy) */
    function makeEager(features) {
        return setAll(features, { lazy: false, wasLazy: true });
    }

    /**
     * Reset the state of features: Revert temporarily eager ones, and mark
     * loaded features as not loaded so they can be considered for loading again
     * (used for consecutive calls to load()).
     */
    function reset(features) {
        C.doall(function (feature) {
            // Environment variables don't have actions, they're always loaded
            if (feature.action) { feature.loaded = false; }
            if (feature.wasLazy) {
                delete feature.wasLazy;
                feature.lazy = true;
            }
        }, C.values(features));
    }

    /**
     * Keep trying to load features until there are no more features ready to
     * load. When one feature is enabled we start from the top again as that
     * may have enabled features that were previously not ready.
     */
    function tryFeatures(app, features, context) {
        var idx, feature, featureArr = C.values(features);
        var deps = makeEager(lazyDependencies(features, featureArr));
        var isReadyToLoad = C.partial(isReady, features);
        var toTry = deps.concat(featureArr);

        while ((feature = C.first(isReadyToLoad, toTry))) {
            app.emit("loading", feature);
            tryFeatureInContext(features, feature, context);
            // If the feature is not loaded after trying, it's depending on
            // elements, but no matching elements were found. Ignore this
            // feature for now, re-evaluate during the next pass.
            if (!feature.loaded) {
                idx = C.indexOf(feature, toTry);
                toTry = toTry.slice(0, idx).concat(toTry.slice(idx + 1));
            }
        }
    }

    function ensureUnique(features, name) {
        if (features[name]) {
            throw new Error("Cannot add duplicate " + name);
        }
    }

    var appInstance;

    function getDependencies() {
        return cull.map(function (depName) {
            return appInstance.features[depName] || {
                name: depName,
                type: "Unknown"
            };
        }, this.depends || []);
    }

    appInstance = bane.createEventEmitter({
        features: {},

        /**
         * Set environment data. Values are not specially treated and can be
         * anything. If the app has been loaded, setting an environment variable
         * will result in trying to load pending features.
         */
        env: function (name, value) {
            // ensureUnique(this.features, name);
            this.env[name] = value;
            this.feature(name, undefined, { result: value, loaded: true });
            // this.features[name] = createFeature({ result: value, loaded: true });
            // this.tryPending();
        },

        /**
         * The data function may return a promise. If there are no tasks that
         * depend on this piece of data, the function will never be called. It
         * is possible to express dependencies for data - see lazy features
         * below.
         */
        data: function (name, fn, opt) {
            var options = opt || {};
            if (typeof options.lazy !== "boolean") {
                options.lazy = true;
            }
            return this.feature(name, fn, options);
        },

        /**
         * Register a feature. Features may depend on environment variables,
         * data, and even other features. Additionally, features may depend on
         * DOM elements. DOM elements can only be selected by a single class
         * name. If the class name matches no elements, the feature will not be
         * called. Otherwise, the feature is called once for each element, like
         * so:
         * 
         *     feature(element[, dependencies][, options]);
         * 
         * Given the following feature:
         * 
         *     appInstance.feature("tweetui", loadTweets, {
         *         elements: "tweet-placeholder",
         *         depends: ["account", "tweets"]
         *     });
         * 
         * Where "account" is an environment variable and "tweets" is a data
         * event, the function will eventually be called like this:
         * 
         *     loadTweets(element1, accountValue, tweetsData);
         *     loadTweets(element2, accountValue, tweetsData);
         *     // ...
         * 
         * If depending on another feature, its return-value will be the input.
         * If the feature in question returned a promise, the resolution will be
         * passed as input (after that feature has resolved).
         * 
         * A feature may be "lazy", in which case it is only loaded if another
         * feature depends on it. Data events are just lazy features, e.g.:
         * 
         *     appInstance.feature("tweets", function () {
         *         return reqwest({ url: "/tweets" });
         *     }, { lazy: true });
         * 
         * Is equivalent to:
         * 
         *     appInstance.data("tweets", function () {
         *         return reqwest({ url: "/tweets" });
         *     });
         * 
         * The `name` can be any string.
         */
        feature: function (name, fn, opt) {
            ensureUnique(this.features, name);
            var feature = opt || {};
            feature.name = name;
            feature.action = fn;
            this.features[name] = feature;
            this.features[name].dependencies = getDependencies;
            this.tryPending();
        },

        /**
         * Load the app. This function may be called multiple times. It
         * optionally accepts a DOM element to use as its root. If it is not
         * provided, the document itself is used as the root.
         */
        load: function (context) {
            if (this.loaded) { reset(this.features); }
            this.loaded = true;
            this.context = context;
            this.tryPending();
        },

        /**
         * After loading the app, some features may still not be loaded if the
         * elements they depend on are not available. `tryPending` retries all
         * those features. If you call app.load(context) and then modify the DOM
         * within the context element you may want to call this to ensure your
         * modified elements are considered for pending features.
         * 
         * If you want already loaded features to reload for newly added
         * elements/changed DOM structure you need to call load() over again.
         * 
         * If app is not loaded, this method does nothing.
         */
        tryPending: function () {
            if (!this.loaded) { return; }
            tryFeatures(this, this.features, this.context);
        }
    });

    return appInstance;
};
