'use strict';

class Map {
    constructor(lat,lon) {
    this.lat = lat;
    this.lon = lon;


    };

// Initialisation de la carte

    initMap() {
        var macarte = L.map('map').setView([this.lat, this.lon], 11);
        // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(macarte);

        //Récupération des stations de vélo + Attribution des marqueurs

        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=cergy-pontoise&apiKey=0011765f39add360397de65f4aa75c3fc275c182", function (reponse) {
            var butResa = document.getElementById("butReservation");
            const listeStations = JSON.parse(reponse);

            listeStations.forEach(station => {

                console.log(station.status + " " + station.name);
                var myGreenIcon = L.icon({
                    iconUrl: 'images/greenMark.png',
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [-3, -76],
                });

                var myRedIcon = L.icon({
                    iconUrl: 'images/redMark.png',
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [-3, -76],
                });

                var marker ="";
                if (station.status === "OPEN") {
                   marker = L.marker([station.position.lat,station.position.lng], { icon: myGreenIcon }).addTo(macarte);
                }
                else {
                    marker = L.marker([station.position.lat,station.position.lng], { icon: myRedIcon }).addTo(macarte);
                }

                //Affichage des infos de la station lors d'un clic sur son marker

                marker.addEventListener("click", function() {
                    console.log(station.name);
                    document.getElementById("infoStations").classList.remove("hid");
                    document.getElementById("form").style.display = "none";
                    var address = document.getElementById("adresseStation");
                    var state = document.getElementById("etatStation");
                    var avail = document.getElementById("veloDispo");
                    var space = document.getElementById("attacheDispo");
                    var stateStation = "";

                    if (station.status === "OPEN") {
                        stateStation = "Station ouverte"
                    }
                    else {stateStation = "Station fermée"}

                    address.innerHTML = "";
                    state.innerHTML= "";
                    avail.innerHTML= "";
                    space.innerHTML= "";

                    address.innerHTML += station.address;
                    state.innerHTML += stateStation;
                    avail.innerHTML += station.available_bikes;
                    space.innerHTML += station.available_bike_stands;

                    //Nettoyage + Mise en mémoire de l'adresse de la station sélectionnée

                    sessionStorage.clear();
                    sessionStorage.setItem("stationAdress", station.address);

                    //Vidage du canvas si déjà précédemment rempli
                    canvas.clearCanvas();

                    butResa.classList.remove("hid");
                    butResa.style.display = "block";

                    butResa.addEventListener("click", function(){
                        document.getElementById("form").style.display = "flex";
                        document.getElementById("infoStations").classList.add("hid");
                        if(reservation.nom !== "") {
                            document.getElementById("inputLastName").value = reservation.nom;
                            document.getElementById("inputFirstName").value = reservation.prenom;
                        }
                });

            })

        });

    });
}}

/* Récupère les infos des stations*/


/*Une fois le tableau récupéré
-> Mettre chaque données utiles dans une variable spécifique grâce à une fonction forEach

--> Créer un objet Station reprenant en paramètre les données utiles uniquement.

Infos utiles :
adresse,
placeDispo,
veloDispo,
totalPlace,
nom,
position,
statut
*/
