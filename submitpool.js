var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var express = require("express");
var myParser = require("body-parser");
var app = express();
app.use(myParser.urlencoded({ extended: true }));
app.post("/yourpath", function (request, response) {
    console.log(request.body); //This prints the JSON document received (if it is a JSON document)
});

//Start the server and make it listen for connections on port 8080

app.listen(8080);