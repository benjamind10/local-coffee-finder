// Create the script tag, set the appropriate attributes
let script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.G_KEY}&callback=initMap`;
script.async = true;

// Create the script tag for places autocomplete

// JQuery Selectors
let searchBarEl = document.getElementById('search-address');

// Global Variables
let pos = {};
let tmp = [];

// Init the app
initAutoComplete();

// Event Handlers
searchBarEl.addEventListener('click', event => {
  event.preventDefault();
});

// Functions
function getLocation() {
  navigator.geolocation.getCurrentPosition(position => {
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  });
}

function initAutoComplete() {
  let autocomplete;
  let place;

  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('search-address'),
    {
      componentRestrictions: { country: 'us' },
      types: ['address'],
      fields: ['address_components', 'geometry', 'icon', 'name'],
    }
  );
}

// Attach callback function to the `window` object
function initMap(pos) {
  window.initMap = function () {
    let options = {};
    if (pos === undefined) {
      options = {
        center: { lat: 37.42778, lng: -77.62199 },
        zoom: 12,
      };
    } else {
      options = {
        center: { lat: pos.lat, lng: pos.lng },
        zoom: 12,
      };
    }
    // JS API is loaded and available
    map = new google.maps.Map(
      document.getElementById('map'),
      options
    );
  };

  // Append the 'script' element to 'head'
  document.head.appendChild(script);
}

function findPlace(searchVal) {}
