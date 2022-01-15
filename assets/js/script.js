// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.G_KEY}&callback=initMap&libraries=places`;
script.async = true;

// Global Variables
let map, infoWindow;
const center = { lat: 37.42778, lng: -77.62199 };
let tmp = {};

function genMap() {
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 12,
    });

    infoWindow = new google.maps.InfoWindow();

    const locationButton = document.createElement('button');

    locationButton.textContent = 'Go To  Your Location';
    locationButton.classList.add('custom-map-control-button');
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
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

      initAutoComplete();
    });
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function initAutoComplete() {
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
    tmp.lat = place.lat();
    tmp.lng = place.lng();
    console.log(tmp);
  });
  map.setCenter(tmp);
  return tmp;
}

function nearbySearch() {
  if ((tmp = {})) tmp = center;

  const queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${tmp.lat}%2C${tmp.lng}&radius=2000&region=us&type=cafe,bakery&key=${config.G_KEY}`;

  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (response) {
      console.log(response);
    });
}

// Append the 'script' element to 'head'
document.head.appendChild(script);
