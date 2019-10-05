let Quiz = require("./Quiz"); //import quiz class
const input = require('readline-sync');
let questionNumber = ["first", "second", "third", "fourth", "fifth"]; //question position display
let initiateQuiz = new Quiz(); //instantiate new Quiz 
let questions = initiateQuiz.getQuestions(initiateQuiz.chooseCategory()); //assign the questions of the chosen Category to questions.
question(0); //0 because it starts from qn 1

if (initiateQuiz.quizResults() == 0) {
    console.log("Hi " + initiateQuiz.name + ". Try again next time.");
} else if ((initiateQuiz.quizResults() > 0) && (initiateQuiz.quizResults() < 5)) {
    console.log("Hi " + initiateQuiz.name + ". Fair work. You scored " + initiateQuiz.quizResults() + " out of 5.");
} else {
    console.log("Hi " + initiateQuiz.name + ". Well done. You got full marks.");
}
console.log("Here are the correct answers.\n")

for (let i = 0; i < questions.length; i++) {
    let msg = questions[i].question;
    msg += `\nAnswer: (${questions[i].answer + 1}) ${questions[i].choice[questions[i].answer]} \n`;
    console.log(msg);
}

function question(i) {
    let q = questions[i];
    let userAnswer = input.question("\n" + q.outputQuestionFormat() + "\n" + "<enter 1 to 4 for answer, P for previous question, N for next question>" + "\n>>");
    if (!isNaN(userAnswer)) { //if userAnswer is a number
        if (userAnswer < 1 || userAnswer > 4) { //if userAnswer is not within 1 and 4, error is displayed.
            console.log(`Error. You are attempting the ${questionNumber[i]} question.`);
            question(i); //recursion
        } else if (userAnswer >= 1 || userAnswer < 5) { //if userAnswer is within 1 and 4 
            initiateQuiz.selectedCategoryArray[i].storeAnswer(userAnswer); //store the answer
            if (i === 4) { //if i equals to 4
                if (initiateQuiz.selectedCategoryArray[i].userAnswer.length != 5) { // and When userAnswer length is not 5  
                    //do a for loop that tests if there are any unanswered question.
                    for (i = 0; i < questions.length; i++) {
                        //this condition means that if one of the answers are still of the default value, it means it is unanswered.
                        if (initiateQuiz.selectedCategoryArray[i].userAnswer == -1) {
                            console.log(`You have not answered Question ${i+1}.`);
                            userAnswer = input.question(questions[i].outputQuestionFormat() + "\n" + "<enter 1 to 4 for answer, P for previous question, N for next question>" + "\n>>");
                            while (userAnswer < 1 || userAnswer > 4 || isNaN(userAnswer)) {
                                console.log(`Please re-enter answer for ${questionNumber[i]} question.`);
                                userAnswer = parseInt(input.question(questions[i].outputQuestionFormat() + "\n" + "<enter 1 to 4 for answer>" + "\n>>"));
                            }
                            initiateQuiz.selectedCategoryArray[i].storeAnswer(userAnswer);
                        }
                    }
                    showUserAns(); //output Summary of the UserAnswers

                    do {
                        changeAnswer() //change Answer when changeAnswerQuestion does not equal to 0
                    } while (changeAnswerQuestion != 0);
                } else {
                    return; // if i equals to 4 ( i.e. at question5 ) and all questions are answered, return it.
                }
            } else {
                question(i + 1); //since i does not equals to 4 (i.e. not question5 yet, proceed to the next question)
            }
        }
    } else if (isNaN(userAnswer)) { //if this is a string 
        if (userAnswer.toLowerCase() == "p") { //if user pressed p or P, it will go to the previous question.
            if (i == 0) { //if user pressed p or P at first question, alert the user that u only can press next.
                console.log("You can only press NEXT now");
                question(i);
            } else {
                question(i - 1);
            }

        } else if (userAnswer.toLowerCase() == "n") { //if user pressed n or N, it will go to the next question.
            if (i == 4) { //if user pressed n or N at last question, alert the user that u can only press previous.
                console.log("You can only press PREVIOUS now.");
                question(i);
            } else {
                question(i + 1);

            }

        } else { //for this, if it is a random string that does not match p and n, it will incur an error.
            console.log(`Error. You are attempting the ${questionNumber[i]} question.`);
            question(i);
        }
    }
}

function showUserAns() { //showUserAnswerSummary
    console.log("Here are your answers:")
    for (let i = 0; i < 5; i++) {
        let msg = questions[i].question;
        msg += "\nAnswer: (" + initiateQuiz.selectedCategoryArray[i].userAnswer + ") " + initiateQuiz.selectedCategoryArray[i].choice[initiateQuiz.selectedCategoryArray[i].userAnswer - 1] + "\n"
        console.log(msg);
    }
}

function changeAnswer() { //changeAnswer function
    changeAnswerQuestion = parseInt(input.question("Enter 0 to submit your quiz or [1 to 5] to change your answer.\n>>"));
    if (changeAnswerQuestion === 0) {
        console.log("You have submitted your quiz.");
    } else if (changeAnswerQuestion < 1 || changeAnswerQuestion > 5) {
        console.log("INVALID INPUT. PLEASE RETRY.");
        changeAnswer();
    } else if (changeAnswerQuestion >= 1 || changeAnswerQuestion < 6) {
        for (let i = 0; i < questions.length; i++) {
            if ((i + 1) == changeAnswerQuestion) {
                userAnswer = parseInt(input.question(questions[i].outputQuestionFormat() + "\n" + "<enter 1 to 4 for answer>" + "\n>>"));
                while (userAnswer < 1 || userAnswer > 4 || isNaN(userAnswer)) {
                    console.log(`Please re-enter answer for ${questionNumber[i]} question.`);
                    userAnswer = parseInt(input.question(questions[i].outputQuestionFormat() + "\n" + "<enter 1 to 4 for answer>" + "\n>>"));
                }
                initiateQuiz.selectedCategoryArray[i].storeAnswer(userAnswer);
            }
        }
    }
}