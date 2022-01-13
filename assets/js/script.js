// Create the script tag, set the appropriate attributes
let script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.G_KEY}&libraries=places`;
script.async = true;

// Append the 'script' element to 'head'
document.head.appendChild(script);

// JQuery Selectors
let searchEl = $('#search-address');
let input = document.getElementById('search-address');
let places;

// Global Variables
let pos = {};

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
    let options = {};
    let zoom = 12;

    if (pos === undefined) {
      options = {
        center: { lat: 37.42778, lng: -77.62199 },
        zoom: zoom,
      };
    } else {
      options = {
        center: { lat: pos.lat, lng: pos.lng },
        zoom: zoom,
      };
    }
    // JS API is loaded and available
    map = new google.maps.Map(
      document.getElementById('map'),
      options
    );
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

  let searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener('places_changed', () => {
    places = searchBox.getPlaces();
  });
}
