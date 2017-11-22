/* global $ */
const __constants = {
    STATUS_NOERROR: 'NO_ERROR'
};

/*
    * Internal Engine State. (Need to refactor)
    */
    let __state = {
        currentTries: 0, /* Current try of sending results to platform */
        activityPariallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
        activitySubmitted: false /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
};

let __correctAnswers = {};
/*
* Internal Engine Config.
*/
let __config = {
   MAX_RETRIES: 10 /* Maximum number of retries for sending results to platform for a particular activity. */
};
let markCheckBox = Symbol('markCheckBox');

class McqUserResponse {
    constructor(mcqObj) {
        this.mcqObj = mcqObj;
        __correctAnswers = mcqObj.content.responses;
    }

    savePartial(interactionid, mcqObj) {
        let answerJSONs = null;
        let uniqueId = this.mcqObj.adaptor.getId();

        answerJSONs = this.__getAnswersJSON(false, interactionid);

        answerJSONs.forEach((answerJSON, idx) => {
            this.mcqObj.adaptor.savePartialResults(answerJSON, uniqueId, function (data, status) {
                if (status === __constants.STATUS_NOERROR) {
                    __state.activityPariallySubmitted = true;
                } else {
                    // There was an error during platform communication, do nothing for partial saves
                }
            });
        });
    }

    /**
     *  Function used to create JSON from user Answers for submit(soft/hard).
     *  Called by :-
     *   1. __saveResults (internal).
     *   2. Multi-item-handler (external).
     *   3. Divide the maximum marks among interaction.
     *   4. Returns result objects.  [{ itemUID: interactionId,  answer: answer,   score: score }]
     */
    __getAnswersJSON(skipQuestion, interactionid) {
    let response = [];
    let filteredInteraction = null;
    let interactiontype = null;
    var mcqmrans = null;
    var mcqsrans = null;

        if (typeof interactionid === undefined) {

            filteredInteraction = this.mcqObj.mcqModel.interactions.filter(function (interaction) {
                return interaction.id === interactionid;
            });

            // Match the interaction id to set partial results and save
        if (filteredInteraction) {
                    interactiontype = filteredInteraction[0].type;

                if (interactiontype === 'MCQMR') {
                    mcqmrans = this.__getAnswersJSONMCQMR();
                    response.push(mcqmrans);
                }
                if (interactiontype === 'MCQSR') {
                    mcqsrans = this.__getAnswersJSONMCQSR(false);
                    response.push(mcqsrans);
                }
            }
        } else {
                mcqmrans = this.__getAnswersJSONMCQMR();
            response.push(mcqmrans);
                mcqsrans = this.__getAnswersJSONMCQSR();
            response.push(mcqsrans);
        }
        return response;
    }

    __getAnswersJSONMCQMR() {
        var resultArray = [];
        var statusEvaluation = 'empty';
        var feedback = '';
        var maxscore = this.mcqObj.content.meta.score.max;
        var perInteractionScore = this.mcqObj.mcqModel.interactionIds.length / maxscore;
        //TBDvar interactioncount = Object.keys(__correctAnswers).length;
        var isUserAnswerCorrect = false;
        // Filter all the MCQMRs
        var filtered = this.mcqObj.mcqModel.interactions.filter(function (interaction) {
            return interaction.type === 'MCQMR';
        });

        var countCorrectInteractionAttempt = 0;
        /* Iterate over userAnswers and calculate */

        filtered.forEach((eachElem, idx) => {
            var score = 0;
            var id = eachElem.id;

            if (this.mcqObj.userAnswers.hasOwnProperty(id)) {
                if (this.mcqObj.userAnswers[id].length === __correctAnswers[id]['correct'].length) {
                    if (this.mcqObj.userAnswers[id].sort().join('') === __correctAnswers[id]['correct'].sort().join('')) {
                        score = perInteractionScore;
                    }
                    countCorrectInteractionAttempt++;
                    isUserAnswerCorrect = true;
                }
            }
            resultArray.push({
                itemUID: id,
                answer: this.mcqObj.userAnswers[id],
                score: score
            });
        });

        if (isUserAnswerCorrect) {
            statusEvaluation = 'correct';
            feedback = this.__buildFeedbackResponse('global.correct', 'correct', this.mcqObj.mcqModel.feedback.correct);
        } else if (countCorrectInteractionAttempt === 0) {
            statusEvaluation = 'incorrect';
            feedback = this.__buildFeedbackResponse('global.incorrect', statusEvaluation, this.mcqObj.mcqModel.incorrect);
        } else {
            statusEvaluation = 'partially_correct';
            feedback = this.__buildFeedbackResponse('global.incorrect', 'incorrect', this.mcqObj.mcqModel.incorrect);
        }
        return {
            response: {
                'interactions': resultArray,
                'statusEvaluation': statusEvaluation,
                'feedback': feedback
            }
        };
    }

    /**
 * Prepare feedback response.
 * @param {*} id
 * @param {*} status
 * @param {*} content
 */
 __buildFeedbackResponse(id, status, content) {
    var feedback = {};

    feedback.id = id;
        feedback.status = status;
        feedback.content = content;
        return feedback;
    }

    __getAnswersJSONMCQSR(skipQuestion) {
        var score = 0;
        var answer = '';
        var interactions = {};
        var response = {};

        /*Setup results array */
        var interactionArray = new Array(1);
        /* Split questionJSON to get interactionId. */
        //var questionData = __content.questionsJSON[0].split("^^");
        var interactionId = null;
        // Filter all the MCQMRs
        var filtered = this.mcqObj.mcqModel.interactions.filter(function (interaction) {
            return interaction.type === 'MCQSR';
        });

        if (skipQuestion) {
            answer = 'Not Answered';
        } else {

            filtered.forEach((el, idx) => {
                interactionId = el.id;
                answer = this.mcqObj.content.userAnswers[el.id];

                if (__correctAnswers[el.id] === this.mcqObj.content.userAnswers[el.id]) {
                    score++;
                }
            });
        }

        interactions = {
            id: interactionId,
            answer: answer,
            score: score,
            maxscore: this.mcqObj.content.meta.score.max
        };
        interactionArray[0] = interactions;

        response = {
            'interactions': interactionArray
        };

        return {
            response: response
        };
    }

     /**
     * Function called to send result JSON to adaptor (partial save OR submit).
     * Parameters:
     * 1. bSumbit (Boolean): true: for Submit, false: for Partial Save.
     */
    saveResults(bSubmit) {
            var uniqueId = this.mcqObj.adaptor.getId();

            /*Getting answer in JSON format*/
            var answerJSONs = this.__getAnswersJSON();

            answerJSONs.forEach((answerJSON, idx) => {
                /* User clicked the Submit button*/
                if (bSubmit === true) {
                    answerJSON.statusProgress = 'attempted';
                    /*Send Results to platform*/
                    this.mcqObj.adaptor.submitResults(answerJSON, uniqueId, (data, status) => {
                        if (status === __constants.STATUS_NOERROR) {
                            __state.activitySubmitted = true;
                            /*Close platform's session*/
                            this.mcqObj.adaptor.closeActivity();
                            __state.currentTries = 0;
                        } else {
                            /* There was an error during platform communication, so try again (till MAX_RETRIES) */
                            if (__state.currentTries < __config.MAX_RETRIES) {
                                __state.currentTries++;
                                this.__saveResults(bSubmit);
                            }
                        }
                    });
                }
            });
        }
    /**
     * Function to show correct Answers to User, called on click of Show Answers/Submit Button.
    */
    markAnswers() {
        this[markCheckBox]();
    }
/* Add correct or wrong answer classes*/
[markCheckBox]() {
        var interactions = this.mcqObj.mcqModel.interactions;
        // Assuming that there is only one interaction.
        var type = interactions[0]['type'];
        var interaction = null;

        if (type === 'MCQMR') {
            $('input[id^=option]').closest('li').removeClass('highlight');
            $('input[id^=option]').closest('li').addClass('wrong');
            for (interaction in __correctAnswers) {
                if (__correctAnswers.hasOwnProperty(interaction)) {
                    for (let j = 0; j < __correctAnswers[interaction]['correct'].length; j++) {
                        $('#' + interaction + " input[name='" + __correctAnswers[interaction]['correct'][j] + "']").closest('li').removeClass('wrong');
                        $('#' + interaction + " input[name='" + __correctAnswers[interaction]['correct'][j] + "']").closest('li').addClass('correct');
                    }
                }
            }
        }

        if (type === 'MCQSR') {
            let interactionid = Object.keys(__correctAnswers);

            if (interactionid) {

                let correctAnswer = __correctAnswers[interactionid]['correct'];
                let userAnswer = this.mcqObj.userAnswers[interactionid];

                if (userAnswer.trim() === correctAnswer.trim()) {
                    $('#' + userAnswer).closest('li').removeClass('highlight');
                    $('#' + userAnswer).closest('li').addClass('correct');
                } else {
                    $('#' + userAnswer).closest('li').removeClass('highlight');
                    $('#' + userAnswer).closest('li').addClass('wrong');
                }
                //     $("#" + userAnswer).siblings('.answer').removeClass("invisible");
            }
        }
    }

    feedbackProcessor() {
        var type = this.mcqObj.mcqModel.interactions[0]['type'];
        var isCorrect = null;

        isCorrect = (answerjson, useranswerjson) => {
            let isCorrect = false;
            let countCorrectInteractionAttempt = 0;

            if (answerjson == null || useranswerjson == null) {
                isCorrect = false;
                return isCorrect;
            }

            if (Object.keys(answerjson).length !== Object.keys(useranswerjson).length) {
                isCorrect = false;
                return isCorrect;
            }

            for (let key in useranswerjson) {
                if (useranswerjson.hasOwnProperty(key)) {
                    if (useranswerjson[key].length === __correctAnswers[key]['correct'].length) {
                        if (useranswerjson[key].sort().join('') === __correctAnswers[key]['correct'].sort().join('')) {
                            countCorrectInteractionAttempt++;
                        }
                    }
                }
            }

            if (countCorrectInteractionAttempt === Object.keys(__correctAnswers).length) {
                isCorrect = true;
                return isCorrect;
            }
            if (countCorrectInteractionAttempt !== Object.keys(__correctAnswers).length) {
                isCorrect = false;
                return isCorrect;
            }
            this.mcqObj.adaptor.autoResizeActivityIframe();
            return isCorrect;
        };
        if (type === 'MCQMR') {
            for (let prop in this.mcqObj.mcqModel.feedback) {
                this.mcqObj.mcqModel.feedbackState[prop] = false;
            }
            let keys = Object.keys(this.mcqObj.userAnswers);

            if (this.mcqObj.userAnswers[keys[0]].length <= 0) {
                this.mcqObj.mcqModel.feedbackState.empty = true;
            } else if (isCorrect(__correctAnswers, this.mcqObj.userAnswers)) {
                this.mcqObj.mcqModel.feedbackState.correct = true;
            } else {
                this.mcqObj.mcqModel.feedbackState.incorrect = true;
            }
        }

        if (type === 'MCQSR') {
            Object.keys(__correctAnswers).forEach((elem, idx) => {
                let correctAnswer = __correctAnswers[elem]['correct'];
                let userAnswer = this.mcqObj.userAnswers[elem];

                if (userAnswer === correctAnswer) {
                    this.mcqObj.mcqModel.feedbackState.correct = true;
                    this.mcqObj.mcqModel.feedbackState.incorrect = false;
                    this.mcqObj.mcqModel.feedbackState.empty = false;
                } else {
                    this.mcqObj.mcqModel.feedbackState.correct = false;
                    this.mcqObj.mcqModel.feedbackState.incorrect = true;
                    this.mcqObj.mcqModel.feedbackState.empty = false;
                }

                if (userAnswer === '') {
                    this.mcqObj.mcqModel.feedbackState.correct = false;
                    this.mcqObj.mcqModel.feedbackState.incorrect = false;
                    this.mcqObj.mcqModel.feedbackState.empty = true;
                }
            });
        }
     this.mcqObj.adaptor.autoResizeActivityIframe();
    }
}

export default McqUserResponse;
