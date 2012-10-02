buster.testCase("Tree history", {
    setUp: function () {
        /*:DOC table = <table class="table table-striped gts-tree-explorer">
          <thead>
            <tr>
              <th colspan="0">File</th>
              <th class="gts-col-changed">Changed</th>
              <th colspan="2" class="gts-col-commit">Last commit</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td class="gts-name">
                  <a href="/tree/master:bin"><i class="icon icon-folder-close"></i> bin</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/tree/master:lib"><i class="icon icon-folder-close"></i> lib</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/tree/master:test"><i class="icon icon-folder-close"></i> test</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/tree/master:vendor"><i class="icon icon-folder-close"></i> vendor</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/tree/master:views"><i class="icon icon-folder-close"></i> views</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/blob/master:.gitmodules"><i class="icon icon-file"></i> .gitmodules</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/blob/master:Gemfile"><i class="icon icon-file"></i> Gemfile</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/blob/master:Gemfile.lock"><i class="icon icon-file"></i> Gemfile.lock</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/blob/master:Rakefile"><i class="icon icon-file"></i> Rakefile</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/blob/master:Readme.md"><i class="icon icon-file"></i> Readme.md</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
              <tr>
                <td class="gts-name">
                  <a href="/blob/master:dolt.gemspec"><i class="icon icon-file"></i> dolt.gemspec</a>
                </td>
                <td></td>
                <td class="gts-sha"></td>
                <td></td>
              </tr>
          </tbody>
        </table>*/

        this.server = this.useFakeServer();
        this.tree = [{
            type: "blob",
            oid: "e90021f89616ddf86855d05337c188408d3b417e",
            filemode: 33188,
            name: ".gitmodules",
            history: [{
                oid: "906d67b4f3e5de7364ba9b57d174d8998d53ced6",
                author: { name: "Christian Johansen", email: "christian@cjohansen.no" },
                summary: "Working Moron server for viewing blobs",
                date: "2012-09-10T15:07:39+0200"
            }]
        }, {
            type: "blob",
            oid: "c80ee3697054566d1a4247d80be78ec3ddfde295",
            filemode: 33188,
            name: "Gemfile",
            history: [{
                oid: "26139a3aba4aac8cbf658c0d0ea58b8983e4090b",
                author: { name: "Christian Johansen", email: "christian@cjohansen.no" },
                summary: "Initial commit",
                date: "2012-08-23T11:40:39+0200"
            }]
        }];
        this.server.respondWith(
            "GET",
            "/tree-data.json",
            [200,
             { "Content-Type": "application/json" },
             JSON.stringify(this.tree)]
        );
    },

    "puts spinner in first row": function () {
        gts.treeHistory(this.table, "/tree-data.json");
        var $table = jQuery(this.table);
        var spinners = $table.find(".spinner");

        assert.equals(spinners.length, 1);
        assert.equals(spinners[0].parentNode.parentNode,
                      $table.find("tbody tr:first")[0]);
    },

    "fires request for data": function () {
        gts.treeHistory(this.table, "/tree-data.json");

        assert.equals(this.server.requests.length, 1);
        assert.equals(this.server.requests[0].method, "GET");
        assert.equals(this.server.requests[0].url, "/tree-data.json");
    },

    "removes spinner when server responds": function () {
        gts.treeHistory(this.table, "/tree-data.json");

        this.server.respond();

        assert.equals(jQuery(this.table).find(".spinner").length, 0);
    },

    "adding history": {
        setUp: function () {
            gts.treeHistory(this.table, "/tree-data.json");
            this.server.respond();
        },

        "adds history for .gitmodules": function () {
            var row = this.table.getElementsByTagName("tr")[6];
            var cells = row.getElementsByTagName("td");

            assert.equals(cells[1].innerHTML, "Sep 10 2012");
            assert.match(cells[2].innerHTML, "gts-commit-oid");
            assert.match(cells[2].innerHTML, "data-gts-commit-oid");
            assert.match(cells[2].innerHTML, "906d67b4f3e5de7364ba9b57d174d8998d53ced6");
            assert.match(cells[2].innerHTML, "906d67b<");
            assert.match(cells[2].innerHTML, "Working Moron server for viewing blobs");
            assert.match(cells[2].innerHTML, "Christian Johansen");
        },

        "adds history for Gemfile": function () {
            var row = this.table.getElementsByTagName("tr")[7];
            var cells = row.getElementsByTagName("td");

            assert.equals(cells[1].innerHTML, "Aug 23 2012");
            assert.match(cells[2].innerHTML, "gts-commit-oid");
            assert.match(cells[2].innerHTML, "data-gts-commit-oid");
            assert.match(cells[2].innerHTML, "26139a3aba4aac8cbf658c0d0ea58b8983e4090b");
            assert.match(cells[2].innerHTML, "26139a3<");
            assert.match(cells[2].innerHTML, "Initial commit");
            assert.match(cells[2].innerHTML, "Christian Johansen");
        }
    }
});
