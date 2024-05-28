/**
 * ESEQ/02705/2020
 * BRIAN NJOKI
 * 
 */

const nearbyFacilities = document.getElementById('nearby_facilities');

function initMap() {
    if (!navigator.geolocation) {
        console.error("Browser doesn't support geolocation");
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup('<b>Location</b>').openPopup();

    /*map.on("click", (event) => {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        fetchData(lat, lng);
    });*/
    const searchRadius = 5000;
    fetch(`http://localhost:3000/api/nearby-facilities?lat=${latitude}&lng=${longitude}&radius=${searchRadius}`)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            /*function onMarkerClick(institute) {
                // Calculate directions from user's location to the selected instituten
                L.Routing.control({
                    waypoints: [
                        L.latLng(latitude, longitude), // User's location
                        L.latLng(institute.latitude, institute.longitude) // Institute's location
                    ],
                    routeWhileDragging: true // Optionally, update route as user drags waypoints
                }).addTo(map);
            }
*/
            if (data && data.facilities) {
                data.institutes.forEach(facility => {
                    let markerIcon;
                    markerIcon = L.icon({
                        iconUrl: "./popups/hospital.png",
                        iconSize: [20, 20],
                        popupAnchor: [0, -34]
                    })
                    let marker = L.marker([facility.latitude, facility.longitude], { icon: markerIcon }).addTo(map)
                    marker.bindPopup(`<b>${facility.hfname.toUpperCase()}</b>`);


                });

                data.facilities.forEach(institute => {
                    let markerIcon;
                    markerIcon = L.icon({
                        iconUrl: "./popups/education.png",
                        iconSize: [20, 20],
                        popupAnchor: [0, -34]
                    });
                    let marker = L.marker([institute.latitude, institute.longitude], { icon: markerIcon }).addTo(map)
                    marker.bindPopup(`<b>${institute.instname.toUpperCase()}</b>`);

                });
            };


        })
        .catch(error => console.error('Error fetching nearby facilities:', error));

};

function error() {
    console.error('Get current position failed');
};


initMap();


