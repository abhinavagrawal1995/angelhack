function initMap() {
  // Bhopal Coordinates - 23.2599° N, 77.4126
  var myLatlng = new google.maps.LatLng(23.0488204, 82.207838);

  var currentSource = '';
  var currentSourceCoord;
  var currentDestination = '';
  var currentDestinationCoord;
//Coordinates data
  
  var nodes = [{
        "coord": {
          "lat": 23.1993477,
          "lng": 77.2658056
        },
        "name": "ABC",
        "uniqueId": "dassad"
      }, {
        "coord": {
          "lat": 24.1993477,
          "lng": 73.2658056
        },
        "name": "CSD",
        "uniqueId": "REED"
      }, {
        "coord": {
          "lat": 25.1993477,
          "lng": 72.2658056
        },
        "name": "FAKLD",
        "uniqueId": "kjfwoej"
      }, {
        "coord": {
          "lat": 27.1993477,
          "lng": 76.2658056
        },
        "name": "dkf",
        "uniqueId": "djaksdas"
      }
    ];
  var pathSourceDestination;

  var mapOptions = {
    zoom: 6,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"),mapOptions);
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  
  //HACK since google map does not allows two path on same directions renderer
  var directionsDisplayPermanent = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "red"
    }
  });

  var marker = [];
  console.log("Adding "+ nodes.length + " markers.");
  for (var i=0; i<nodes.length; i++) {
    marker = new google.maps.Marker({
          position: nodes[i].coord,
          map: map,
          title: nodes[i].name
    });

    //TODO:: Assign unique identifier to each marker
    marker.set('id', nodes[i].uniqueId);
    // Allow each marker to have an info window    
    // 
    // Click listener
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            //infoWindow.setContent(infoWindowContent[i][0]);
            if(currentSource=="") {
              currentSource = marker.id;
              currentSourceCoord = marker.position;
              marker.setIcon("https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png");
              console.log("Source Selected as "+ marker.title + " with coordinates " + JSON.stringify(marker.position));  
            } else {
              if(marker.id==currentSource) {
                console.log("Source can not be same as the destination");
              } else {
                currentDestination = marker.id;
                currentDestinationCoord = marker.position;
                //marker.setIcon("https://cdn3.iconfinder.com/data/icons/location-set/50/location5-128.png");
                console.log("Source is already selected with unique id :"+currentSource);
                console.log("Updating destination :"+marker.title);

                directionsDisplayPermanent.setDirections({routes: []});
                pathSourceDestination = {
                  origin : currentSourceCoord,
                  destination : currentDestinationCoord,
                  travelMode : google.maps.TravelMode.DRIVING
                };
               
                //Empty the original path 
                directionsDisplayPermanent.setDirections({routes: []});
                console.log("Path from Soruce to destianation sets");

                directionsService.route(pathSourceDestination, function(response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplayPermanent.setOptions({ preserveViewport: true });
                        directionsDisplayPermanent.setOptions({ suppressMarkers: true });
                        directionsDisplayPermanent.setDirections(response);
                    }
                  });


              }
            }
            
        }
    })(marker, i));

    //Hover Listener
    google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
            //infoWindow.setContent(infoWindowContent[i][0]);
            if(currentSource!=''){
              console.log("Marker Postiion :", JSON.stringify(marker.position));
              //Source is selected 
              //Get the source and the destinationcoordinates
              //Call the direction map
              var start = currentSourceCoord;
              var end = marker.position;            
              directionsDisplay.setMap(map); // map should be already initialized.
              directionsDisplayPermanent.setMap(map); // map should be already initialized.

              var request = {
                  origin : start,
                  destination : end,
                  travelMode : google.maps.TravelMode.DRIVING
              };
         

              directionsService.route(request, function(response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                      directionsDisplay.setOptions({ preserveViewport: true });
                      directionsDisplay.setOptions({ suppressMarkers: true });
                      directionsDisplay.setDirections(response);
                  }
              });

              if (typeof pathSourceDestination !== 'undefined') {
                  console.log("Permanent Coordinates :"+ JSON.stringify(pathSourceDestination));
                  directionsService.route(pathSourceDestination, function(response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplayPermanent.setOptions({ preserveViewport: true });
                        directionsDisplayPermanent.setOptions({ suppressMarkers: true });
                        directionsDisplayPermanent.setDirections(response);
                    }
                  });
              }

              



            }
            
        }
    })(marker, i));

     google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
        return function() {
            //infoWindow.setContent(infoWindowContent[i][0]);
            if(currentSource!=''){
                directionsDisplay.setDirections({routes: []});
            }
            
        }
    })(marker, i));
  } 
}