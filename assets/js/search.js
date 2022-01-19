let searchHistory;
let cardsEl = $('#cards-section');

$(function () {
  getStorage();
});

function getStorage() {
  searchHistory = JSON.parse(localStorage.getItem('places'));
  makeCards(searchHistory);
}

function makeCards(arr) {
  let len = searchHistory.length;

  for (let i = 0; i < len; i++) {
    let card = $("<div class='card'>");
    let imgDiv = $("<div class='image'>");
    let imageEl = $('<img>');
    let cardBg = $("<div class='header' id='cardbg'>");
    let shopName = $("<div class='header'>");
    let descriptionDiv = $("<div class='description'>");

    let ratingP = $("<p id='rating'>");
    let address = $("<p id='address'>");
    let pNumber = $("<p id='number'>");

    cardsEl.append(card);
    card.append(imgDiv);
    imgDiv.append(imageEl);

    imageEl.attr('src', './assets/images/dummyshop.jpg');
    imageEl.attr('alt', 'coffee shop front');
    card.append(cardBg);

    shopName.text(arr[i].result.name);
    cardBg.append(shopName);
    card.append(descriptionDiv);

    ratingP.text(`Rating: ${arr[i].result.rating}`);
    address.text(`Address: ${arr[i].result.formatted_address}`);
    pNumber.text(
      `Phone Number: ${arr[i].result.formatted_phone_number}`
    );

    cardBg.append(ratingP);
    cardBg.append(address);
    cardBg.append(pNumber);
  }
}
