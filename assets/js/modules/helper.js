let storageLocal = [];
let tmp = [];

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
  const queryUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name%2Crating%2Cformatted_phone_number%2Cformatted_address%2Cphoto%2Curl&key=${config.G_KEY}`;

  $.ajax({
    url: queryUrl,
    method: 'GET',
  })
    .then(function (response) {
      console.log(response);
      makeCards(response);
      localStorage.setItem('places', JSON.stringify(storageLocal));
    })
    .catch(function (error) {
      console.log(error);
    });
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
  let link = $("<a id='link'>");

  $('.ui.modal').append(cardsEl);
  const pics = place.result.photos;

  card.append(imgDiv);
  imgDiv.append(imageEl);
  cardsEl.append(card);

  let alt = 'coffee shop front';

  pics === undefined
    ? imageEl.attr({
        src: './assets/images/dummyshop.jpg',
        alt,
      })
    : imageEl.attr({
        src: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${pics[0].photo_reference}&key=${config.G_KEY}`,
        alt,
      });

  card.append(cardBg);

  shopName.text(place.result.name);
  cardBg.append(shopName);
  card.append(descriptionDiv);

  let rating = place.result.rating;

  rating === undefined
    ? ratingP.text('No rating available')
    : ratingP.text(`Rating: ${place.result.rating}`);

  address.text(`Address: ${place.result.formatted_address}`);

  !place.result.formatted_phone_number
    ? pNumber.text('Phone Number Unavailable')
    : pNumber.text(
        `Phone Number: ${place.result.formatted_phone_number}`
      );

  cardBg.append(ratingP);
  cardBg.append(address);
  cardBg.append(pNumber);
  storageLocal.push(place);
}
