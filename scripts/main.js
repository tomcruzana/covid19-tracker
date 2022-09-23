// https://documenter.getpostman.com/view/10808728/SzS8rjbc#intro
// https://api.covid19api.com/dayone/country/philippines
// https://codepen.io/kristen17/pen/PoemNzM

/******************************************* dom selectors **/
const countrylinks = document.querySelector(".sidebarlinks");
const input = document.querySelector(".input");
const inputSuggestions = document.querySelector(".input-suggestions");

/******************************************* global variable**/
let countries = [];

/******************************************* events listeners**/
window.addEventListener("load", (event) => {
  getStatistics(options)
    .then((response) => {
      response.forEach((e) => {
        console.log(e.Country);
        countries.push(String(e.Country).toLowerCase());
      });
    })
    .catch((err) => console.error(err));
});

input.addEventListener("input", (e) => {
  let filteredProducts;
  let query = "";

  // clear result-set each changes to avoid duplication
  inputSuggestions.innerHTML = "";

  // assign search input box value
  query = String(input.value).toLowerCase();

  // filter relevant data as per search query
  filteredProducts = countries.filter((q) => q.startsWith(query));

  // show result-set
  filteredProducts.forEach(
    (e) =>
      (inputSuggestions.innerHTML += `<div class="link"><h5>${e}</h5></div>`)
  );

  // clear result-set if searchbox is empty
  if (input.value.length === 0) inputSuggestions.innerHTML = "";
});

/******************************************* http requests **/

// configuration options
const options = {
  method: "GET",
};

// get statistics
async function getStatistics(options) {
  const response = await fetch(`https://api.covid19api.com/countries`, options);
  const countries = await response.json();

  return countries;
}
