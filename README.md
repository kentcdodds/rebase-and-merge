# rebase-and-merge

This is still a work in progress. The goal is to eventually make a Chrome Extension that adds a `Rebase and Merge`
button:

![rebase-and-merge](other/rebase-and-merge.png)

For now, you'll have to do a few things to get this working. But it should work just fine!

First you're going to need to [create a personal token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) that has `repo` access.

Then you'll want to alter this JavaScript so it has your information for the `token`, `userName`, and `userEmail`.

```javascript
var params = {
  token: 'YOUR_TOKEN',
  userName: 'Your Name',
  userEmail: 'your@email.com',
  baseRepo: /(http.*?github\.com\/.*?\/.*?)\/pull/.exec(location.href)[1]
};

var ghHeaderMeta = document.querySelector('.gh-header-meta');
var commitRefs = ghHeaderMeta.querySelectorAll('.commit-ref');
var baseRef = getOrgAndBranch(commitRefs[0]);
var prRef = getOrgAndBranch(commitRefs[1]);

params.baseBranch = baseRef.branch;
params.prBranch = prRef.branch;
if (prRef.org) {
  params.prRepo = params.baseRepo.replace(/github\.com\/(.*?)\//, 'github.com/' + prRef.org + '/')
} else {
  params.prRepo = params.baseRepo;
}

var paramArray = [];
Object.keys(params).forEach(function(key) {
  paramArray.push(key + '=' + encodeURIComponent(params[key]));
});


window.open('https://webtask.it.auth0.com/api/run/wt-kent+github-doddsfamily_us-0/rebase-and-merge?webtask_no_cache=1&' + paramArray.join('&'), '_blank');


function getOrgAndBranch(commitRef) {
  var targets = commitRef.querySelectorAll('.css-truncate-target');
  var org, branch;
  if (targets.length !== 1) {
    org = targets[0].innerText;
    branch = targets[1].innerText;
  } else {
    branch = targets[0].innerText;
  }
  return {org: org, branch: branch};
}
```

Then [minify it](https://marijnhaverbeke.nl/uglifyjs).

So it should look something like this:

```javascript
function getOrgAndBranch(a){var c,d,b=a.querySelectorAll(".css-truncate-target");return 1!==b.length?(c=b[0].innerText,d=b[1].innerText):d=b[0].innerText,{org:c,branch:d}}var params={token:"YOUR_TOKEN",userName:"Your Name",userEmail:"your@email.com",baseRepo:/(http.*?github\.com\/.*?\/.*?)\/pull/.exec(location.href)[1]},ghHeaderMeta=document.querySelector(".gh-header-meta"),commitRefs=ghHeaderMeta.querySelectorAll(".commit-ref"),baseRef=getOrgAndBranch(commitRefs[0]),prRef=getOrgAndBranch(commitRefs[1]);params.baseBranch=baseRef.branch,params.prBranch=prRef.branch,prRef.org?params.prRepo=params.baseRepo.replace(/github\.com\/(.*?)\//,"github.com/"+prRef.org+"/"):params.prRepo=params.baseRepo;var paramArray=[];Object.keys(params).forEach(function(a){paramArray.push(a+"="+encodeURIComponent(params[a]))}),window.open("https://webtask.it.auth0.com/api/run/wt-kent+github-doddsfamily_us-0/rebase-and-merge?webtask_no_cache=1&"+paramArray.join("&"),"_blank");
```

Then [turn it into a bookmarklet](http://mrcoles.com/bookmarklet/)

Then navigate to the PR on github.

Then click your bookmarklet

Then it's rebased and merged!


