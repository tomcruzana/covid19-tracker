import { chartAxes } from "./app.js";

export const drawChart = () =>{
    //Draw a new chart
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartAxes.xDays,
            datasets: [{
                    label: 'Active',
                    data: chartAxes.yActiveData, 
                    backgroundColor: 'rgba(0, 123, 255, 1)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2,
                    fill: false,
                    lineTension: 0,
                    hitRadius: 100
                }, {
                    label: 'Confirmed',
                    data: chartAxes.yConfirmedData,
                    backgroundColor: 'rgba(255, 193, 7, 1)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 2,
                    fill: false,
                    lineTension: 0,
                    hitRadius: 100
                }, {
                    label: 'Recovered',
                    data: chartAxes.yRecoveredData,
                    backgroundColor: 'rgba(40, 167, 69, 1)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 2,
                    fill: false,
                    lineTension: 0,
                    hitRadius: 100
                }, {
                    label: 'Deaths',
                    data: chartAxes.yDeathsData,
                    backgroundColor: 'rgba(220, 53, 69, 1)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 2,
                    fill: false,
                    lineTension: 0,
                    hitRadius: 100
                }]     
        },options: { elements: { point: { radius: 0 } } }
        });
}
