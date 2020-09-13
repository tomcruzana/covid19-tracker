const path = require("path");
const hbs = require("hbs");
const request = require("request");
const express = require("express");
const globalSummary = require("./utils/globalSummary");
const countryReports = require("./utils/countryReports");
const port = process.env.PORT || 9000;

const app = express();

//paths for express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");

//template engine
app.set("view engine", "hbs");
app.set("views", viewsPath); //set the view dir to templates dir

//use static files
app.use(express.static(publicDirPath));

app.get("/", (req, res)=>{ //homepage
	res.send("Welcome to covid19 tracker");
});

app.get("/global-summary", (req, res)=>{ //api endpoint global summary
	globalSummary((err, data)=>{
		(err) ? res.status(400).send(err) : res.send({ data });
	});
});

app.get("/reports", (req, res)=>{ //api endpoint country report
	countryReports(req.query.country, (err, data)=>{
		(err) ? res.status(400).send(err) : res.send({ data });
	});

});

app.listen(port, ()=>{
    console.log("server running on port" + port);
});

//https://api.covid19api.com/summary
//https://api.covid19api.com/dayone/country/united-states