"use strict";
const marked = require("marked");
const path = require("path");
const fs = require("fs");

const postsDirectoryt = path.join(__dirname, "posts");
fs.readdir(postsDirectoryt, function(err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function(file) {
    
  });

});
