// Jquery Selectors
let recipesCard = $('#recipes-card');
let recipeName = $('#name');
let ingredients = $('#ingredients');
let description = $('#description');

let data;

$(function () {
  getRecipe();
});

function getRecipe() {
  const baseURL = 'https://api.sampleapis.com/coffee/hot';
  $.ajax({ url: baseURL, method: 'GET' })
    .then(function (response) {
      console.log(response);
      data = response;
    })
    .then(function () {
      genRandomCoffee();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function genRandomCoffee() {
  let num = Math.floor(Math.random() * data.length);
  console.log(num);

  recipeName.text(data[num].title);
  for (let i = 0; i < data[num].ingredients.length; i++) {
    let ingredient = $('<p>');

    ingredient.text(data[num].ingredients[i]);
    ingredients.append(ingredient);
  }
  description.text(data[num].description);

  recipesCard.css('display', 'block');
}
