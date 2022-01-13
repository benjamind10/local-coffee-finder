// Create the script tag, set the appropriate attributes
let script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.G_KEY}&callback=initMap`;
script.async = true;

// Attach your callback function to the `window` object
function initMap() {
  window.initMap = function () {
    let options = {
      center: { lat: 37.42778, lng: -77.62199 },
      zoom: 12,
    };
    // JS API is loaded and available
    map = new google.maps.Map(
      document.getElementById('map'),
      options
    );
  };

  // Append the 'script' element to 'head'
  document.head.appendChild(script);
}

$(document).on('submit', function (event) {
  event.preventDefault();

  console.log($('#search-address').val().trim());
});
