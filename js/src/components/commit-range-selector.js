this.gts = this.gts || {};

/**
 * "Port" of JS from Gitorious 2 to the system used in Gitorious 3.
 */

this.gts.commitRangeSelector = function (mergeRequestForm, commitListUrl, targetBranchesUrl) {
    var form = $(mergeRequestForm);
    var commitSelector = new gts.CommitRangeSelector(form, commitListUrl, targetBranchesUrl);
    var element = form.find("tr.commit_row input[checked='checked']")[0];

    if (element) {
        commitSelector.endSelected(element);
    }

    form.on("click", "tr.commit_row input[type=radio]", function () {
        commitSelector.endSelected(this);
    });

    form.find("#merge_request_source_branch").change(function() {
        commitSelector.onSourceBranchChange();
    });

    form.find("#merge_request_target_branch").change(function() {
        commitSelector.onTargetBranchChange();
    });

    form.find("#merge_request_target_repository_id").change(function() {
        commitSelector.onTargetRepositoryChange();
    });

    // Note: Temporary hack ahead, remove during merge request page redesign.
    // Having to select a range of commits is mandatory but not checked by
    // default and not obvious to users. The merge request page needs overall
    // redesign, until then we'll just select the whole commit by default after
    // the commit-list table has finished rendering and initalizing
    form.find(".commit_row input[type=radio]").first().click();
};

this.gts.CommitRangeSelector = function (form, commitListUrl, targetBranchesUrl) {
    var spinner = form.find("#spinner");
    this.commitListUrl = commitListUrl;
    this.targetBranchesUrl = targetBranchesUrl;
    this.endsAt = null;
    this.sourceBranchName = null;
    this.targetBranchName = null;
    this.REASONABLY_SANE_RANGE_SIZE = 50;

    function updateCommitList() {
        form.find("#commit_table").replaceWith('<p class="hint">Loading commits&hellip; ' +
                                               '<img src="/images/spinner.gif"/></p>');
        var serialized = form.serialize();
        $.post(this.commitListUrl, serialized, function (data, responseText) {
            if (responseText === "success") {
                form.find("#commit_selection").html(data);
            }
        });
    };

    this.endSelected = function (el) {
        this.endsAt = $(el);
        this.update();
    };

    this.onSourceBranchChange = function (event) {
        this.sourceBranchSelected(form.find("#merge_request_source_branch").val());
    };

    this.onTargetRepositoryChange = function (event) {
        spinner.fadeIn();

        $.post(this.targetBranchesUrl, form.serialize(), function (data, responseText) {
            if (responseText == "success") {
                form.find("#target_branch_selection").html(data);
                spinner.fadeOut();
            }
        });

        updateCommitList.call(this);
    };

    this.onTargetBranchChange = function (event) {
        this.targetBranchSelected(form.find("#merge_request_target_branch").val());
    };

    this.targetBranchSelected = function (branchName) {
        if (branchName && branchName != this.targetBranchName) {
            this.targetBranchName = branchName;
            updateCommitList.call(this);
        }
    };

    this.sourceBranchSelected = function (branchName) {
        if (branchName && branchName != this.sourceBranchName) {
            this.sourceBranchName = branchName;
            updateCommitList.call(this);
        }
    };

    this.update = function () {
        if (this.endsAt) {
            form.find(".commit_row").removeClass("selected");

            var selectedTr = this.endsAt.parent().parent();
            selectedTr.addClass("selected");
            var selectedTrCount = 1;

            selectedTr.nextAll().each(function () {
                $(this).addClass("selected");
                selectedTrCount++;
            });

            if (selectedTrCount > this.REASONABLY_SANE_RANGE_SIZE) {
                form.find("#large_selection_warning").slideDown();
            } else {
                form.find("#large_selection_warning").slideUp();
            }

            // update the status field with the selected range
            var to = selectedTr.find(".sha-abbrev a").html();
            var from = form.find(".commit_row:last .sha-abbrev a").html();
            form.find(".commit_list_status").each(function () {
                $(this).html(from + ".." + to);
            });
        }
    };
};
