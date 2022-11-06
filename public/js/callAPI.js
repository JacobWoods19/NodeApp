//get incidents from api
// Example response:
// [["883312c1-0f67-47a1-b5c8-23b29d380cfd","01/02/03","snow","18.42901","14.124124","test@gmail.com"],
// ["ca55c8b2-2494-4341-a878-8c7ea508a4b0","01/02/03","snow","18.42901","14.124124","test@gmail.com"]]


function deleteIncident(incident_id) {
    var payload = {
        id : incident_id
    };
    fetch('https://clownfish-app-y6vt9.ondigitalocean.app/resolve_incident?id='+incident_id, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: incident_id}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        console.log(incident_id);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    //refresh the page

}

const getIncidents = async (alert_type) => {
    const response = await fetch('https://clownfish-app-y6vt9.ondigitalocean.app/get_all_incidents');
    const myJson = await response.json(); 
    console.log(myJson);
    //do some error checking
    
    //create a table from the data returned
    let table = document.getElementById("incident_table");
    let tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    for (let i = 0; i < myJson.length; i++) {
        let row = document.createElement("tr")
        //add tailwind classes to the row
        row.classList.add("border-b-2", "border-gray-200", "hover:bg-gray-100", "py-10", "px-5");
        // add class to row
        tableBody.appendChild(row);
        for (let j = 0; j < myJson[i].length - 1; j++) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode(myJson[i][j]);
            cell.appendChild(cellText);
            row.appendChild(cell);

        }
        //add button to delete row from table and database api
        let cell = document.createElement("td");
        let button = document.createElement("button");
        button.classList.add("bg-red-500", "hover:bg-red-700", "text-white", "font-bold", "py-2", "px-4", "rounded");
        button.innerHTML = "Reslove";
        button.addEventListener("click", function() {
            deleteIncident(myJson[i][0]);
            row.remove();
        }
        );
        cell.appendChild(button);
        row.appendChild(cell);

    }
    // add each long and lat to the map
}
const getAverageResponseTime = async () => {
    const response = await fetch('https://clownfish-app-y6vt9.ondigitalocean.app/get_average_response');
    const myJson = await response.json();
    console.log(myJson);
    //response in days
    // {
    //     "average": 7127.0
    // }
    let average = myJson.average;
    //set to document element id avg_response_time 
    document.getElementById("avg_response_time").innerHTML = average + " days";
}
//Populate chart with api data of response times
//Example response:     
//returns array of response times for each resolved report
// [ {date, days to respond}, {date, days to respond}, ...]
const getResponseTimes = async () => {
    const response = await fetch('https://clownfish-app-y6vt9.ondigitalocean.app/get_chart_data');
    const myJson = await response.json();
    //populate my chart with the data from the api
    //build the chart data
    let labels = [];
    let data = [];
    for (let i = 0; i < myJson.length; i++) {
        labels.push(myJson[i].date);
        data.push(myJson[i].response_time);
    }
    console.log("Data:")
    console.log(data);
    console.log("Labels:")
    console.log(labels);
    const data_dict = {
        labels: labels,
        datasets: [{
          label: 'Response Time Over Time',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: data,
        }]
      };
    const config = {
        type: 'line',
        data: data_dict,
        options: {}
    };
    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}
//Build radar chart based on the data from the api
//Example response:
// {[category1, category2, category3], [avg_response_time1, avg_response_time2, avg_response_time3]}
const getRadarData = async () => {
    const response = await fetch('https://clownfish-app-y6vt9.ondigitalocean.app/avg_response_time_by_category');
    const myJson = await response.json();
    console.log(myJson);
    //build the chart data
    let labels = [];
    let data = [];
    for (let i = 0; i < myJson[0].length; i++) {
        labels.push(myJson[0][i]);
        data.push(myJson[1][i]);
    }
    console.log("Data:")
    console.log(data);
    console.log("Labels:")
    console.log(labels);
    const data_dict = {
        labels: labels,
        datasets: [{
            label: 'Average Response Time by Category',
            data: data,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1
        }]
    };
    const config = {
        type: 'doughnut',
        data: data_dict,
        options: {
        }
    };
    var myChart = new Chart(
        document.getElementById('radarChart'),
        config
    );
}

    
    


getAverageResponseTime();
getIncidents();
getResponseTimes();
getRadarData();

