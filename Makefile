GTS3_DEPS=js/lib/es5-shim/es5-shim.js js/lib/es5-shim/es5-sham.js js/lib/spin.js/spin.js js/lib/when/when.js js/lib/bane/lib/bane.js js/lib/reqwest/reqwest.js js/lib/uinit/lib/uinit.js js/lib/showdown/src/showdown.js js/lib/timeago/timeago.js js/lib/jquery/jquery-1.10.2.min.js js/lib/jquery/jquery.ujs.js js/lib/jquery/jquery.pjax.js lib/bootstrap/js/bootstrap.min.js js/lib/jquery-ui/ui/jquery.ui.core.js js/lib/jquery-ui/ui/jquery.ui.widget.js js/lib/jquery-ui/ui/jquery.ui.mouse.js js/lib/jquery-ui/ui/jquery.ui.selectable.js

GTS3_UTILS=js/src/app.js js/src/cache.js js/src/json-request.js

GTS3_COMPONENTS=js/src/components/dropdown.js js/src/components/abbrev.js js/src/components/url.js js/src/components/ref-selector.js js/src/components/tree-history.js js/src/components/commit-linker.js js/src/components/profile-menu.js js/src/components/clone-url-selection.js js/src/components/blob.js js/src/components/live-markdown-preview.js js/src/components/timeago.js js/src/components/collapse.js js/src/components/admin-menu.js js/src/components/project.js js/src/components/repository.js js/src/components/rails-links.js js/src/components/clone-name-suggestion.js js/src/components/loading.js js/src/components/oid-ref-interpolator.js js/src/components/comments.js js/src/components/slugify.js js/src/components/select-details.js js/src/components/login-button.js js/src/components/pjax.js js/src/components/commit-range-selector.js js/src/components/watched-filter.js

CAPILLARY_SOURCES=js/lib/raphael/raphael-min.js js/src/spacer.js js/lib/capillary/lib/capillary.js js/lib/capillary/lib/capillary/branch.js js/lib/capillary/lib/capillary/graph.js js/lib/capillary/lib/capillary/formatters/scale.js js/lib/capillary/lib/capillary/formatters/svg-data.js js/lib/capillary/lib/capillary/formatters/raphael.js  js/lib/capillary/lib/capillary/formatters/message-markup.js js/src/components/capillary.js js/src/capillary.js

all: dist/gitorious3.min.css dist/gitorious3-capillary.min.js dist/gitorious3.min.js

rebuild: clean all

node_modules/.bin/uglifyjs:
	npm install uglify-js

js/lib/culljs/dist/cull.js:
	cd js/lib/culljs && npm install && node build -s -n

js/lib/dome/dist/dome.js:
	cd js/lib/dome && npm install && node build -s -n

dist/gitorious3-dependencies.min.js: $(GTS3_DEPS) js/lib/culljs/dist/cull.js js/lib/dome/dist/dome.js node_modules/.bin/uglifyjs
	cat js/lib/culljs/dist/cull.js \
	    js/lib/dome/dist/dome.js \
	    $(GTS3_DEPS) | ./node_modules/.bin/uglifyjs -m -c > dist/gitorious3-dependencies.min.js
	du -h dist/gitorious3-dependencies.min.js

dist/gitorious3-components.min.js: $(GTS3_UTILS) $(GTS3_COMPONENTS) js/src/gitorious.js node_modules/.bin/uglifyjs
	cat $(GTS3_UTILS) $(GTS3_COMPONENTS) js/src/gitorious.js | ./node_modules/.bin/uglifyjs -m -c > dist/gitorious3-components.min.js
	du -h dist/gitorious3-components.min.js

dist/gitorious3.min.js: dist/gitorious3-dependencies.min.js dist/gitorious3-components.min.js
	cat dist/gitorious3-dependencies.min.js dist/gitorious3-components.min.js > dist/gitorious3.min.js
	du -h dist/gitorious3.min.js

dist/gitorious3-capillary.min.js: $(CAPILLARY_SOURCES) node_modules/.bin/uglifyjs
	cat $(CAPILLARY_SOURCES) | ./node_modules/.bin/uglifyjs -m -c > dist/gitorious3-capillary.min.js
	du -h dist/gitorious3-capillary.min.js

dist/gitorious3.min.css: css/gitorious.css css/syntax-highlight.css
	juicer merge -f -o dist/gitorious3.min.css css/gitorious.css
	du -h dist/gitorious3.min.css

clean:
	rm -fr dist/*
	rm -fr js/lib/culljs/dist
	rm -fr js/lib/dome/dist

