/**
 * Client-side application that retrieves and displays issues in a Github repository.
 *
 * @type {{init}}
 */
var IssuesApp = (function () {
    'use strict';

    var DEFAULT_REPOSITORY = 'angular';
    var DEFAULT_REPOSITORY_OWNER = 'angular';
    var DEFAULT_DAYS_SINCE = 7;

    /**
     * Initialize the app.
     */
    var init = function () {
        ko.applyBindings(new IssuesViewModel());
        console.log('issues search app initialized');
    };

    /**
     * Describes an issue in Github.
     *
     * @param title         The title.
     * @param body          The body.
     * @param userLogin     The user login.
     * @param assigneeLogin The assignee login.
     * @constructor
     */
    var Issue = function (title, body, userLogin, assigneeLogin) {
        var self = this;
        self.title = title;
        self.body = body;
        self.userLogin = userLogin;
        self.assigneeLogin = assigneeLogin;
    };

    /**
     * The ViewModel.
     *
     * @constructor
     */
    var IssuesViewModel = function () {
        var self = this;

        self.repository = ko.observable(DEFAULT_REPOSITORY);
        self.owner = ko.observable(DEFAULT_REPOSITORY_OWNER);
        self.days = ko.observable(DEFAULT_DAYS_SINCE);
        self.issues = ko.observableArray([]);
        self.fetchIssues = function () {
            // reset UI
            $('#count').hide();
            self.issues([]);

            // calculate the url
            var githubIssuesUrl = calculateGetIssuesUrl(self.repository(), self.owner(), self.days());

            // perform the fetch
            console.log('fetching issues from ' + githubIssuesUrl);
            $.getJSON(githubIssuesUrl, function (issueData) {
                // map data from Github to fit our model
                self.issues($.map(issueData, function (issue) {
                    return new Issue(
                        issue.title,
                        issue.body,
                        issue.user ? issue.user.login : '',
                        issue.assignee ? issue.assignee.login : ''
                    );
                }));

                // show the count
                $('#count').show();
            });
        };
    };

    /**
     * Calculate the URL to which we will request a set of issues.
     *
     * @param repository    The repository.
     * @param owner         The repository owner.
     * @param days          The number of days back in time we should look for issues.
     * @returns {string}
     */
    var calculateGetIssuesUrl = function (repository, owner, days) {
        var since = new Date();
        since.setDate(since.getDate() - days);
        var sinceFormatted = since.getFullYear() + '-' + (since.getMonth() + 1) + '-' + since.getDate();

        return 'http://api.github.com/repos/' + owner + '/' + repository + '/issues?since=' + sinceFormatted;
    };

    return {
        init: init
    };

})();