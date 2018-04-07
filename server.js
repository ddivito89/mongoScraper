var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
  axios.get("http://www.techcrunch.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".post-block").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this).children("header").children("h2").children("a").text();
      result.url = $(this).children("header").children("h2").children("a").attr("href");
      result.summary = $(this).find("p").text();

      db.Article.count({
        headline: result.headline
      }, function(err, count) {
        if (count == 0) {
          db.Article.create(result).then(function(dbArticle) {
            console.log(dbArticle);
          }).catch(function(err) {
            return res.json(err);
          });
        }
      });
    });
    res.send("Scrape Complete");
  });
});

app.get("/allPosts", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
})






app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
