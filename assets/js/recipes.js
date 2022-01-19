// Jquery Selectors
let recipesCard = $('#recipes-card');
let recipeName = $('#name');
let ingredients = $('#ingredients');
let description = $('#description');

let data, num;
let prevRecipe = [];

$(function () {
  getRecipe();
});

$('#next').on('click', function () {
  num = Math.floor(Math.random() * data.length);
  genCoffee(data, num);
});

$('#previous').on('click', function () {
  const prev = prevRecipe.length - 2;
  if (prevRecipe.length === 1) return;
  genCoffee(prevRecipe, prev);
  prevRecipe = [];
});

function getRecipe() {
  const baseURL = 'https://api.sampleapis.com/coffee/hot';
  $.ajax({ url: baseURL, method: 'GET' })
    .then(function (response) {
      console.log(response);
      data = response;
      data.splice(20, 1);
      data.splice(21, 1);

      num = Math.floor(Math.random() * data.length);
      genCoffee(data, num);
    })

    .catch(function (error) {
      console.log(error);
    });
}

function genCoffee(data = data, num) {
  console.log(data);

  if (data.length === 0) return;
  ingredients.empty();

  recipeName.text(data[num].title);
  for (let i = 0; i < data[num].ingredients.length; i++) {
    let ingredient = $('<p>');

    ingredient.text(data[num].ingredients[i]);
    ingredients.append(ingredient);
  }
  description.text(data[num].description);

  recipesCard.css('display', 'block');
  prevRecipe.push(data[num]);
}
