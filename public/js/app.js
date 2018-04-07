$(document).ready(function() {
  $.ajax({method: "GET", url: "/scrape"}).then(function(data) {
    console.log(data);
    populatePosts()
  })
});

populatePosts = function() {
  $.ajax({method: "GET", url: "/allPosts"}).then(function(data) {
    console.log(data);

    data.forEach(function(result) {
      $(".article-container").prepend(`
        <div class = "panel panel-default" > <div class="panel-heading">
          <h3>
            <a class="article-link" target="_blank" href="${result.url}">${result.headline}</a>
          </h3>
        </div>
        <div class="panel-body">${result.summary}</div>
        </div>
      `)
    })
  })
}
