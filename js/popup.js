$(function() {
    var backgroundPage = chrome.extension.getBackgroundPage();
    var owner = url('?owner');
    var repo = url('?repo');
    var number = url('?number');
    var key = backgroundPage.getIssueKey(owner, repo, number);
    var issue = backgroundPage.issues[key];
    console.log(issue);
    $('dd').html(issue['title']);
});
