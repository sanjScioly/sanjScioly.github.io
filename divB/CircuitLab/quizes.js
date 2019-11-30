var topic;
var score = 0;
var wasTheLastOptionChosenCorrect;

function shuffle(a) {
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
                console.log(this.variables);
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
    newQuestion('new');
}


function newQuestion(newOld) {

    document.getElementById('questionDiv').innerHTML = '';
    var topicQuestions = questions.questions[topic].questions_and_answers;
    document.getElementById('topic').innerHTML = 'Topic: ' + questions.questions[topic].title;
    var questionObj = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
    var okBoomer = questionObj;
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
        answersToLife = okBoomer.answers;
        correctAnswer = answersToLife[0];
        shuffle(answersToLife.slice()).forEach(option => {
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
    }
    var rad = document.getElementsByName('option');
    questionDiv.appendChild(optionAnsDiv);
    var prev = null;
    for (var i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function () {
            (prev) ? console.log(prev.value) : null;
            if (this !== prev) {
                prev = this;
            }
            console.log(this.value);
            if (this.value == correctAnswer) {
                console.log("fuck yea");
            } else {
                console.log("Motherfucking Idiot")
            }
        });
    }
}






