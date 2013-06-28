/*global dome*/
/**
 * A simplified version of the Bootstrap dropdown jQuery plugin. Uses dome
 * instead of jQuery and does not support most features in the original code,
 * only toggling the dropdown.
 * 
 * Original license follows.
 * 
 * ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ===========================================================
 */
this.gts.dropdown = (function (D) {
    return function dropdown(element) {
        var backdrop, active = false;

        function close() {
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
                backdrop = null;
            }

            D.cn.rm("open", element);
            active = false;
        }

        function toggle(element) {
            if (active) { return close(); }

            if (document.documentElement.hasOwnProperty("ontouchstart")) {
                // if mobile we we use a backdrop because click events don't
                // delegate
                backdrop = D.el("div", {
                    className: "dropdown-backdrop",
                    events: { click: close }
                });
                element.insertBefore(backdrop, element);
            }
            D.cn.add("open", element);
            active = true;
        }

        D.on(element, "click", function (e) {
            if (!dome.cn.has("dropdown-toggle", e.target)) { return; }
            toggle(this);
            e.preventDefault();
            e.stopPropagation();
        });

        D.on(document.documentElement, "click", close);
        D.on(document.documentElement, "keydown", function (e) {
            if (e.keyCode !== 27) { return; }
            close();
            e.preventDefault();
            e.stopPropagation();
        });
    };
}(dome));
