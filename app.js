const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res) {
	res.render("home");
});

app.get("/failure", function(req,res) {
	res.render("failure");
})

app.post("/", function(req,res) {
	const reqCountry = req.body.country[0].toLowerCase();
	const covidUrl = "https://api.covid19api.com/total/country/" + reqCountry;
	axios.get(covidUrl)
	.then(resp => {
	const countryData = resp.data[resp.data.length - 1];
    res.render("city-info", {confirmed: countryData.Confirmed, recovered: countryData.Recovered, active: countryData.Active, deaths: countryData.Deaths});
})
	.catch(function (error) {
        res.redirect("/failure");
    });

});

app.get("/city-info", function(req,res) {
	res.render("city-info");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started.");
});