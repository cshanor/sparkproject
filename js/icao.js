// Add ENTER key functionality to the text field
document.getElementById('icao-code').addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('city-button').click();
    }
});

// Event listener for button click
document.getElementById('city-button').addEventListener('click', getIcao);

function getIcao() {

    let icaoInput = document.getElementById('icao-code').value;
    let icaoCode = icaoInput.toUpperCase();

    // If code entered by user is > 4 || < 4, an alert will display notifying them.
    if (icaoCode.length === 4) {

    } else {
        let fields = document.getElementsByClassName('col-75');
        for (let i = 0; i < fields.length; i++) {
            fields[i].value = '';
        }
        alert("Airport code must be a 4 character ICAO code. Ex: KJFK, KLAX, KDFW");
    }

    // Create a new XMLHttpRequest() to GET data from Laminar API. Template literal is used to pass in the value
    // the user enters. This is different from the arrival and departure pages as this API returns data from XML
    let xhrICAO = new XMLHttpRequest();
    xhrICAO.open('GET', `https://api.laminardata.aero/v1/aerodromes/${icaoCode}?user_key=a907c4e438124b05eb567e5a084d6758`, true);

    xhrICAO.onload = function() {

        // If response status equals 200, proceed with displaying data
        if (this.status == 200) {

            xmlDoc = this.responseXML;

            txt = "";

            // The for loop iterates through the XML response and finds all values with the "aixm:name" tag.
            // mapTxt1 and mapTxt2 replace all instances of a space and / in the string, for improved
            // compatibility with the map URL. 
            x = xmlDoc.getElementsByTagName('aixm:name');
            for (i = 0; i < x.length; i++) {
                txt = txt + x[i].childNodes[0].nodeValue + '';
                mapTxt1 = txt.replace(/ /g, "%20");
                mapTxt2 = mapTxt1.replace(/\//g, "%2F");
            }
            document.getElementById('output-title').innerHTML = '<h2>Airport Name/City</h2>';
            document.getElementById('output-field').innerHTML = '<h4>' + txt + `<p><div style="width: 100%"><iframe width="100%" height="600" src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=${mapTxt2}+(My%20Business%20Name)&amp;ie=UTF8&amp;t=h&amp;z=15&amp;iwloc=B&amp;output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"><a href="https://www.maps.ie/map-my-route/">Plot a route map</a></iframe></div><br /></p>`;
        }
    }
    xhrICAO.send();
}