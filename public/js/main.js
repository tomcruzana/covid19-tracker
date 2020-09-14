
const caseSummary = document.querySelector(".case-summary");
const CountrySelectionBox = document.getElementById("countries");
const moreDetails = document.getElementById("more-details-btn");

const totalConfirmedLabel = document.querySelector(".tconfirmed");
const totalRecoveredLabel = document.querySelector(".trecovered");
const totalDeathsLabel = document.querySelector(".tdeaths");
const lastUpdateLabel = document.querySelector(".lupdate");

const gnewConfirmedLabel = document.querySelector(".gnconfirmed");
const gtotalConfirmedLabel = document.querySelector(".gtconfirmed");
const gnewRecoveredLabel = document.querySelector(".gnrecovered");
const gtotalRecoveredLabel = document.querySelector(".gtrecovered");
const gnewDeathsLabel = document.querySelector(".gndeaths");
const gtotalDeathsLabel = document.querySelector(".gtdeaths");

caseSummary.style.display = "none";

//load global cases
window.addEventListener('load', async (event) => {
    await fetch("https://api.covid19api.com/summary")
        .then(responseData => responseData.json())
        .then(responseJSON => {
            gnewConfirmedLabel.textContent = responseJSON.Global.NewConfirmed;
            gtotalConfirmedLabel.textContent = responseJSON.Global.TotalConfirmed;

            gnewRecoveredLabel.textContent = responseJSON.Global.NewRecovered;
            gtotalRecoveredLabel.textContent = responseJSON.Global.TotalRecovered;

            gnewDeathsLabel.textContent = responseJSON.Global.NewDeaths;
            gtotalDeathsLabel.textContent = responseJSON.Global.TotalDeaths;

            //show global cases modal 
            $(document).ready(function(){
                $(".modal").modal('show');
            });
        })
        .catch( err => alert(err));
});

//selection box for country names
CountrySelectionBox.addEventListener("change", e =>{
    console.log(CountrySelectionBox.value); //temp
    caseSummary.style.display = "block";
    
    fetch("/global-summary")
        .then(response => response.json())
        .then(responseData => {

           //if countryname json data includes obj.values then do something
           responseData.data.body.forEach(e => {
                if (e.name.includes(CountrySelectionBox.value)){
                    totalConfirmedLabel.textContent = e.confirmed;
                    totalRecoveredLabel.textContent = e.recovered;
                    totalDeathsLabel.textContent = e.deaths;
                    lastUpdateLabel.textContent = e.date;
                    return 0;
                }
           });
        })
        .catch( err => alert(err));
});

//more details button
moreDetails.addEventListener("click", e =>{
    e.preventDefault();
    location.assign(`/statistics?country=${CountrySelectionBox.value}`); //goto this route and pass url params to query string 
});

