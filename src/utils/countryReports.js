const request = require("request");

const countryReports = async (country, cb) => {
    const url = `https://api.covid19api.com/total/country/${country}`;

    request({url: url, json: true}, (err, res)=>{
        if (err){
        	cb(`An error occured ${err}` ,undefined)
        } //ADD AN ERROR HANDLING HERE FOR UNEXPECTED QUERIES. SEE WEATHER APP
        else{

        	let details = res.body.map(e =>{ //fetch and reformat data
				return{ 
					country: e.Country,
					date : e.Date, 
					confirmed : e.Confirmed,  
					recovered : e.Recovered,
					deaths : e.Deaths,
					active : e.Active
				}
			});

			cb(undefined, { body : details });
        }        
    });
};

module.exports = countryReports;