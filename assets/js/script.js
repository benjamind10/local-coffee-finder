// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${config.G_KEY}&callback=initMap`;
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function () {
  var options = {
    center: { lat: 37.42778, lng: -77.62199 },
    zoom: 12,
  };
  // JS API is loaded and available
  map = new google.maps.Map($('#map'), options);
};

// Append the 'script' element to 'head'
document.head.appendChild(script);
