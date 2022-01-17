function getRecipe() {
  const baseURL = 'https://api.sampleapis.com/coffee/hot';
  $.ajax({ url: baseURL, method: 'GET' })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
