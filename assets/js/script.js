// Jquery Selectors
let cardsEl = $('#cards-section');

// Create the script tag, set the appropriate attributes
let script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.G_KEY}&callback=initMap&libraries=places`;
script.async = true;

// Global Variables
let map, infoWindow;
let storageLocal = [];
let tmp = [];
const center = { lat: 37.42778, lng: -77.62199 };

$(document).on('submit', function (event) {
  event.preventDefault();
});

// The function that makes the map render
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom: 12,
  });

  // Makes the marker component inside the map
  let dragMarker = new google.maps.Marker({
    position: center,
    map,
    draggable: true,
    title: 'Drag Me!',
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  });

  // Event listener for when the dragger is moved
  dragMarker.addListener('dragend', () => {
    let getPos = dragMarker.getPosition();

    const pos = { lat: getPos.lat(), lng: getPos.lng() };

    nearbySearch(pos);
  });

  infoWindow = new google.maps.InfoWindow();

  // This creates new button to display on top
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
          map.setCenter(pos);
          dragMarker.setPosition(pos);
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

  // This section handles the autocomplete call
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
    dragMarker.setPosition(center);
    nearbySearch(center);
  });

  nearbySearch(center);

  // Resize stuff...
  google.maps.event.addDomListener(window, 'resize', function () {
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
  });
}

// This handles errors of the browsers geolocation
function handleError(hasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    hasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

// This function creates a marker
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
    console.log(place.place_id);
    getPlaceInfo(place.place_id);
    $('.ui.modal').modal('show');
  });
}

// Once the marker is moved this function will search the lat/lng around the marker
function nearbySearch(location) {
  const placesArr = [];
  const service = new google.maps.places.PlacesService(map);
  const request = {
    location: { lat: location.lat, lng: location.lng },
    radius: 2000,
    keyword: 'cafe',
  };
  service.nearbySearch(request, results => {
    console.log(results);
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
      placesArr.push(results[i].place_id);
    }
  });
}

// Once the user clicks the marker they want to view this will query the Google Place API
function getPlaceInfo(place_id) {
  let request = {
    placeId: place_id,
    fields: [
      'name',
      'rating',
      'formatted_phone_number',
      'formatted_address',
      'photos',
    ],
  };

  const service = new google.maps.places.PlacesService(map);
  service.getDetails(request, callback);

  function callback(place, status) {
    if (!place.photos) place.photos = '';
    makeCards(place);
    localStorage.setItem('places', JSON.stringify(storageLocal));
  }
}

// This will generate the new modal with all the Place info retrieved
function makeCards(place) {
  cardsEl.empty();
  const alt = 'coffee shop front';

  const picAtts =
    place.photos === ''
      ? {
          src: './assets/images/dummyshop.jpg',
          alt,
        }
      : {
          src: place.photos[0].getUrl(),
          alt,
        };

  $('.ui.modal').append(cardsEl);

  const card = $(`

<div class="card">
  <div class="image">
    <img src="${picAtts.src}" alt="${picAtts.alt}">
  </div>
  <div class="header" id="cardbg">
    <div class="header">
      ${place.name}
    </div>
    <p id="rating">
      ${place.rating}
    </p>
    <p id="address">
      ${place.formatted_address}
    </p>
    <p id="number">
    ${
      place.formatted_phone_number
        ? `Phone Number: ${place.formatted_phone_number}`
        : 'Phone Number Unavailable'
    }
    </p>
  </div>
  <div className="description">
  </div>
</div>
`);
  cardsEl.append(card);
}

// Append the 'script' element to 'head'
document.head.appendChild(script);
