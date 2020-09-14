const fs = require('fs');
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
const partialsPath = path.join(__dirname, "../templates/partials")

//template engine
app.set("view engine", "hbs");
app.set("views", viewsPath); //set the view dir to templates dir
hbs.registerPartials(partialsPath); //partial hbs html templates dir

//use static files
app.use(express.static(publicDirPath));



app.get("/", (req, res)=>{ //homepage
	res.render("index"); //looks in the view dir by default
});

app.get("/statistics", (req, res)=>{ //country
	// console.log(req.query.country);
	// if (req.query.country === undefined || req.query.country === null) {
    //   	res.redirect('/');
	// }
	res.render("country"); //looks in the view dir by default
});

app.get("/global-summary", (req, res)=>{ //api endpoint global summary
	globalSummary((err, data)=>{
		(err) ? res.status(400).send(err) : res.send({ data });
	});
});

app.get("/reports", (req, res)=>{ //api endpoint country report
	countryReports(req.query.country, (err, data)=>{
		//ex: reports?country=usa
		(err) ? res.status(400).send(err) : res.send({ data });
	});

});

app.get("*", (req, res)=>{ //404 not found
	res.render("404"); 
});

app.listen(port, ()=>{
    console.log("server running on port" + port);
});

//https://api.covid19api.com/summary
//https://api.covid19api.com/dayone/country/united-states