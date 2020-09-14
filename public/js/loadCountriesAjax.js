let  xhr = new XMLHttpRequest();

xhr.onreadystatechange = function()
{
  if(this.readyState === 4 && this.status === 200)
  {
    //let countries = JSON.parse(xhr.responseText);
    let countries = JSON.parse(this.responseText);

    //assign country names to selection menu
    populateCountryNames(countries);
  }
};

xhr.open('GET', '../data/countries.json', true);
xhr.send();

function populateCountryNames(countries){
    let selectionBox = document.getElementById("countries");

    //get the keys of country obj & store to the selection box  
    Object.keys(countries).forEach( country => {
        selectionBox.innerHTML += `<option>${country}</option>`; 
    })
}