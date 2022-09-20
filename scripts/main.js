// https://rapidapi.com/api-sports/api/covid-193/

// dom selector
const cname = document.querySelector(".name");
const population = document.querySelector(".population");

const cases = document.querySelector(".cases");
const casesNew = document.querySelector(".cases-new");
const casesActive = document.querySelector(".cases-active");
const casesCritical = document.querySelector(".cases-critical");
const casesRecovered = document.querySelector(".cases-recovered");
const casesTotal = document.querySelector(".cases-total");

const deaths = document.querySelector(".deaths");
const deathsNew = document.querySelector(".deaths-new");
const deathsTotal = document.querySelector(".deaths-total");

const tests = document.querySelector(".tests");
const testsTotal = document.querySelector(".tests-total");

// country object
// this is where we map the data from the api
let country = {
  name: "",
  continent: "",
  population: "",
  cases: { new: "", active: "", critical: "", recovered: "", total: "" },
  deaths: { new: "", total: "" },
  tests: { total: "" },
};

let trace1 = {
  x: ["2020-10-04", "2021-11-04", "2023-12-04"],
  y: [90, 40, 60],
  type: "scatter",
  name: "asdasd123",
};

let trace2 = {
  x: ["2020-10-04", "2021-11-04", "2023-12-04"],
  y: [100, 60, 80],
  type: "scatter",
  name: "asdasd22",
};

let trace3 = {
  x: ["2020-10-04", "2021-11-04", "2023-12-04"],
  y: [200, 100, 30],
  type: "scatter",
  name: "asdasd33",
};

let data = [trace1, trace2, trace3];

let layout = {
  title: "Covid 19 Data",
  showlegend: true,
};

let config = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: [
    "toImage",
    "lasso2d",
    "select",
    "zoom",
    "autoScale",
    "resetScale",
  ],
};

Plotly.newPlot("myDiv", data, layout, config);

// http requests
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "6b85ac3dc4msh0272b28a2fa5cbap179e8cjsnce4a1722e040",
    "X-RapidAPI-Host": "covid-193.p.rapidapi.com",
  },
};

// get countries
fetch("https://covid-193.p.rapidapi.com/countries", options)
  .then((data) => data.json())
  .then((json) => {
    console.log(json.response);
  })
  .catch((err) => console.error(err));

// get statistics
country.name = "usa";

fetch(
  `https://covid-193.p.rapidapi.com/statistics?country=${country.name}`,
  options
)
  .then((response) => response.json())
  .then((json) => {
    // country details, cases, death, tests
    const res = json.response[0];
    country.name = json.parameters.country;
    country.continent = res.continent;
    country.population = res.population;

    country.cases.new = res.cases.new;
    country.cases.active = res.cases.active;
    country.cases.critical = res.cases.critical;
    country.cases.recovered = res.cases.recovered;
    country.cases.total = res.cases.total;

    country.deaths.new = res.deaths.new;
    country.deaths.total = res.deaths.total;

    country.tests.total = res.tests.total;

    //to-do : refactor make async await
    cname.textContent = country.name;
    population.textContent = country.population;
    casesNew.textContent = country.cases.new;
    casesActive.textContent = country.cases.active;
    casesCritical.textContent = country.cases.critical;
    casesRecovered.textContent = country.cases.recovered;
    casesTotal.textContent = country.cases.total;
    deathsNew.textContent = country.deaths.new;
    deathsTotal.textContent = country.deaths.total;
    testsTotal.textContent = country.tests.total;
  })
  .catch((err) => console.error(err));

// get history
fetch(
  `https://covid-193.p.rapidapi.com/history?country=${country.name}`,
  options
)
  .then((response) => response.json())
  .then((json) => {
    console.log(json);
    // country details, cases, death, tests
    console.log(`
          ${json.parameters.country}
          ${json.response[0].continent}
          ${json.response[0].population}
  
          ${json.response[0].cases.new}
          ${json.response[0].cases.active}
          ${json.response[0].cases.critical}
          ${json.response[0].cases.recovered}
          ${json.response[0].cases.total}
  
          ${json.response[0].deaths.new}
          ${json.response[0].deaths.total}
  
          ${json.response[0].tests.total}
      `);
  })
  .catch((err) => console.error(err));
