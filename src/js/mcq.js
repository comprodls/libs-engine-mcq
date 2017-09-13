/*
 * -------------
 * Engine Module
 * -------------
 * 
 * Item Type: MCQ Quesion engine
 * Code: MCQ
 * Interface: ENGINE
 
 *  ENGINE Interface public functions
 *  {
 *          init(),
 *          getConfig()
 *          getStatus()
 *  }
 * 
 *
 * This engine is designed to be loaded dynamical by other applications (or  platforms). At the starte the function [ engine.init() ] will be called  with necessary configuration paramters and a reference to platform "Adapter"  which allows subsequent communuication with the platform.
 * 
 *
 * The function engine.getConfig() is called to request SIZE information - the response from the engine is used to resize & display the container iframe.
 *
 * The function [ engine.getStatus() ] may be called to check if SUBMIT has been pressed or not - the response from the engine is used to enable / disable appropriate platform controls.
 *
 *
 * EXTERNAL JS DEPENDENCIES : ->
 * Following are shared/common dependencies and assumed to loaded via the platform. The engine code can use/reference these as needed
 * 1. JQuery (2.1.1)
 * 2. Boostrap (TODO: version) 
 */

define(['text!../html/mcq.html', //HTML layout(s) template (handlebars/rivets) representing the rendering UX
    'css!../css/mcq.css',  //Custom styles of the engine (applied over bootstrap & front-end-core)
    'rivets',  // Rivets for data binding
    'sightglass'], //Required by Rivets
    function (mcqTemplateRef) {

        mcq = function () {

            "use strict";

            /*
             * Reference to platform's activity adaptor (initialized during init() ).
             */
            var activityAdaptor;

            /*
             * Internal Engine Config.
             */
            var __config = {
                MAX_RETRIES: 10, /* Maximum number of retries for sending results to platform for a particular activity. */
            };

            /*
            * Internal Engine State.
            */
            var __state = {
                currentTries: 0, /* Current try of sending results to platform */
                activityPariallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
                activitySubmitted: false /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
            };

            /*
             * Content (loaded / initialized during init() ).
             */
            var __content = {
                user_answers: {},
                instructions: [],
                interactions: [],
                stimuli: [],
                type: ""
            };

            var __interactionIds = [];
            var __correct_answers = {};
            var __scoring = {};
            var __feedback = {};
            var __feedbackState = {
                'correct': false,
                'incorrect': false,
                'empty': false
            };
            var INTERACTION_REFERENCE_STR = "http://www.comprodls.com/m1.0/interaction/mcq";

            /*
             * Constants.
             */
            var __constants = {
                /* CONSTANT for PLATFORM Save Status NO ERROR */
                STATUS_NOERROR: "NO_ERROR",
                TEMPLATES: {
                    /* Regular MCQ Layout */
                    MCQ: mcqTemplateRef
                }
            };
            // Array of all interaction tags in question

            /********************************************************/
            /*                  ENGINE-SHELL INIT FUNCTION
                
                "elRoot" :->        DOM Element reference where the engine should paint itself.                                                     
                "params" :->        Startup params passed by platform. Include the following sets of parameters:
                                (a) State (Initial launch / Resume / Gradebook mode ).
                                (b) TOC parameters (videoRoot, contentFile, keyframe, layout, etc.).
                "adaptor" :->        An adaptor interface for communication with platform (__saveResults, closeActivity, savePartialResults, getLastResults, etc.).
                "htmlLayout" :->    Activity HTML layout (as defined in the TOC LINK paramter). 
                "jsonContent" :->    Activity JSON content (as defined in the TOC LINK paramter).
                "callback" :->      To inform the shell that init is complete.
            */
            /********************************************************/
            function init(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
                /* ---------------------- BEGIN OF INIT ---------------------------------*/
                //Store the adaptor  
                activityAdaptor = adaptor;

                //Clone the JSON so that original is preserved.
                var jsonContent = jQuery.extend(true, {}, jsonContentObj);
                /* ------ VALIDATION BLOCK START -------- */
                // Need to validate if it can be further optmized.
                if (jsonContent.content === undefined) {
                    if (callback) {
                        callback();
                    }
                    return; /* -- EXITING --*/
                }

                /* Tranforming jsoncontent for rendering and manipulation purpose. */
                __buildModelandViewContent(jsonContent, params);
                /* Apply the layout HTML to the dom */
                $(elRoot).html(__constants.TEMPLATES[htmlLayout]);

                /* Initialize RIVET. */
                __initRivets();
                /* ---------------------- SETUP EVENTHANDLER STARTS----------------------------*/
                // Registering the checkbox click handler for MCQMR
                $('input[id^=option]').change(__handleCheckboxClick);
                // Registering the radio click handler for MCQSR
                $('input[class^=mcqsroption]').change(__handleRadioButtonClick);

                $(document).bind('userAnswered', function () {
                    __saveResults(false);
                });
                /* ---------------------- SETUP EVENTHANDLER ENDS------------------------------*/

                /* Inform the shell that init is complete */
                if (callback) {
                    callback();
                }

                /* ---------------------- END OF INIT ---------------------------------*/
            }

            /* ---------------------- PUBLIC FUNCTIONS --------------------------------*/
            /**
             * ENGINE-SHELL Interface
             * May be used in future, No change required
             * Return configuration
             */
            function getConfig() {
            }

            /**
             * ENGINE-SHELL Interface
             * May be used in future, No change required.
             * Return the current state (Activity Attempted.) of activity.
             */
            function getStatus() {
            }

            /**
            * Bound to click of Activity submit button.
            */
            function handleSubmit() {
                /* Saving Answers. */
                __saveResults(true);
                $('input[id^=option]').attr("disabled", true);
                $('input[class^=mcqsroption]').attr("disabled", true);
            }

            /**
            * Function to show user grades.
            */
            function showGrades(uniqueid) {
                /* Show last saved answers. */
                $('input[id^=option]').attr("disabled", true);
                __markAnswers();
            }

            /**
             * Function to display last result saved in LMS.
             */
            function updateLastSavedResults(lastResults) {
                // Read data and populate answerjson.
                __content.user_answers = {};
                for (var interaction in lastResults.response) {
                    __content.user_answers[interaction] = lastResults.response[interaction];
                    for (var j = 0; j < __content.user_answers[interaction].length; j++) {
                        $("#" + interaction + " input[name='" + __content.user_answers[interaction][j] + "']").checked = true;
                    }
                }
            }

            /** Default feedback. This feedback will be shown if app doesn't wan't to override it by its own Feedback. */
            function showfeedback() {
                activityAdaptor.autoResizeActivityIframe();
                var type = __content.interactions[0]['type'];

                if (type === 'MCQMR') {
                    for (var prop in __feedback) {
                        __feedbackState[prop] = false;
                    }
                    if (__content.user_answers.length <= 0) {
                        __feedbackState.empty = true;
                    } else if (isCorrect(__correct_answers, __content.user_answers)) {
                        __feedbackState.correct = true;
                    } else {
                        __feedbackState.incorrect = true;
                    }

                    function isCorrect(answerjson, useranswerjson) {
                        var isCorrect = false;
                        if (answerjson == null || useranswerjson == null) return isCorrect = false;

                        if (Object.keys(answerjson).length != Object.keys(useranswerjson).length) {
                            return isCorrect = false;
                        }

                        var countCorrectInteractionAttempt = 0;
                        for (var key in __content.user_answers) {
                            var score = 0;
                            var interactionResult = {};
                            if (__content.user_answers.hasOwnProperty(key)) {
                                if (__content.user_answers[key].length === __correct_answers[key]['correct'].length) {
                                    if (__content.user_answers[key].sort().join("") === __correct_answers[key]['correct'].sort().join(""))
                                        countCorrectInteractionAttempt++;
                                }
                            }
                        }

                        if (countCorrectInteractionAttempt === Object.keys(__correct_answers).length) return isCorrect = true;
                        if (countCorrectInteractionAttempt !== Object.keys(__correct_answers).length) return isCorrect = false;
                        return isCorrect;
                    }
                }

                if (type === "MCQSR") {
                    Object.keys(__correct_answers).forEach(function (elem, idx) {
                        var correctAnswer = __correct_answers[elem]['correct'];
                        var userAnswer = __content.user_answers[elem];
                        if (userAnswer === correctAnswer) {
                            __feedbackState.correct = true;
                            __feedbackState.incorrect = false;
                            __feedbackState.empty = false;
                        } else {
                            __feedbackState.correct = false;
                            __feedbackState.incorrect = true;
                            __feedbackState.empty = false;
                        }

                        if (userAnswer == '') {
                            __feedbackState.correct = false;
                            __feedbackState.incorrect = false;
                            __feedbackState.empty = true;
                        }
                    })
                }
            }
            /* ---------------------- PUBLIC FUNCTIONS END ----------------------------*/


            /* ---------------------- PRIVATE FUNCTIONS -------------------------------*/

            /*------------------------RIVET INITIALIZATION & BINDINGS -------------------------------*/
            function __initRivets() {
                rivets.formatters.propertyList = function (obj) {
                    return (function () {
                        var properties = [];
                        for (var key in obj) {
                            properties.push({ key: key, value: obj[key] })
                        }
                        return properties
                    })();
                }

                rivets.formatters.idcreator = function (index, idvalue) {
                    return idvalue + index;
                }
                var data = {
                    content: __content,
                    feedback: __feedback,
                    showFeedback: __feedbackState
                }
                /*Bind the data to template using rivets*/
                rivets.bind($('#mcq-engine'), data);
            }
            /*------------------------RIVETS END-------------------------------*/


            /* ---------------------- JQUERY BINDINGS ---------------------------------*/
            /**
            * Function to handle checkbox click.
            */
            function __handleCheckboxClick(event) {
                var currentTarget = event.currentTarget;
                var currentInteractionId = currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
                var currentChoice = currentTarget.getAttribute('name');
                if (currentTarget.checked) {
                        $(currentTarget).parent().parent("li").addClass("highlight");
                    if (!__content.user_answers[currentInteractionId]) {
                        __content.user_answers[currentInteractionId] = [];
                    }
                    __content.user_answers[currentInteractionId].push(currentChoice);
                } else {
                    remove(__content.user_answers[currentInteractionId], currentChoice);
                    $(currentTarget).parent().parent("li").removeClass("highlight");
                }
                //$(document).triggerHandler('userAnswered');
                __savePartial(currentInteractionId);
                function remove(arr, value) {
                    var found = arr.indexOf(value);
                    if (found !== -1) {
                        arr.splice(found, 1);
                    }
                }
            }

            /** Function to handle radio button click.*/
            function __handleRadioButtonClick(event) {
                /*
                 * Soft save here
                 */
                var currentTarget = event.currentTarget;
                var currentInteractionId = currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute("id");

                $("label.radio").parent().removeClass("highlight");
                $(currentTarget).parent().parent("li").addClass("highlight");

                var newAnswer = currentTarget.value.replace(/^\s+|\s+$/g, '');
                /* Save new Answer in memory. */
                __content.user_answers[currentInteractionId] = $(event.currentTarget).attr('id');
                __state.radioButtonClicked = true;
                __content.feedbackJSON = __feedback;
                __savePartial(currentInteractionId);
            }
            /*------------------------RIVETS END-------------------------------*/

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
                        answerJSON.statusProgress = "attempted";
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

            function __savePartial(interactionid) {
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
                })
            }



            /*------------------------OTHER PRIVATE FUNCTIONS------------------------*/

            /**
             * Function to show correct Answers to User, called on click of Show Answers/Submit Button.
             */
            function __markAnswers() {
                __markCheckBox()
            }

            /* Add correct or wrong answer classes*/
            function __markCheckBox() {

                var interactions = __content.interactions;
                // Assuming that there is only one interaction.
                var type = interactions[0]['type'];

                $('input[id^=option]').prev('span').addClass("wrong");

                if (type === 'MCQMR') {
                    for (var interaction in __correct_answers) {
                        if (__correct_answers.hasOwnProperty(interaction)) {
                            for (var j = 0; j < __correct_answers[interaction]['correct'].length; j++) {
                                $("#" + interaction + " input[name='" + __correct_answers[interaction]['correct'][j] + "']").prev('span').removeClass("wrong")
                                $("#" + interaction + " input[name='" + __correct_answers[interaction]['correct'][j] + "']").prev('span').removeClass("state-error")
                                $("#" + interaction + " input[name='" + __correct_answers[interaction]['correct'][j] + "']").prev('span').addClass("correct")
                                $("#" + interaction + " input[name='" + __correct_answers[interaction]['correct'][j] + "']").prev('span').addClass("state-success")
                            }
                        }
                        $("[id^=rejoinder]").removeClass("invisible");
                    }
                }

                if (type === 'MCQSR') {
                    var interactionid = Object.keys(__correct_answers);

                    if (interactionid) {

                        var correctAnswer = __correct_answers[interactionid]['correct'];
                        var userAnswer = __content.user_answers[interactionid];

                        if (userAnswer.trim() === correctAnswer.trim()) {
                            $("#" + userAnswer).parent().parent().removeClass('highlight');
                            $("#" + userAnswer).parent().parent().addClass('correct');
                        } else {
                            $("#" + userAnswer).parent().parent().removeClass('highlight');
                            $("#" + userAnswer).parent().parent().addClass('wrong');
                        }
                   //     $("#" + userAnswer).siblings('.answer').removeClass("invisible");
                    }
                }
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
                if (typeof interactionid == undefined) {

                    var filteredInteraction = __content.interactions.filter(function (interaction) {
                        return interaction.id === interactionid;
                    })

                    // Match the interaction id to set partial results and save
                    if (filteredInteraction) {
                        var interactiontype = filteredInteraction[0].type;

                        if (interactiontype == 'MCQMR') {
                            var mcqmrans = __getAnswersJSONMCQMR();
                            response.push(mcqmrans);
                        }
                        if (interactiontype == 'MCQSR') {
                            var mcqsrans = __getAnswersJSONMCQSR(false);
                            response.push(mcqsrans);
                        }
                    }
                } else {
                    var mcqmrans = __getAnswersJSONMCQMR();
                    response.push(mcqmrans);
                    var mcqsrans = __getAnswersJSONMCQSR();
                    response.push(mcqsrans);
                }
                return response;
            }


            function __getAnswersJSONMCQMR() {
                var resultArray = [];
                var statusEvaluation = "empty";
                var feedback = "";
                var maxscore = __scoring.max;
                var perInteractionScore = __interactionIds.length / maxscore;
                var interactioncount = Object.keys(__correct_answers).length;
                var isUserAnswerCorrect = false;
                // Filter all the MCQMRs
                var filtered = __content.interactions.filter(function (interaction) {
                    return interaction.type === 'MCQMR';
                })

                var countCorrectInteractionAttempt = 0;
                /* Iterate over user_answers and calculate */

                filtered.forEach(function (eachElem, idx) {
                    var score = 0;
                    var interactionResult = {};
                    var id = eachElem.id;

                    if (__content.user_answers.hasOwnProperty(id)) {
                        if (__content.user_answers[id].length === __correct_answers[id]['correct'].length) {
                            if (__content.user_answers[id].sort().join("") === __correct_answers[id]['correct'].sort().join(""))
                                score = perInteractionScore;
                            countCorrectInteractionAttempt++;
                            isUserAnswerCorrect = true;
                        }
                    }
                    resultArray.push({
                        itemUID: id,
                        answer: __content.user_answers[id],
                        score: score
                    });
                });

                if (isUserAnswerCorrect) {
                    statusEvaluation = "correct";
                    feedback = __buildFeedbackResponse("global.correct", "correct", __feedback.correct);
                } else if (countCorrectInteractionAttempt === 0) {
                    statusEvaluation = "incorrect";
                    feedback = __buildFeedbackResponse("global.incorrect", statusEvaluation, __feedback.incorrect);
                } else {
                    statusEvaluation = "partially_correct";
                    feedback = __buildFeedbackResponse("global.incorrect", "incorrect", __feedback.incorrect);
                }

                return {
                    response: {
                        "interactions": resultArray,
                        "statusEvaluation": statusEvaluation,
                        "feedback": feedback
                    }
                };
            }

            function __getAnswersJSONMCQSR(skipQuestion) {
                var score = 0;
                var answer = "";
                var interactions = {};

                /*Setup results array */
                var interactionArray = new Array(1);
                /* Split questionJSON to get interactionId. */
                //var questionData = __content.questionsJSON[0].split("^^");
                var interactionId = null;
                // Filter all the MCQMRs
                var filtered = __content.interactions.filter(function (interaction) {
                    return interaction.type === 'MCQSR';
                })

                if (skipQuestion) {
                    answer = "Not Answered";
                } else {

                    filtered.forEach(function (el, idx) {
                        interactionId = el.id;
                        answer = __content.user_answers[el.id];

                        if (__correct_answers[el.id] === __content.user_answers[el.id]) {
                            score++;
                        }
                    })
                }

                interactions = {
                    id: interactionId,
                    answer: answer,
                    score: score,
                    maxscore: __scoring.max
                };
                interactionArray[0] = interactions;

                var response = {
                    "interactions": interactionArray
                };

                return {
                    response: response
                };
            }

            /**
             * Prepare feedback response.
             * @param {*} id 
             * @param {*} status 
             * @param {*} content 
             */
            function __buildFeedbackResponse(id, status, content) {
                var feedback = {};
                feedback.id = id;
                feedback.status = status;
                feedback.content = content;
                return feedback;
            }

            function __buildModelandViewContent(jsonContent, params) {

                __content.instructions = jsonContent.content.instructions.map(function (element) {
                    var tagtype = element['tag'];
                    return element[tagtype];
                })

                __content.interactions = jsonContent.content.canvas.data.questiondata.map(function (element) {
                    var txt = element['text'];
                    var obj = {};
                    var parsedQuestionArray = $('<div>' + element['text'] + '</div>');
                    var currinteractionid = $(parsedQuestionArray).find("a[href='" + INTERACTION_REFERENCE_STR + "']").text().trim();
                    var href = $('<div>').append(txt).find('a:first').attr('href');

                    $(parsedQuestionArray).find("a[href='" + INTERACTION_REFERENCE_STR + "']").remove();
                    obj.id = currinteractionid;
                    obj.questiontext = $(parsedQuestionArray).html();
                    obj.prompt = "";
                    var tempobj = jsonContent.content.interactions[currinteractionid];
                    var interactiontype = tempobj['type'];
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
                    })
                    __interactionIds.push(currinteractionid);
                    return obj
                })

                __content.stimuli = jsonContent.content.stimulus.map(function (element) {
                    var tagtype = element['tag'];
                    if (tagtype === "image") {
                        return params.questionMediaBasePath + element[tagtype];
                    }
                    return element[tagtype];
                })
                __correct_answers = jsonContent.responses;
                __scoring = jsonContent.meta.score;
                __feedback = jsonContent.feedback;
            }
            return {
                /*Engine-Shell Interface*/
                "init": init, /* Shell requests the engine intialized and render itself. */
                "getStatus": getStatus, /* Shell requests a gradebook status from engine, based on its current state. */
                "getConfig": getConfig, /* Shell requests a engines config settings.  */
                "handleSubmit": handleSubmit,
                "showGrades": showGrades,
                "updateLastSavedResults": updateLastSavedResults,
                "showFeedback": showfeedback
            };
        }
    });


