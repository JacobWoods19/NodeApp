//get incidents from api
// Example response:
// [["883312c1-0f67-47a1-b5c8-23b29d380cfd","01/02/03","snow","18.42901","14.124124","test@gmail.com"],
// ["ca55c8b2-2494-4341-a878-8c7ea508a4b0","01/02/03","snow","18.42901","14.124124","test@gmail.com"]]



// Call average responsons time api
function averageResponseTime() {
    fetch('https://clownfish-app-y6vt9.ondigitalocean.app/get_average_response')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("averageResponseTime").innerHTML = data;
    })
    .catch(err => {
        console.log(err);
    });
}


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
getIncidents();
averageResponseTime();
