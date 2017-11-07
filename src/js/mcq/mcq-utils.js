/* global $ */

import rivets from 'rivets';
/*
 * Reference to platform's activity adaptor (initialized during init() ).
*/
var activityAdaptor;

export let __content = {
    userAnswers: {},
    instructions: [],
    interactions: [],
    stimuli: [],
    type: ''
};

let mcqTemplateRef = require('../../html/mcq.html');

let mcqLightTemplateRef = require('../../html/mcq-light.html');

let mcqDarkTemplateRef = require('../../html/mcq-dark.html');

require('../../scss/index.scss');
/*
 * Internal Engine Config.
 */
export const __config = {
    MAX_RETRIES: 10 /* Maximum number of retries for sending results to platform for a particular activity. */
};

/*
 * Internal Engine State.
 */
export let __state = {
    currentTries: 0, /* Current try of sending results to platform */
    activityPariallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
    activitySubmitted: false /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
};

/*
 * Content (loaded / initialized during init() ).
 */
export let __interactionIds = [];
export let __correctAnswers = {};
export let __scoring = {};
export let __feedback = {};
export let __feedbackState = {
    'correct': false,
    'incorrect': false,
    'empty': false
};

export let INTERACTION_REFERENCE_STR = 'http://www.comprodls.com/m1.0/interaction/mcq';

/*
 * Constants.
 */
export let __constants = {
    /* CONSTANT for PLATFORM Save Status NO ERROR */
    STATUS_NOERROR: 'NO_ERROR',
    TEMPLATES: {
        /* Regular MCQ Layout */
        MCQ: mcqTemplateRef,
        MCQ_LIGHT: mcqLightTemplateRef,
        MCQ_DARK: mcqDarkTemplateRef
    }
};

/**
 * Prepare feedback response.
 * @param {*} id 
 * @param {*} status 
 * @param {*} content 
 */
export function __buildFeedbackResponse(id, status, content) {
    var feedback = {};

    feedback.id = id;
    feedback.status = status;
    feedback.content = content;
    return feedback;
}

function __getAnswersJSONMCQMR() {
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

/**
 *  Function used to create JSON from user Answers for submit(soft/hard).
 *  Called by :-
 *   1. __saveResults (internal).
 *   2. Multi-item-handler (external).
 *   3. Divide the maximum marks among interaction.
 *   4. Returns result objects.  [{ itemUID: interactionId,  answer: answer,   score: score }]
 */
function __getAnswersJSON(skipQuestion, interactionid) {

    var response = [];
    var filteredInteraction = '';
    var interactiontype = '';

    if (typeof interactionid === undefined) {
        filteredInteraction = __content.interactions.filter(function (interaction) {
            return interaction.id === interactionid;
        });

        // Match the interaction id to set partial results and save
        if (filteredInteraction) {
            interactiontype = filteredInteraction[0].type;

            if (interactiontype === 'MCQMR') {
                let mcqmrans = __getAnswersJSONMCQMR();

                response.push(mcqmrans);
            }
            if (interactiontype === 'MCQSR') {
                let mcqsrans = __getAnswersJSONMCQSR(false);

                response.push(mcqsrans);
            }
        }
    } else {
        let mcqmrans = __getAnswersJSONMCQMR();

        response.push(mcqmrans);

        let mcqsrans = __getAnswersJSONMCQSR();

        response.push(mcqsrans);
    }
    return response;
}

/**
 * Function called to send result JSON to adaptor (partial save OR submit).
 * Parameters:
 * 1. bSumbit (Boolean): true: for Submit, false: for Partial Save.
 */
function __saveResults(bSubmit) {

    var uniqueId = activityAdaptor.getId();

    /*Getting answer in JSON format*/
    var answerJSONs = __getAnswersJSON();

    answerJSONs.forEach(function (answerJSON, idx) {
        /* User clicked the Submit button*/
        if (bSubmit === true) {
            answerJSON.statusProgress = 'attempted';
            /*Send Results to platform*/
            activityAdaptor.submitResults(answerJSON, uniqueId, function (data, status) {
                if (status === __constants.STATUS_NOERROR) {
                    __state.activitySubmitted = true;
                    /*Close platform's session*/
                    activityAdaptor.closeActivity();
                    __state.currentTries = 0;
                } else {
                    /* There was an error during platform communication, so try again (till MAX_RETRIES) */
                    if (__state.currentTries < __config.MAX_RETRIES) {
                        __state.currentTries++;
                        __saveResults(bSubmit);
                    }
                }
            });
        }
    });
}

/**
 * Bound to click of Activity submit button.
 */
export function handleSubmit() {
    __saveResults(true);
    $('input[id^=option]').attr('disabled', true);
    $('input[class^=mcqsroption]').attr('disabled', true);

    $('li[class^=line-item]').hover(function () {
        $(this).addClass('disable-li-hover');
    });
    $('label[class^=line-item-label]').hover(function () {
        $(this).addClass('disable-li-hover');
    });
}

/* Add correct or wrong answer classes*/
export function __markCheckBox() {

    var interactions = __content.interactions;
    // Assuming that there is only one interaction.
    var type = interactions[0]['type'];

    if (type === 'MCQMR') {
        $('input[id^=option]').closest('li').removeClass('highlight');
        $('input[id^=option]').closest('li').addClass('wrong');
        for (let interaction in __correctAnswers) {
            if (__correctAnswers.hasOwnProperty(interaction)) {
                for (let j = 0; j < __correctAnswers[interaction]['correct'].length; j++) {
                    $('#' + interaction + ' input[name=' + __correctAnswers[interaction]['correct'][j] + ']').closest('li').removeClass('wrong');
                    $('#' + interaction + ' input[name=' + __correctAnswers[interaction]['correct'][j] + ']').closest('li').addClass('correct');
                }
            }
        }
    }

    if (type === 'MCQSR') {
        let interactionid = Object.keys(__correctAnswers);

        if (interactionid) {

            let correctAnswer = __correctAnswers[interactionid]['correct'];
            let userAnswer = __content.userAnswers[interactionid];

            if (userAnswer.trim() === correctAnswer.trim()) {
                $('#' + userAnswer).closest('li').removeClass('highlight');
                $('#' + userAnswer).closest('li').addClass('correct');
            } else {
                $('#' + userAnswer).closest('li').removeClass('highlight');
                $('#' + userAnswer).closest('li').addClass('wrong');
            }
        }
    }
}

/**
 * Function to show correct Answers to User, called on click of Show Answers/Submit Button.
 */
export function __markAnswers() {
    __markCheckBox();
}

/**
  * Function to show user grades.
*/
export function showGrades(uniqueid) {
    /* Show last saved answers. */
    $('input[id^=option]').attr('disabled', true);
    __markAnswers();
}

/**
 * Function to display last result saved in LMS.
 */
export function updateLastSavedResults(lastResults) {
    // Read data and populate answerjson.
    __content.userAnswers = {};
    for (let interaction in lastResults.response) {
        __content.userAnswers[interaction] = lastResults.response[interaction];
        for (let j = 0; j < __content.userAnswers[interaction].length; j++) {
            $('#' + interaction + ' input[name=' + __content.userAnswers[interaction][j] + ']').checked = true;
        }
    }
}

function isCorrect(answerjson, useranswerjson) {
    var isCorrect = false;

    var countCorrectInteractionAttempt = 0;

    if (answerjson == null || useranswerjson == null) {
        isCorrect = false;
        return isCorrect;
    }

    if (Object.keys(answerjson).length !== Object.keys(useranswerjson).length) {
        isCorrect = false;
        return isCorrect;
    }

    for (let key in __content.userAnswers) {
        if (__content.userAnswers.hasOwnProperty(key)) {
            if (__content.userAnswers[key].length === __correctAnswers[key]['correct'].length) {
                if (__content.userAnswers[key].sort().join('') === __correctAnswers[key]['correct'].sort().join('')) {
                    countCorrectInteractionAttempt++;
                }
            }
        }
    }

    if (countCorrectInteractionAttempt === Object.keys(__correctAnswers).length) {
        isCorrect = true;
    }
    if (countCorrectInteractionAttempt !== Object.keys(__correctAnswers).length) {
        isCorrect = false;
    }
    activityAdaptor.autoResizeActivityIframe();
    return isCorrect;
}

/** Default feedback. This feedback will be shown if app doesn't wan't to override it by its own Feedback. */
export function showfeedback() {
    var type = __content.interactions[0]['type'];

    if (type === 'MCQMR') {
        for (let prop in __feedback) {
            __feedbackState[prop] = false;
        }
        if (__content.userAnswers.length <= 0) {
            __feedbackState.empty = true;
        } else if (isCorrect(__correctAnswers, __content.userAnswers)) {
            __feedbackState.correct = true;
        } else {
            __feedbackState.incorrect = true;
        }
    }

    if (type === 'MCQSR') {
        Object.keys(__correctAnswers).forEach(function (elem, idx) {
            var correctAnswer = __correctAnswers[elem]['correct'];

            var userAnswer = __content.userAnswers[elem];

            if (userAnswer === correctAnswer) {
                __feedbackState.correct = true;
                __feedbackState.incorrect = false;
                __feedbackState.empty = false;
            } else {
                __feedbackState.correct = false;
                __feedbackState.incorrect = true;
                __feedbackState.empty = false;
            }

            if (userAnswer === '') {
                __feedbackState.correct = false;
                __feedbackState.incorrect = false;
                __feedbackState.empty = true;
            }
        });
    }
    activityAdaptor.autoResizeActivityIframe();
}

export function initializeRivets() {

    rivets.formatters.propertyList = function (obj) {
        return (function () {
            var properties = [];

            for (let key in obj) {
                properties.push({ key: key, value: obj[key] });
            };
            return properties;
        })();
    };

    rivets.formatters.idcreator = function (index, idvalue) {
        return idvalue + index;
    };

    let data = {
        content: __content,
        feedback: __feedback,
        showFeedback: __feedbackState
    };

    /*Bind the data to template using rivets*/
    rivets.bind($('#mcq-engine'), data);
}

export function __savePartial(interactionid) {
    var uniqueId = activityAdaptor.getId();
    var answerJSONs = __getAnswersJSON(false, interactionid);

    answerJSONs.forEach(function (answerJSON, idx) {
        activityAdaptor.savePartialResults(answerJSON, uniqueId, function (data, status) {
            if (status === __constants.STATUS_NOERROR) {
                __state.activityPariallySubmitted = true;
            } else {
                // There was an error during platform communication, do nothing for partial saves
                // 
            }
        });
    });
}

function remove(arr, value) {
    var found = arr.indexOf(value);

    if (found !== -1) {
        arr.splice(found, 1);
    }
}

/**
* Function to handle checkbox click.
*/
function __handleCheckboxClick(event) {
    var currentTarget = event.currentTarget;
    var currentInteractionId = currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
    var currentChoice = currentTarget.getAttribute('name');

    if (currentTarget.checked) {
        $(currentTarget).closest('li').addClass('highlight');
        if (!__content.userAnswers[currentInteractionId]) {
            __content.userAnswers[currentInteractionId] = [];
        }
        __content.userAnswers[currentInteractionId].push(currentChoice);
    } else {
        remove(__content.userAnswers[currentInteractionId], currentChoice);
        $(currentTarget).closest('li').removeClass('highlight');
    }
    //$(document).triggerHandler('userAnswered');
    __savePartial(currentInteractionId);
}

/** Function to handle radio button click.*/
function __handleRadioButtonClick(event) {
    /*
     * Soft save here
     */
    var currentTarget = event.currentTarget;
    var currentInteractionId = currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');

    $('label.radio').closest('li').removeClass('highlight');
    $(currentTarget).closest('li').addClass('highlight');

    currentTarget = currentTarget.value.replace(/^\s+|\s+$/g, '');
    /* Save new Answer in memory. */
    __content.userAnswers[currentInteractionId] = $(event.currentTarget).attr('id');
    __state.radioButtonClicked = true;
    __content.feedbackJSON = __feedback;
    __savePartial(currentInteractionId);
}

export function buildModelandViewContent(jsonContent, params) {
    __content.instructions = jsonContent.content.instructions.map(function (element) {
        var tagtype = element['tag'];

        return element[tagtype];
    });

    __content.interactions = jsonContent.content.canvas.data.questiondata.map(function (element) {
        //var txt = element['text'];
        var obj = {};
        var parsedQuestionArray = $('<div>' + element['text'] + '</div>');
        var currinteractionid = $(parsedQuestionArray).find("a[href='" + INTERACTION_REFERENCE_STR + "']").text().trim();
        //var href = $('<div>').append(txt).find('a:first').attr('href');

        $(parsedQuestionArray).find("a[href='" + INTERACTION_REFERENCE_STR + "']").remove();
        obj.id = currinteractionid;
        obj.questiontext = $(parsedQuestionArray).html();
        obj.prompt = '';
        let tempobj = jsonContent.content.interactions[currinteractionid];
        let interactiontype = tempobj['type'];

        obj.type = interactiontype;

        if (interactiontype === 'MCQMR') {
            obj.MCQMR = true;
        }
        if (interactiontype === 'MCQSR') {
            obj.MCQSR = true;
        }

        obj.options = {};
        tempobj[interactiontype].forEach(function (element) {
            obj.options[Object.keys(element)[0]] = element[Object.keys(element)[0]];
        });

        __interactionIds.push(currinteractionid);
        return obj;
    });

    __content.stimuli = jsonContent.content.stimulus.map(function (element) {
        var tagtype = element['tag'];

        if (tagtype === 'image') {
            return params.questionMediaBasePath + element[tagtype];
        }
        return element[tagtype];
    });
    __correctAnswers = jsonContent.responses;
    __scoring = jsonContent.meta.score;
    __feedback = jsonContent.feedback;
}

export function initializeHandlers() {
    // Registering the checkbox click handler for MCQMR
    $('input[id^=option]').change(__handleCheckboxClick);

    // Registering the radio click handler for MCQSR
    $('input[class^=mcqsroption]').change(__handleRadioButtonClick);
}

export function setAdaptor(_adaptor) {
    activityAdaptor = _adaptor;
}
