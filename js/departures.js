document.getElementById('blue-button').addEventListener('click', getData);

function getData() {

    // Gathering all the values provided by the user.

    let airportInput = document.getElementById('airport').value;
    let beginDate = document.getElementById('b-date').value;
    let endDate = document.getElementById('e-date').value;

    // Convert the dates entered by the user into unix time, which is the format the API accepts
    // in the request. Date.parse turns the date into unix, which is then divided by 1000 to get
    // seconds.

    let bDateUnix = Date.parse(beginDate);
    let bDate = bDateUnix / 1000;

    //console.log(beginTime);

    let eDateUnix = Date.parse(endDate);
    let eDate = eDateUnix / 1000;

    let airportCode = airportInput.toUpperCase();

    // Validate length of airport code. Must be 4 (ICAO) characters long.
    if (airportCode.length === 4) {
        console.log(airportCode);
    } else {
        let fields = document.getElementsByClassName('col-75');
        for (let i = 0; i < fields.length; i++) {
            fields[i].value = '';
        }
        alert("Airport code must be a 4 character ICAO code. Ex: KJFK, KLAX, KDFW");
    }

    let xhrAirport = new XMLHttpRequest();
    xhrAirport.open('GET', `https://cshanor:od1NraVen@opensky-network.org/api/flights/departure?airport=${airportCode}&begin=${bDate}&end=${eDate}`, true);

    xhrAirport.onload = function() {
        if (this.status == 200) {
            let airportRequestData = JSON.parse(this.responseText);

            let output = '';
            for (let i in airportRequestData) {

                let firstTime = airportRequestData[i].firstSeen;
                let lastTime = airportRequestData[i].lastSeen;
                let arrivalAirport = airportRequestData[i].estArrivalAirport;
                let departureAirport = airportRequestData[i].estDepartureAirport;
                let _callSign = airportRequestData[i].callsign;
                let icaoHex = airportRequestData[i].icao24;

                // The API only accepts CAPS as the case for the airport code, so here we ensure the airport
                // code entered by the user is sent as ALL CAPS.
                let departDate = new Date(0);
                departDate.setUTCSeconds(firstTime);

                let arriveDate = new Date(0);
                arriveDate.setUTCSeconds(lastTime);

                outputTitle = '<h2>Departures at ' + departureAirport + '</h2><br/><br/>';

                output +=
                    '<div class="output">' +
                    '<ul>' +
                    '<li>Departure Airport: ' + departureAirport + '</li>' +
                    '<li>Arrival Airport: ' + arrivalAirport + '</li>' +
                    '<li>Flight Number/Callsign: ' + _callSign + '</li>' +
                    '<li>Transponder Code: ' + icaoHex + '</li>' +
                    '<li>Estimate Departure Time: ' + departDate + '</li>' +
                    '<li>Estimate Arrival Time: ' + arriveDate + '</li>' +
                    '</ul>' +
                    '<br/><hr/><br/>' +
                    '</div>';
            }
            document.getElementById("output-data-title").innerHTML = outputTitle;
            document.getElementById("output-data").innerHTML = output;
        }
    }
    xhrAirport.send();
}