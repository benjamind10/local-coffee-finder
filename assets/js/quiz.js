var questions = [{
        question: "Do you need a quiet location?",
        choices: ["yes", "no"],
        userResponse: []
    },
    {
        question: "Are you hoping to grab food - not just pasteries?",
        choices: ["yes please!", "not really..."],
        userResponse: []
    }, {
        question: "Do you want a busy,more social cafe?",
        choices: ["Absolutely!", "no, I really need to focus..."],
        userResponse: []
    }, {
        question: "Are you hoping for a more historic spot?",
        choices: ["yes. I love these sort of places...", "no, I just want a nice ambience"],
        userResponse: []
    }
];

var questionCounter = 0; //Tracks question number
var selections = []; //Array containing user choices
var quiz = $('#quiz'); //Quiz div object

//Display initial question
displayNext();

// Click handler for the 'next' button
$('#next').on('click', function (e) {
    e.preventDefault();

    // Suspend click listener during fade animation
    if (quiz.is(':animated')) {
        return false;
    }
    choose();

    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
        alert('Please make a selection!');
    } else {
        questionCounter++;
        displayNext();
    }
})

// Click handler for the 'prev' button
$('#prev').on('click', function (e) {
    e.preventDefault();

    if (quiz.is(':animated')) {
        return false;
    }
    choose();
    questionCounter--;
    displayNext();
});

// Click handler for the 'Start Over' button
$('#start').on('click', function (e) {
    e.preventDefault();

    if (quiz.is(':animated')) {
        return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
});

// Animates buttons on hover
$('.button').on('mouseenter', function () {
    $(this).addClass('active');
});
$('.button').on('mouseleave', function () {
    $(this).removeClass('active');
});

// Creates and returns the div that contains the questions and
// the answer selections
function createQuestionElement(index) {
    var qElement = $("<div></div>").attr("id", "question");

    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);

    var question = $('<p>').append(questions[index].question);
    qElement.append(question);

    var radioButtons = createRadios(index);
    qElement.append(radioButtons);

    return qElement;
}

function displayScore() {
    var qElement = $("<div></div>").attr("id", "result");

    var header = $('<h2>Results:</h2>');
    qElement.append(header);

    console.log(JSON.stringify(selections, null, 3))
    
    var result= []

    if(selections[0]==0){
    result.push("Blanchards")  
    }

    if(selections[1]==0){
        result.push("Roastolgy") 
        result.push("Ironclad") 
        }

    if(selections[1]==1){
            result.push("Blanchards")  
            }

    if(selections[2]==0){
                result.push("Ironclad") 
                result.push("Roastology") 
    }
    if(selections[2]==1){
                result.push("Blanchards") 
                }
    if(selections[3]==0){
                    result.push("Ironclad")
                    result.push("Blanchards")
    }
    if(selections[3]==1){
        result.push("Roastology")
    }



    var question = $('<p>').append(JSON.stringify([...new Set(result)]));
    qElement.append(question);

    return qElement;
}
//Creates a list of the answer choices as radio inputs
function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
        item = $('<li>');
        input = '<input type="radio" name="answer" value=' + i + ' />';
        input += questions[index].choices[i];
        item.append(input);
        radioList.append(item);
    }
    return radioList;
}

// Reads the user selection and pushes the value to an array
function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
}

// Displays next requested element
function displayNext() {
    // quiz.fadeOut(function () {
     $('#question').remove();
    if (questionCounter < questions.length) {
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion);

        if (!(isNaN(selections[questionCounter]))) {
            $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
        }

        // Controls display of 'prev' button
        if (questionCounter === 1) {
            $('#prev').show();
        } else if (questionCounter === 0) {
            $('#prev').hide();
            $('#next').show();
        }
    } else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
    }
    // });
}