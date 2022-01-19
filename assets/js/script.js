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

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom: 12,
  });

  let dragMarker = new google.maps.Marker({
    position: center,
    map,
    draggable: true,
    title: 'Drag Me!',
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  });

  dragMarker.addListener('dragend', () => {
    let getPos = dragMarker.getPosition();

    const pos = { lat: getPos.lat(), lng: getPos.lng() };

    nearbySearch(pos);
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
    console.log(place.place_id);
    getPlaceInfo(place.place_id);
    $('.ui.modal').modal('show');
  });
}

function nearbySearch(location) {
  // if ((tmp = {})) tmp = center;
  const placesArr = [];

  const queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat}%2C${location.lng}&radius=2000&region=us&type=cafe&key=${config.G_KEY}`;

  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (response) {
      for (let i = 0; i < response.results.length; i++) {
        createMarker(response.results[i]);
        placesArr.push(response.results[i].place_id);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log(placesArr);
}

function getPlaceInfo(place_id) {
  const queryUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name%2Crating%2Cformatted_phone_number%2Cformatted_address%2Cphoto&key=${config.G_KEY}`;

  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (response) {
      console.log(response);
      makeCards(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  localStorage.setItem('places', JSON.stringify(storageLocal));
}

function makeCards(place) {
  cardsEl.empty();
  let card = $("<div class='card'>");
  let imgDiv = $("<div class='image'>");
  let imageEl = $('<img>');
  let cardBg = $("<div class='header' id='cardbg'>");
  let shopName = $("<div class='header'>");
  let descriptionDiv = $("<div class='description'>");

  let ratingP = $("<p id='rating'>");
  let address = $("<p id='address'>");
  let pNumber = $("<p id='number'>");

  $('.ui.modal').append(cardsEl);
  const pics = place.result.photos;
  console.log(pics);

  card.append(imgDiv);
  imgDiv.append(imageEl);
  cardsEl.append(card);
  pics === undefined
    ? imageEl.attr('src', './assets/images/dummyshop.jpg')
    : imageEl.attr(
        'src',
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pics[0].photo_reference}&key=${config.G_KEY}`
      );

  imageEl.attr('alt', 'coffee shop front');
  card.append(cardBg);

  shopName.text(place.result.name);
  cardBg.append(shopName);
  card.append(descriptionDiv);

  ratingP.text(`Rating: ${place.result.rating}`);
  address.text(`Address: ${place.result.formatted_address}`);
  pNumber.text(
    `Phone Number: ${place.result.formatted_phone_number}`
  );

  cardBg.append(ratingP);
  cardBg.append(address);
  cardBg.append(pNumber);
  storageLocal.push(place);
}

// Append the 'script' element to 'head'
document.head.appendChild(script);
