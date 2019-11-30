function shuffle(array) {
    var copy = [], n = array.length, i;

    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * n--);

        // And move it to the new array.
        copy.push(array.splice(i, 1)[0]);
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
    if (section == 'dc') {
        DCQuestions = questions.questions.DC.questions_and_answers;
        document.getElementById('topic').innerHTML = 'Topic: ' + questions.questions.DC.title;
        DCQuestions.forEach(questionObj => {
            questionDiv = document.getElementById('questionDiv');
            question_title = document.createElement('p');
            question_title.style.fontSize = "20px";
            question_title.style.margin = "1% 0 0 1%";
            if (questionObj.type = 'equation') {
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
                var optionAnsDiv = document.createElement("div");
                optionAnsDiv.id = "optionAnsDiv";
                shuffle(questionNestObject.answers).forEach(option => {
                    var ansOptions = document.createElement("input");
                    ansOptions.type = "radio";
                    ansOptions.name = "option";
                    var optionLabel = document.createElement('label');
                    optionLabel.innerHTML = round_to_precision(parseFloat(option), 4);
                    optionAnsDiv.appendChild(ansOptions);
                    optionAnsDiv.appendChild(optionLabel);
                    optionAnsDiv.appendChild(document.createElement("br"));
                });
                questionDiv.appendChild(optionAnsDiv);
            }
        });
    }
}






