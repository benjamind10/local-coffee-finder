
//  function getRecipe() {     const baseURL = 'https://api.sampleapis.com/coffee/hot';      $.ajax({         url: baseURL,         method: 'GET'     })         .then(function (response) {         console.log(response)         })         .catch(function (error) {         console.log(error)     }) 

//  }

var recipesFormEl = document.querySelector("#recipesForm");
var recipesInputEl = document.querySelector("#recipesInput");
var coffeeCardEl = document.querySelector("#coffeeCard")

var formSubmitHandler = function() {
    event.preventDefault();


    // get value from input element
    var coffee = recipesInputEl.value.trim()

    if (coffee) {
        getCoffeeRecipes(coffee);
        recipesInputEl.value = "";
    } else {
        alert("Please enter coffee")
    }
}


var getCoffeeRecipes = function() {
    
    var apiUrl = "https://api.sampleapis.com/coffee/hot";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);

            
            
            var cardDiv = document.createElement("div");
            cardDiv.classList.add("ui","card","center","aligned","container");
            coffeeCardEl.append(cardDiv);

            var titleDiv = document.createElement("div");
            titleDiv.classList.add("content");
            cardDiv.append(titleDiv);

            var titleEl = document.createElement("div");
            titleEl.classList.add("header");
            titleEl.textContent = "Title";
            titleDiv.append(titleEl);

            cardBody = document.createElement("div");
            cardBody.classList.add("content");
            cardDiv.append(cardBody);

            var cardDescription = document.createElement("div");
            cardDescription.classList.add("description");
            cardBody.append(cardDescription);

            var description = document.createElement("h4");
            description.textContent = "Description:";
            cardDescription.append(description);

            var descriptionText = document.createElement("p");
            descriptionText.textContent = "content";
            cardDescription.append(descriptionText);

            var ingredients = document.createElement("h4");
            ingredients.textContent = "Ingredients:";
            cardDescription.append(ingredients);

            var ingredList = document.createElement("p");
            ingredList.textContent = "list";
            cardDescription.append(ingredList)
        })
    })
}


// add event listerner to form
recipesFormEl.addEventListener("submit", formSubmitHandler);