/**
 * Global issues.
 *
 * Each key consists of issue's organization name, repository name and its id.
 * For example, organization = octocat, repo = Hello-World, id = 1, then key is 'octocat/Hello-World/1'.
 */
var issues = {};

function parsePullRequestUrl(url) {
    var matches = url.match(/^https:\/\/github\.com\/([\w_\-]+)\/([\w_\-]+)\/pull\/(\d+)/);
    if (matches) {
        var owner = matches[1];
        var repo = matches[2];
        var number = matches[3];
        return {"owner": owner, "repo": repo, "number": number};
    } else {
        return null;
    }
}

function loadAccessToken() {
    return localStorage['access_token'];
}

/**
 * load a single issue by github api
 */
function loadIssue(owner, repo, number, callback) {
    var accessToken = loadAccessToken();
    var url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues/' + number + '?access_token=' + accessToken;
    console.log("access to issue api for get owner = " + owner + ", repo = " + repo + ", number = " + number);
    $.get(
        url,
        function(data) {
            callback(data);
        }
    );
}

function getIssueKey(owner, repo, number) {
    return owner + "/" + repo + "/" + number;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("tabs.onUpdated. url = " + tab.url + ", status = " + changeInfo['status']);
    var change_status = changeInfo['status'];
    if (change_status == 'loading') {
        var access_token = localStorage['access_token'];
        if (access_token) {
            var parsed = parsePullRequestUrl(tab.url);
            if (parsed) {
                var owner = parsed["owner"];
                var repo = parsed["repo"];
                var number = parsed["number"];
                var popup = "/html/popup.html?owner=" + owner + "&repo=" + repo + "&number=" + number;
                var key = getIssueKey(owner, repo, number);
                if (!issues[key]) {
                    loadIssue(owner, repo, number, function(data) {
                        console.log(data);
                        issues[key] = data;
                        chrome.pageAction.show(tabId);
                        chrome.pageAction.setPopup({"tabId": tabId, "popup": popup});
                    });
                } else {
                    chrome.pageAction.show(tabId);
                    chrome.pageAction.setPopup({"tabId": tabId, "popup": popup});
                }
            }
        }
    }
});
