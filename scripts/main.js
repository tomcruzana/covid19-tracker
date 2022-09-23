// https://documenter.getpostman.com/view/10808728/SzS8rjbc#intro
// https://api.covid19api.com/dayone/country/philippines
// https://codepen.io/kristen17/pen/PoemNzM

/******************************************* dom selectors **/
// sidebar
const countrylinks = document.querySelector(".sidebarlinks");
const input = document.querySelector(".input");
const inputSuggestions = document.querySelector(".input-suggestions");

//ket statistics
const lastUpdated = document.querySelector(".last-updated");
const newConfirmed = document.querySelector(".new-confirmed");
const newDeaths = document.querySelector(".new-deaths");
const newRecovered = document.querySelector(".new-recovered");
const totalConfirmed = document.querySelector(".total-confirmed");
const totalDeaths = document.querySelector(".total-deaths");
const totalRecovered = document.querySelector(".total-recovered");

/******************************************* global variable**/
let countriesNames = [];

/******************************************* events listeners**/
// page load
window.addEventListener("load", (event) => {
  // fetch country names
  getCountries(options)
    .then((response) => {
      response.forEach((e) => {
        console.log(e);
        countriesNames.push(String(e.Country).toLowerCase());
      });
    })
    .catch((err) => console.error(err));

  // fetch statistics summary of each country
  getStatistics(options)
    .then((summary) => {
      console.log(summary);
      lastUpdated.textContent = String(summary.Global.Date).substring(0, 10);
      newConfirmed.textContent = summary.Global.NewConfirmed;
      newDeaths.textContent = summary.Global.NewDeaths;
      newRecovered.textContent = summary.Global.NewRecovered;
      totalConfirmed.textContent = summary.Global.TotalConfirmed;
      totalDeaths.textContent = summary.Global.TotalDeaths;
      totalRecovered.textContent = summary.Global.TotalRecovered;
    })
    .catch((err) => console.error(err));
});

// input change
input.addEventListener("input", (e) => {
  let filteredProducts;
  let query = "";

  // clear result-set each changes to avoid duplication
  inputSuggestions.innerHTML = "";

  // assign search input box value
  query = String(input.value).toLowerCase();

  // filter relevant data as per search query
  filteredProducts = countriesNames.filter((q) => q.startsWith(query));

  // show result-set
  filteredProducts.forEach(
    (e) =>
      (inputSuggestions.innerHTML += `<div class="link"><h5>${e}</h5></div>`)
  );

  // clear result-set if searchbox is empty
  if (input.value.length === 0) inputSuggestions.innerHTML = "";
});

// event delegation for county links
// assign target to input value
inputSuggestions.addEventListener("click", function (e) {
  let country;
  if (e.target.tagName === "DIV") {
    // remove the tags if a div is clicked
    const temp = String(e.target.innerHTML).replace("<h5>", "");
    country = temp.replace("</h5>", "");
    input.value = country;
  } else if (e.target.tagName === "H5") {
    input.value = e.target.innerHTML;
  }
});

/******************************************* http requests **/

// configuration options
const options = {
  method: "GET",
};

// get countries names
async function getCountries(options) {
  const response = await fetch(`https://api.covid19api.com/countries`, options);
  const countries = await response.json();

  return countries;
}

// get statistics
async function getStatistics(options) {
  const response = await fetch(`https://api.covid19api.com/summary`, options);
  const summary = await response.json();

  return summary;
}
