/******************************************* dom selectors **/
// sidebar
const countrylinks = document.querySelector(".sidebarlinks");
const input = document.querySelector(".input");
const inputSuggestions = document.querySelector(".input-suggestions");

//key statistics
const newLabels = document.querySelectorAll(".new-label");
const lastUpdated = document.querySelector(".last-updated");
const newConfirmed = document.querySelector(".new-confirmed");
const newDeaths = document.querySelector(".new-deaths");
const newRecovered = document.querySelector(".new-recovered");
const totalConfirmed = document.querySelector(".total-confirmed");
const totalDeaths = document.querySelector(".total-deaths");
const totalRecovered = document.querySelector(".total-recovered");

// covid chart loader
const covidChartContainer = document.querySelector(".covid-chart-container");
const chartLoaderContainer = document.querySelector(".chart-loader-container");

/******************************************* global variable**/
let countriesSlug = [];
let coutryStats = [];
let isChartGenerated = false;
let covidCanvas;
let myChart;

/******************************************* global functions**/
// generate chart
async function generateChart(lastConfirmed, lastDeaths, lastRecovered) {
  covidCanvas = document.createElement("canvas");
  covidCanvas.setAttribute("id", "myChart");
  covidChartContainer.appendChild(covidCanvas);

  const ctx = document.getElementById("myChart");

  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Confirmed", "Deaths", "Recovered"],
      datasets: [
        {
          label: "Covid 19 Records",
          data: [lastConfirmed, lastDeaths, lastRecovered],
          backgroundColor: [
            "rgba(255, 206, 86, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  isChartGenerated = true;
}

// find country input
async function findCountry(countryName) {
  console.log("Log: findCountry executed");
  getStatusStatistics(countryName, options)
    .then((response) => {
      console.log("log: " + response);

      // get the last case from the status arrays
      const confirmed = response.confirmed;
      const deaths = response.deaths;
      const recovered = response.recovered;
      const lastConfirmed = confirmed[confirmed.length - 1].Cases;
      const lastDeaths = deaths[deaths.length - 1].Cases;
      const lastRecovered = recovered[recovered.length - 1].Cases;

      // hide loader
      chartLoaderContainer.classList.add("hide");

      // hide new statuses since this endpoint don't have these info
      for (const label of newLabels) {
        label.classList.add("hide");
      }
      newConfirmed.classList.add("hide");
      newDeaths.classList.add("hide");
      newRecovered.classList.add("hide");

      // update status values
      totalConfirmed.textContent = lastConfirmed;
      totalDeaths.textContent = lastDeaths;
      totalRecovered.textContent = lastRecovered + lastConfirmed / 1.5; // fake data

      // create covid chart based on the country stats args
      generateChart(
        lastConfirmed,
        lastDeaths,
        lastRecovered + lastConfirmed / 1.5 // fake data
      );
    })
    .catch((err) => console.error(err));
}

/******************************************* events listeners**/
// page load
window.addEventListener("load", (event) => {
  // fetch country names
  getCountries(options)
    .then((response) => {
      response.forEach((e) => {
        console.log(e);
        countriesSlug.push(String(e.Slug).toLowerCase());
      });
    })
    .catch((err) => console.error(err));

  // on page load fetch global statistics summary
  getGlobalStatistics(options)
    .then((summary) => {
      console.log(summary);
      // error handling
      // if a message is detected in the api, exec alert msg
      if (String(summary.Message).length > 0) {
        Swal.fire({
          title: "API Error!",
          text: summary.Message + ". Please try again later.",
          icon: "error",
          confirmButtonText: "Refresh",
        });
        return;
      }

      // show these status if hidden
      for (const label of newLabels) {
        label.classList.remove("hide");
      }
      newConfirmed.classList.remove("hide");
      newDeaths.classList.remove("hide");
      newRecovered.classList.remove("hide");

      // update status values
      lastUpdated.textContent = String(summary.Global.Date).substring(0, 10);
      newConfirmed.textContent = summary.Global.NewConfirmed;
      newDeaths.textContent = summary.Global.NewDeaths;

      // newRecovered.textContent = summary.Global.NewRecovered;
      // test fake data
      newRecovered.textContent = summary.Global.NewConfirmed * 2;

      totalConfirmed.textContent = summary.Global.TotalConfirmed;
      totalDeaths.textContent = summary.Global.TotalDeaths;

      // totalRecovered.textContent = summary.Global.TotalRecovered;
      // test fake data
      totalRecovered.textContent = summary.Global.TotalConfirmed / 1.5;

      // hide loader
      chartLoaderContainer.classList.add("hide");

      // create covid chart based on the global stats args
      generateChart(
        summary.Global.TotalConfirmed,
        summary.Global.TotalDeaths,
        summary.Global.TotalConfirmed / 1.5 //fake data
      );
    })
    .catch((err) => console.error(err));
});

// input change
input.addEventListener("input", (e) => {
  let filteredQuery;
  let query = "";

  // clear result-set each changes to avoid duplication
  inputSuggestions.innerHTML = "";

  // assign search input box value
  query = String(input.value).toLowerCase();

  // filter relevant data as per search query
  filteredQuery = countriesSlug.filter((q) => q.startsWith(query));

  // show result-set
  filteredQuery.forEach(
    (e) =>
      (inputSuggestions.innerHTML += `<div class="link"><h5>${e}</h5></div>`)
  );

  // clear result-set if searchbox is empty
  if (input.value.length === 0) inputSuggestions.innerHTML = "";
});

// event delegation for county links
// assign target to input value
// & load statistics to chart nad key stats
inputSuggestions.addEventListener("click", function (e) {
  // delete canvas covid chart element
  // destory existing covid chart
  covidCanvas.remove();
  myChart.destroy();

  // show loader
  chartLoaderContainer.classList.remove("hide");

  // process input selection
  let country;
  if (e.target.tagName === "DIV") {
    // remove the tags if a div is clicked
    const temp = String(e.target.innerHTML).replace("<h5>", "");
    country = temp.replace("</h5>", "");
    input.value = country;
    findCountry(input.value);
  } else if (e.target.tagName === "H5") {
    input.value = e.target.innerHTML;
    findCountry(input.value);
  }

  // clear the suggestions
  inputSuggestions.innerHTML = "";
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

// get global statistics
async function getGlobalStatistics(options) {
  const response = await fetch(`https://api.covid19api.com/summary`, options);
  const summary = await response.json();

  return summary;
}

// get all status statistics
async function getStatusStatistics(countrySlug, options) {
  const responseConfirmed = await fetch(
    `https://api.covid19api.com/total/country/${countrySlug}/status/confirmed`,
    options
  );

  const responseDeaths = await fetch(
    `https://api.covid19api.com/total/country/${countrySlug}/status/deaths`,
    options
  );

  const responseRecovered = await fetch(
    `https://api.covid19api.com/total/country/${countrySlug}/status/recovered`,
    options
  );

  const confirmed = await responseConfirmed.json();
  const deaths = await responseDeaths.json();
  const recovered = await responseRecovered.json();

  // return all cases as an object!!!
  return { confirmed, deaths, recovered };
}
