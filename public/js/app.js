import { drawChart } from "./covidChart.js";

const search = document.querySelector("input");
const searchCountryBtn = document.getElementById("search-country-btn");
const countryFlag = document.getElementById("country-flag-img");
const countryName = document.getElementById("country-name");
const activeLabel = document.getElementById("active-cases");
const confirmedLabel = document.getElementById("confirmed-cases");
const recoveredLabel = document.getElementById("recovered-cases");
const deathsLabel = document.getElementById("death-cases");
const lastUpdateLabel = document.getElementById("last-update-cases");

//statistical variables
export let chartAxes = {
    xDays : [],
    yActiveData : [],
    yConfirmedData : [],
    yRecoveredData : [],
    yDeathsData : []
}

//get query string of the current url & pass to the loadData function
const getQueryString = ( field, url ) => {
	let href = url ? url : window.location.href;
	let reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	let string = reg.exec(href);
	return string ? string[1] : null;
};

//nav search box
searchCountryBtn.addEventListener("click", async (e)=>{
    e.preventDefault();

    //validate search input box
    if(search.value === "" || search.value === null) { //update to regex
        alert("invalid input")
        return -1;
    }

    //TODO: validate country. have the user select from a filtered list

    //get data -- case summary of a country
    loadData("PH"); //add country code validation as params
    
    //empty search input box and toggle focus
    search.value = "";
    search.focus();
});

//get country's cases report
const loadData = async (countryCode) => {
    await fetch(`/reports?country=${getQueryString("country")}`)
            .then(response => response.json())
            .then(responseJSON => {

                //show country's case summary
                const lastUpdate = responseJSON.data.body[responseJSON.data.body.length - 1];
                countryFlag.src = `https://www.countryflags.io/${countryCode}/flat/64.png`; //temp
                countryName.textContent = lastUpdate.country;
                activeLabel.textContent = lastUpdate.active;
                confirmedLabel.textContent = lastUpdate.confirmed;
                recoveredLabel.textContent = lastUpdate.recovered;
                deathsLabel.textContent = lastUpdate.deaths;
                lastUpdateLabel.textContent = lastUpdate.date;

                //store statistical data to chartAxes object
                for (let i = 0; i < responseJSON.data.body.length; i++) {
                    chartAxes.xDays[i] = `Day ${i + 1}`;
                    chartAxes.yActiveData[i] = responseJSON.data.body[i].active;
                    chartAxes.yConfirmedData[i] = responseJSON.data.body[i].confirmed;
                    chartAxes.yRecoveredData[i] = responseJSON.data.body[i].recovered;
                    chartAxes.yDeathsData[i] = responseJSON.data.body[i].deaths;
                }
                console.log(chartAxes);

                //draw statistical chart
                drawChart();
            })
            .catch(err => alert(err));
};

loadData("PH"); 