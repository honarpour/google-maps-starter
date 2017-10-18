var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

// Initialize map and attach listeners
(function() {
  // Search events
  $('input#search').addEventListener('keyup', function(e) {
    // var address = this.value;
    if (e.keyCode === 13) {
      setTimeout(function() {
        search();
      }, 300);
    }
  });

  // Map control events
  $('controls li[name=clear]').addEventListener('click', function() {
    removeAllMarkers();
  });
  $('controls li[name=zoomin]').addEventListener('click', function() {
    zoom(true);
  });
  $('controls li[name=zoomout]').addEventListener('click', function() {
    zoom(false);
  });
  $('controls li[name=location]').addEventListener('click', function() {
    goToLocation();
  });
})();

/* -------------
    Search
------------- */

function search() {
  var place = autocomplete.getPlace();
  if (!place || typeof place === 'undefined') {
    alert('Please try again.');
    return;
  }
  var lat = place.geometry.location.lat();
  var lng = place.geometry.location.lng();
  var data = [
    {
      lat,
      lng
    }
  ];
  createMarkers(data);
}

/* ---------
    Map
--------- */

var map;
var markers = [];
// var infoWindow;

function initMap() {
  var lat = 43.6289467;
  var lng = -79.3944199;

  var mapOptions = {
    zoom: 13,
    minZoom: 10,
    maxZoom: 16,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    center: new google.maps.LatLng(lat, lng)
  };

  map = new google.maps.Map(
    document.getElementsByTagName('map')[0],
    mapOptions
  );
  // infoWindow = new google.maps.InfoWindow;

  // When map is done loading
  google.maps.event.addListenerOnce(map, 'idle', function() {
    $('map').removeAttribute('style');
    google.maps.event.trigger(map, 'resize');
    goToLocation();

    window.addEventListener('resize', function() {
      goToLocation();
      zoom();
    });
  });

  geolocate();
}

function goToLocation() {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var latLng = new google.maps.LatLng(lat, lng);

        map.setCenter(latLng);
        // infoWindow.setPosition({ lat, lng });
        // infoWindow.setContent('Location found.');
        // infoWindow.open(map);
      },
      function() {
        // handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    // handleLocationError(false, infoWindow, map.getCenter());
    var lat = 43.6289467;
    var lng = -79.3944199;
    map.setCenter(new google.maps.LatLng(lat, lng));
  }
}

function createMarkers(data) {
  for (i = 0; i < data.length; i += 1) {
    var lat = data[i].lat;
    var lng = data[i].lng;
    var position = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
      position,
      map,
      icon: 'https://maps.google.com/mapfiles/kml/shapes/schools_maps.png'
    });

    markers.push(marker);
  }

  // // Set map view to include all markers
  // var bounds = new google.maps.LatLngBounds();
  // for (var i = 0; i < markers.length; i += 1) {
  //   bounds.extend(markers[i].getPosition());
  // }
  // map.fitBounds(bounds);
}

function removeAllMarkers() {
  for (var i = 0; i < markers.length; i += 1) {
    markers[i].setMap(null);
  }
  markers = [];
}

function zoom(bool) {
  switch (bool) {
    case true:
      map.setZoom(map.getZoom() + 1);
      break;
    case false:
      map.setZoom(map.getZoom() - 1);
      break;
    default:
      map.setZoom(13);
      break;
  }
}

/* -------------------------
    Address Autocomplete
--------------------------*/

var autocomplete;
function initAutocomplete() {
  // Create the autocomplete object, restricting
  // the search to geographical location types.
  autocomplete = new google.maps.places
    .Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById('search')),
    { types: ['geocode'] }
  );
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    initAutocomplete();
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
