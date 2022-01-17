// Jquery Selectors
let recipesCard = $('#recipes-card');
let recipeName = $('#name');
let ingredients = $('#ingredients');
let description = $('#description');

let data;

$(function () {
  getRecipe();
  console.log(data);
});

function getRecipe() {
  const baseURL = 'https://api.sampleapis.com/coffee/hot';
  $.ajax({ url: baseURL, method: 'GET' })
    .then(function (response) {
      console.log(response);
      data = response;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function genRandomCoffee() {
  let num = Math.floor(Math.random() * data.length);
  console.log(num);

  recipeName.text(data[num].title);
  ingredients.text(data[num].ingredients);
  description.text(data[num].description);

  recipesCard.css('display', 'block');
}
