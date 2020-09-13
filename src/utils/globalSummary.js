const request = require("request");

const globalSummary = async (cb) => {
    const url = `https://api.covid19api.com/summary`;

    request({url: url, json: true}, (err, res)=>{
        if (err){
        	cb(`An error occured ${err}` ,undefined)
        } //ADD AN ERROR HANDLING HERE FOR UNEXPECTED QUERIES. SEE WEATHER APP
        else{

        	let countries = res.body.Countries.map(e =>{ //fetch and reformat data
				return{ 
					name : e.Country, 
					slug : e.Slug,  
					confirmed : e.TotalConfirmed,
					recovered : e.TotalRecovered,
					deaths : e.TotalDeaths,
					date: e.Date
				}
			});

			cb(undefined, { body : countries });
        }   
    });
};

module.exports = globalSummary;