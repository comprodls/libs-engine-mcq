function __getAnswersJSONMCQMR(__content) {
    var resultArray = [];
    var statusEvaluation = 'empty';
    var feedback = '';
    var maxscore = __scoring.max;
    var perInteractionScore = __interactionIds.length / maxscore;
    var isUserAnswerCorrect = false;
    // Filter all the MCQMRs
    var filtered = __content.interactions.filter(function (interaction) {
        return interaction.type === 'MCQMR';
    });
    var countCorrectInteractionAttempt = 0;

    /* Iterate over user_answers and calculate */

    filtered.forEach(function (eachElem, idx) {
        var score = 0;
        var id = eachElem.id;

        if (__content.userAnswers.hasOwnProperty(id)) {
            if (__content.userAnswers[id].length === __correctAnswers[id]['correct'].length) {
                if (__content.userAnswers[id].sort().join('') === __correctAnswers[id]['correct'].sort().join('')) {
                    score = perInteractionScore;
                    countCorrectInteractionAttempt++;
                    isUserAnswerCorrect = true;
                }
            }
        }
        resultArray.push({
            itemUID: id,
            answer: __content.userAnswers[id],
            score: score
        });
    });

    if (isUserAnswerCorrect) {
        statusEvaluation = 'correct';
        feedback = __buildFeedbackResponse('global.correct', 'correct', __feedback.correct);
    } else if (countCorrectInteractionAttempt === 0) {
        statusEvaluation = 'incorrect';
        feedback = __buildFeedbackResponse('global.incorrect', statusEvaluation, __feedback.incorrect);
    } else {
        statusEvaluation = 'partially_correct';
        feedback = __buildFeedbackResponse('global.incorrect', 'incorrect', __feedback.incorrect);
    }

    return {
        response: {
            'interactions': resultArray,
            'statusEvaluation': statusEvaluation,
            'feedback': feedback
        }
    };
}

function __getAnswersJSONMCQSR() {
    var score = 0;
    var answer = '';
    var interactions = {};
    var response;

    /*Setup results array */
    var interactionArray = new Array(1);
    /* Split questionJSON to get interactionId. */
    //var questionData = __content.questionsJSON[0].split("^^");
    var interactionId = null;
    // Filter all the MCQMRs
    var filtered = __content.interactions.filter(function (interaction) {
        return interaction.type === 'MCQSR';
    });

    filtered.forEach(function (el, idx) {
        interactionId = el.id;
        answer = __content.userAnswers[el.id];

        if (__correctAnswers[el.id] === __content.userAnswers[el.id]) {
            score++;
        }
    });

    interactions = {
        id: interactionId,
        answer: answer,
        score: score,
        maxscore: __scoring.max
    };
    interactionArray[0] = interactions;

    response = {
        'interactions': interactionArray
    };

    return {
        response: response
    };
}