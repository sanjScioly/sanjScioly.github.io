var topic;
var name = "quiz=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        topic = c.substring(name.length, c.length);
    }
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
            if(option.includes("eval(")){
                equation = option.substring(5).slice(0,-1)
                if(equation.includes('/')){
                    this.variables.forEach(variableElement => {
                        
                    });
                    this.answers.push(option.split("/")[0]/option.split("/")[1])
                }
            }
        });

    }
}

if (topic = 'DC') {
    DCQuestions = questions.questions.DC.questions_and_answers;
    document.getElementById('topic').innerHTML = 'Topic: ' + questions.questions.DC.title;
    DCQuestions.forEach(questionObj => {
        questionDiv = document.createElement('div');
        question_title = document.createElement('p');
        if (DCQuestions.type = 'equation') {
            questionNestObject = new question(questionObj)
            question_title.innerHTML = questionNestObject.questionFormatted;
            questionDiv.appendChild(question_title);
        }
        document.getElementById('quiz').appendChild(questionDiv);
    });

}



