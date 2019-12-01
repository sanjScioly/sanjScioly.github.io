var topic;
var score = 0;
var submissions = 0;


document.addEventListener('keypress', logKey);

function logKey(e) {
    if (e.code == "Enter") {
        document.getElementsByClassName("submit")[0].dispatchEvent(new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        }));
    }
}

function arrayCopy(oldArray) {
    var newArray = [];
    oldArray.forEach(element => {
        newArray.push(element);
    })
    return newArray;
}

function shuffle(myArray) {
    var a = arrayCopy(myArray);
    var copy = [], n = a.length, i;


    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * n--);

        // And move it to the new array.
        copy.push(a.splice(i, 1)[0]);
    }
    return copy;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function round_to_precision(x, precision) {
    return (parseInt(x * Math.pow(10, precision))) / Math.pow(10, precision);
}

class variableListThingie {
    name = ''
    definition = ''
    constructor(name, definition) {
        this.name = name;
        this.definition = definition;
    }

}

class question {
    variables = []
    answers = []
    questionFormatted = ''
    constructor(questionJSON) {
        var broken = questionJSON.question.split('l:')
        broken.forEach(varDef => {
            if (varDef.includes('=&')) {
                var subParts = varDef.split('=&');
                if (subParts[1].startsWith('Range(')) {
                    var min = parseInt(subParts[1].substring(6).slice(0, -1).split(',')[0]);
                    var max = parseInt(subParts[1].substring(6).slice(0, -1).split(',')[1]);
                    subParts[1] = Math.floor(Math.random() * (max - min)) + min;
                }
                this.variables.push(new variableListThingie(subParts[0], subParts[1]));
                this.questionFormatted += subParts[0] + " = " + subParts[1];
            } else {
                this.questionFormatted += varDef;
            }
        });
        questionJSON.answers.forEach(option => {
            if (option.includes("eval(")) {
                var equation = option.substring(5).slice(0, -1);
                this.variables.forEach(variableName => {
                    equation = equation.replace(variableName.name, variableName.definition);
                });
                this.answers.push(eval(equation));
            }
        });

    }
}

function quizOn(section) {
    document.getElementById("quizPopup").classList.remove("hide");
    topic = section;
    newQuestion();
    score = 0;
    submissions = 0;
}


function newQuestion() {
    var gotItWrong = false;
    var correctAnswer;
    document.getElementById('questionDiv').innerHTML = '';
    var topicQuestions = questions.questions[topic].questions_and_answers;
    document.getElementById('topic').innerHTML = 'Topic: ' + questions.questions[topic].title;
    var questionObj = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
    questionDiv = document.getElementById('questionDiv');
    question_title = document.createElement('p');
    question_title.style.fontSize = "20px";
    question_title.style.margin = "1% 0 0 1%";
    if (questionObj.type == 'equation') {
        questionNestObject = new question(questionObj);
        question_title.innerHTML = questionNestObject.questionFormatted;
        questionDiv.appendChild(question_title);
        if (questionObj.diagram != "none") {
            var diagram = document.createElement("img");
            diagram.alt = "diagram";
            diagram.src = questionObj.diagram;
            diagram.style.width = "250px";
            questionDiv.appendChild(diagram);
        }
        var optionAnsDiv = document.createElement("form");
        optionAnsDiv.id = "optionAnsDiv";
        correctAnswer = questionNestObject.answers[0];
        shuffle(questionNestObject.answers).forEach(option => {
            var ansOptions = document.createElement("input");
            ansOptions.type = "radio";
            ansOptions.name = "option";
            ansOptions.value = option
            var optionLabel = document.createElement('label');
            optionLabel.innerHTML = round_to_precision(parseFloat(option), 4);
            optionAnsDiv.appendChild(ansOptions);
            optionAnsDiv.appendChild(optionLabel);
            optionAnsDiv.appendChild(document.createElement("br"));
        });
        questionDiv.appendChild(optionAnsDiv);

    } else {
        question_title.innerHTML = questionObj.question;
        questionDiv.appendChild(question_title);
        if (questionObj.diagram != "none") {
            var diagram = document.createElement("img");
            diagram.alt = "diagram";
            diagram.src = questionObj.diagram;
            diagram.style.width = "250px";
            questionDiv.appendChild(diagram);
        }
        var optionAnsDiv = document.createElement("form");
        optionAnsDiv.id = "optionAnsDiv";
        answersToLife = questionObj.answers;
        correctAnswer = answersToLife[0];
        shuffle(questionObj.answers).forEach(option => {
            var ansOptions = document.createElement("input");
            ansOptions.type = "radio";
            ansOptions.name = "option";
            ansOptions.value = option;
            var optionLabel = document.createElement('label');
            optionLabel.innerHTML = option;
            optionAnsDiv.appendChild(ansOptions);
            optionAnsDiv.appendChild(optionLabel);
            optionAnsDiv.appendChild(document.createElement("br"));
        });
        questionDiv.appendChild(optionAnsDiv);
    }
    // <button id='submit'>Check</button>
    submitButton = document.createElement("button");
    submitButton.innerHTML = "Check";
    submitButton.classList = "submit";
    document.getElementById("submitHolder").innerHTML = "";
    document.getElementById("submitHolder").appendChild(submitButton);
    submitButton.addEventListener("click", function () {
        var rad = document.getElementsByName('option');
        questionDiv.appendChild(optionAnsDiv);
        if (Array.from(rad).some(element => element.checked)) {
            var value = Array.from(document.getElementsByName("option")).filter(x => x['checked'])[0].value;
            if (value == correctAnswer) {
                if (gotItWrong) { } else {
                    score++;
                    submissions++;
                }

                document.getElementById("score").innerHTML = "Score: " + score + "/" + submissions;
                if (submissions < 10) {
                    newQuestion();
                } else {
                    document.getElementById('questionDiv').innerHTML = '';
                    var totalScore = document.createElement("h1");
                    var wordsOfEncouragement;
                    if (score == 10) {
                        wordsOfEncouragement = "Perfect!"
                    } else if (score > 7) {
                        wordsOfEncouragement = "Almost there!";
                    } else if (score > 5) {
                        wordsOfEncouragement = "Try Harder";
                    } else {
                        wordsOfEncouragement = "At least study first!";
                    }
                    totalScore.innerHTML = "You scored " + (score * 10) + "%. " + wordsOfEncouragement;
                    totalScore.id = "totalScore";
                    document.getElementById('questionDiv').appendChild(totalScore);
                    submitButton = document.createElement("button");
                    submitButton.innerHTML = "Finish";
                    submitButton.classList = "submit";
                    document.getElementById("submitHolder").innerHTML = "";
                    document.getElementById("submitHolder").appendChild(submitButton);
                    submitButton.addEventListener("click",
                        function () { document.getElementById('quizPopup').classList = 'hide'; }
                    );

                }

            } else {
                if (gotItWrong) {

                } else {
                    submissions++;
                }
                gotItWrong = true;
                document.getElementById("score").innerHTML = "Score: " + score + "/" + submissions;
            }

        } else {

        }

    });






}






