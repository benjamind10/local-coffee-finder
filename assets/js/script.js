// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.G_KEY}&callback=initMap&libraries=places`;
script.async = true;

// Global Variables
let map, infoWindow;
const center = { lat: 37.42778, lng: -77.62199 };

$(document).on('submit', function (event) {
  event.preventDefault();
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom: 12,
  });

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement('button');

  locationButton.textContent = 'Go To  Your Location';
  locationButton.classList.add('btn');
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    locationButton
  );

  locationButton.addEventListener('click', () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.open(map);
          map.setCenter(pos);
          nearbySearch(pos);
        },
        () => {
          handleError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleError(false, infoWindow, map.getCenter());
    }
  });

  let autocomplete;
  let input = document.getElementById('search-address');

  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };

  const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: 'us' },
    types: ['address'],
    fields: ['address_components', 'geometry', 'icon', 'name'],
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace().geometry.location;
    center.lat = place.lat();
    center.lng = place.lng();
    map.setCenter(center);

    nearbySearch(center);
  });

  nearbySearch(center);
}

function handleError(hasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    hasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.setContent(place.name || '');
    infoWindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
    // showInfo()
  });
}

function nearbySearch(location) {
  if ((tmp = {})) tmp = center;

  const queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat}%2C${location.lng}&radius=2000&region=us&type=cafe&key=${config.G_KEY}`;

  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (response) {
      console.log(response.results);

      for (let i = 1; i < response.results.length - 1; i++) {
        createMarker(response.results[i]);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getPlaceInfo(place_id) {
  if (!place_id) return;

  const queryUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name%2Crating%2Cformatted_phone_number&key=${config.G_KEY}`;

  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Append the 'script' element to 'head'
document.head.appendChild(script);
