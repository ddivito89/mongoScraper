$(document).ready(function() {
  // $.ajax({method: "GET", url: "/scrape"}).then(function(data) {
    populatePosts()
});

populatePosts = function() {
  $.ajax({method: "GET", url: "/allPosts"}).then(function(data) {

    data.forEach(function(result) {
      $(".article-container").prepend(`
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3>
              <a class="article-link" target="_blank" href="${result.url}">${result.headline}</a>
            </h3>
          </div>
          <div class="panel-body">${result.summary}</div>
          <br>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="add a comment" id="${result._id}-text">
            <button type="submit" class="btn btn-default comment-post" id="${result._id}">Submit</button>
          </div>
          <div class="panel-body" id="${result._id}-comments"></div>
        </div>
        `)

        if (result.comments.length > 0){
          $(`#${result._id}-comments`).val('')
          result.comments.forEach(function(result1){
            $(`#${result._id}-comments`).prepend(`<p>${result1.text}</p>`)
          })
        }
    })

    $('.comment-post').on('click', function(){
      var id = $(this).attr('id')
      var comment = $(`#${id}-text`).val().trim()
        $.ajax({
          method: "POST",
          url: `/articles/${id}`,
          data: {
            id: id,
            text: comment
          }
        })
        .then(function(data) {
          $(`#${id}-text`).val("")
          populateComment(data._id)
        });
    })
  })
}

populateComment = function(id) {
  $.ajax({method: "GET", url: `/comments/${id}`}).then(function(result) {

    if (result.comments.length > 0){
      $(`#${result._id}-comments`).val('')
      result.comments.forEach(function(result1){
        $(`#${result._id}-comments`).prepend(`<p>${result1.text}</p>`)
      })
    }

  })
}
