// Create the script tag, set the appropriate attributes
let script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.G_KEY}&callback=initMap&libraries=places`;
script.async = true;

// Append the 'script' element to 'head'
document.head.appendChild(script);

// JQuery Selectors
let searchEl = $('#search-address');

// Global Variables
let places;
let pos = {};
let tmp;

navigator.geolocation.getCurrentPosition(position => {
  pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
});

// Event Handlers
$(document).on('submit', function (event) {
  event.preventDefault();

  console.log(searchEl.val().trim());
});

// Functions
function genMap() {
  window.initMap = function (pos) {
    if (!pos) {
      pos.lat = 37.42778;
      pos.lng = -77.62199;
    }

    const options = {
      center: { lat: pos.lat, lng: pos.lng },
      zoom: 12,
    };

    // JS API is loaded and available
    map = new google.maps.Map(
      document.getElementById('map'),
      options
    );

    // Marker
    const marker = new google.maps.Marker({
      position: { lat: options.center.lat, lng: options.center.lng },
      map: map,
    });

    // InfoWindow
    const detailWindow = new google.maps.InfoWindow({
      content: `<h2></h2>`,
    });
  };
}

function initAutoComplete() {
  let autocomplete;
  let input = document.getElementById('search-address');

  const options = {
    componentRestrictions: { country: 'us' },
    types: ['address'],
    fields: ['address_components', 'geometry', 'icon', 'name'],
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.addListener('place_changed', () => {
    places = autocomplete.getPlace();

    if (!places.geometry || !places.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      alert("No details available for input: '" + places.name + "'");
      return;
    } else {
      tmp = places;
    }
  });
}

function nearbySearch() {
  const queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${pos.lat}%2C${pos.lng}&radius=2000&region=us&type=cafe,bakery&key=${config.G_KEY}`;

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
