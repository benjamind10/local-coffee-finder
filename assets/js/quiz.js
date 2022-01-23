var questions = [{
        question1: "Do you need a quiet location?",
        choices: ["yes", "no"],
        userResponse: []
    },
    {
        question2: "Are you hoping to grab food - not just pasteries?",
        choices: ["yes please!", "not really..."],
        userResponse: []
    }, {
        question3: "Do you want a busy,more social cafe?",
        choices: ["Absolutely!", "no, I really need to focus..."],
        userResponse: []
    }, {
        question4: "Are you hoping for a more historic spot?",
        choices: ["yes. I love these sort of places...", "no, I just want a nice ambience"],
        userResponse: []
    }
]

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
    var qElement = $('div', {
        id: 'question'
    });

    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);

    var question = $('<p>').append(questions[index].question);
    qElement.append(question);

    var radioButtons = createRadios(index);
    qElement.append(radioButtons);

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
    quiz.fadeOut(function () {
        $('#question').remove();

        if (questionCounter < questions.length) {
            var nextQuestion = createQuestionElement(questionCounter);
            quiz.append(nextQuestion).fadeIn();
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
    });
}
//Using forEach()Method
//creating a set



//List all Elements
let text = "";
letters.forEach(function (value) {
        text += value;
    }


    // Computes score and returns a paragraph element to be displayed
    //function displayResponse() {
    //var Response = $('<p>', {
    //id: 'question'
    //});

    //var Response = 0;
    //for (var i = 0; i < selections.length; i++) {
    //if (selections[i] === questions[i].correctAnswer) {
    //numCorrect++;

    //}
    //Question Responses


    //string[] Response = {"yes", "no", "Doesn't matter"}               
    //for (string i : Response) {



)();