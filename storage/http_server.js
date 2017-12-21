var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path");

http.createServer(function (req, res) {
  if (req.url != "/movie.mp4") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end('<video src="http://localhost:8888/movie.mp4" controls></video>');
  } else {
    var file = path.resolve(__dirname,"Bata Mere Yaar Sudama - Bol Haryana Utsav 2017 - Rohtak.mp4");
    fs.stat(file, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.sendStatus(404);
        }
      res.end(err);
      }
      console.log(req.headers);
      console.log();
      var range = req.headers.range;
      if (!range) {
       // 416 Wrong range
       return res.sendStatus(416);
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });
  }
}).listen(8888);
