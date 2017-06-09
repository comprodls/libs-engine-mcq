/*
 * -------------
 * Engine Module
 * -------------
 * 
 * Item Type: MCQMR Single Choice Quesion engine
 * Code: MCQMR
 * Interface: ENGINE
 
 *  ENGINE Interface public functions
 *  {
 *          init(),
 *          getConfig()
 *  }
 * 
 *
 * This engine is designed to be loaded dynamical by other applications (or  platforms). At the starte the function [ engine.init() ] will be called  with necessary configuration paramters and a reference to platform "Adapter"  which allows subsequent communuication with the platform.
 * 
 *
 * The function engine.getConfig() is called to request SIZE information - the response from the engine is used to resize & display the container iframe.
 *
 *
 * EXTERNAL JS DEPENDENCIES : ->
 * Following are shared/common dependencies and assumed to loaded via the platform. The engine code can use/reference these as needed
 * 1. JQuery (2.1.1)
 * 2. Boostrap (TODO: version) 
 */

define(['text!../html/mcqmr.html', //HTML layout(s) template (handlebars/rivets) representing the rendering UX
    'css!../css/mcqmr.css',  //Custom styles of the engine (applied over bootstrap & front-end-core)
    'rivets',  // Rivets for data binding
    'sightglass'], //Required by Rivets
    function (mcqmrTemplateRef) {

        mcqmr = function () {

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
                RESIZE_MODE: "auto", /* Possible values - "manual"/"auto". Default value is "auto". */
                RESIZE_HEIGHT: "580" /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will overrides. */
                /* If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
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
                stimuli: []
            };


            var __interactionIds = [];//Not required as it can be calculated from __correct_answers
            var __correct_answers = {};
            var __scoring = {};
            
            var __feedback = {};
            var __feedbackState = {
                'correct' : false,
                'incorrect' : false,
                'empty' : false
            };
            var INTERACTION_REFERENCE_STR = "http://www.comprodls.com/m1.0/interaction/mcqmr";

            /*
             * Constants.
             */
            var __constants = {
                /* CONSTANT for PLATFORM Save Status NO ERROR */
                STATUS_NOERROR: "NO_ERROR",
                TEMPLATES: {
                    /* Regular MCQMR Layout */
                    MCQMR: mcqmrTemplateRef
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
                console.log("Welcome to the init world! ++++++++++++++++++++++++++++");

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

                // $('input[id^=option]').change(__handleRadioButtonClick); 

                $('input[id^=option]').change(__handleCheckboxClick);

                $(document).bind('userAnswered', function () {
                    __saveResults(false);
                });

                 //update states??   

                /* ---------------------- SETUP EVENTHANDLER ENDS------------------------------*/

                /* Inform the shell that init is complete */
                if (callback) {
                    callback();
                }

                /* ---------------------- END OF INIT ---------------------------------*/
            } /* init() Ends. */
            /* ---------------------- PUBLIC FUNCTIONS --------------------------------*/
            /**
             * ENGINE-SHELL Interface
             *
             * Return configuration
             */
            function getConfig() {
                return __config;
            }

            /**
             * ENGINE-SHELL Interface
             *
             * Return the current state (Activity Attempted.) of activity.
             */
            function getStatus() {
                return __state.activitySubmitted || __state.activityPariallySubmitted;
            }

            /**
            * Bound to click of Activity submit button.
            */
            function handleSubmit() {
                /* Saving Answers. */
                __saveResults(true);

                /* Marking Answers. */
                if (activityAdaptor.showAnswers) {
                    __markAnswers();
                    showfeedback();
                }
                $('input[id^=option]').attr("disabled", true);
            }

            /**
            * Function to show user grades.
            */
            function showGrades(savedAnswer, reviewAttempt) {
                /* Show last saved answers. */
                updateLastSavedResults(savedAnswer);
                /* Mark answers. */
                if (reviewAttempt) {
                    __markAnswers();
                }
                $('input[id^=option]').attr("disabled", true);
            }

            /**
             * Function to display last result saved in LMS.
             */
            function updateLastSavedResults(lastResults) {
                // Read data and populate answerjson.
                __content.user_answers = {};
                for(var interaction in lastResults.response){
                    __content.user_answers[interaction]  = lastResults.response[interaction]; 
                    for (var j = 0; j < __content.user_answers[interaction].length; j++) {
                            $("#" + interaction + " input[name='" + __content.user_answers[interaction][j] + "']").checked = true;
                    }
                }
            }
            /** Default feedback. This feedback will be shown if app doesn't wan't to override it by its own Feedback. */
            function showfeedback() {
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

                    if(countCorrectInteractionAttempt === Object.keys(__correct_answers).length) return isCorrect = true;
                    if(countCorrectInteractionAttempt !== Object.keys(__correct_answers).length) return isCorrect = false;

                    return isCorrect;
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

                /*Bind the data to template using rivets*/
                rivets.bind($('#mcqmr-engine'), {
                    content: __content,
                    feedback: __feedback,
                    showFeedback: __feedbackState
                });
            }
            /*------------------------RIVETS END-------------------------------*/


            /* ---------------------- JQUERY BINDINGS ---------------------------------*/
            /**
            * Function to handle radio button click.
            */
            function __handleCheckboxClick(event) {
                var currentTarget = event.currentTarget;
                var currentInteractionId = currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
                var currentChoice = currentTarget.getAttribute('name');
                if (currentTarget.checked) {
                    if (!__content.user_answers[currentInteractionId]) {
                        __content.user_answers[currentInteractionId] = [];
                    }
                    __content.user_answers[currentInteractionId].push(currentChoice);
                } else {
                    remove(__content.user_answers[currentInteractionId], currentChoice);
                }
                $(document).triggerHandler('userAnswered');
                function remove(arr, value) {
                    var found = arr.indexOf(value);
                    if (found !== -1) {
                        arr.splice(found, 1);
                    }
                }
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
                var answerJSON = __getAnswersJSON(false);

                if (bSubmit === true) {/*Hard Submit*/
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
                } else { /*Soft Submit*/
                    /*Send Results to platform*/
                    answerJSON.statusProgress = "in_progress";
                    activityAdaptor.savePartialResults(answerJSON, uniqueId, function (data, status) {
                        if (status === __constants.STATUS_NOERROR) {
                            __state.activityPariallySubmitted = true;
                        } else {
                            /* There was an error during platform communication, do nothing for partial saves */
                        }
                    });
                }
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
                //T.B.D
                $('input[id^=option]').prev('span').addClass("wrong");
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




            /**
             *  Function used to create JSON from user Answers for submit(soft/hard).
             *  Called by :-
             *   1. __saveResults (internal).
             *   2. Multi-item-handler (external).
             *   3. Divide the maximum marks among interaction.
             *   4. Returns result objects.  [{ itemUID: interactionId,  answer: answer,   score: score }]
             */
            function __getAnswersJSON(skipQuestion) {
                var resultArray = [];
                var statusEvaluation = "empty";
                var feedback = "";

                if (!skipQuestion) {
                    var maxscore = __scoring.max;
                    var perInteractionScore = __interactionIds.length / maxscore;
                    var interactioncount = Object.keys(__correct_answers).length;
                    var countCorrectInteractionAttempt = 0;
                    /* Iterate over user_answers and calculate */
                    for (var key in __content.user_answers) {
                        var score = 0;
                        var interactionResult = {};
                        if (__content.user_answers.hasOwnProperty(key)) {
                            if (__content.user_answers[key].length === __correct_answers[key]['correct'].length) {
                                if (__content.user_answers[key].sort().join("") === __correct_answers[key]['correct'].sort().join(""))
                                    score = perInteractionScore;
                                    countCorrectInteractionAttempt++;
                            }
                        }
                        resultArray.push({
                            itemUID: key,
                            answer: __content.user_answers[key],
                            score: score
                        });
                    }

                    if (countCorrectInteractionAttempt === interactioncount) {
                        statusEvaluation = "correct";
                        /* Prepare Feedback */
                        feedback = {
                            "global": {
                                "id": "global.correct",
                                "status": "correct",
                                "content": __feedback.correct
                            }
                        }
                    } else if (countCorrectInteractionAttempt === 0) {
                        statusEvaluation = "incorrect";
                        feedback = {
                            "global": {
                                "id": "global.incorrect",
                                "status": statusEvaluation,
                                "content": __feedback.incorrect
                            }
                        }
                    } else {
                        statusEvaluation = "partially_correct";
                        feedback = {
                            "global": {
                                "id": "global.incorrect",
                                "status": "incorrect",
                                "content": __feedback.incorrect
                            }
                        }
                    }
                } else {
                    statusEvaluation = "incorrect";
                }
                                
                return {
                    "results": resultArray,
                    "statusEvaluation": statusEvaluation,
                    "feedback": feedback
                };
            }


            function __buildModelandViewContent(jsonContent, params) {
                __content.instructions = jsonContent.content.instructions.map(function (element) {
                    var tagtype = element['tag'];
                    return element[tagtype];
                }) 

                __content.interactions = jsonContent.content.canvas.data.questiondata.map(function (element) {
                    var obj = {};
                    var parsedQuestionArray = $('<div>' + element['text'] + '</div>');
                    var currinteractionid = $(parsedQuestionArray).find("a[href='" + INTERACTION_REFERENCE_STR + "']").text().trim();
                    $(parsedQuestionArray).find("a[href='" + INTERACTION_REFERENCE_STR + "']").remove();
                    obj.id = currinteractionid;
                    obj.questiontext = $(parsedQuestionArray).html();
                    obj.prompt = "";
                    var tempobj = jsonContent.content.interactions[currinteractionid]
                    var interactiontype = tempobj['type'];
                    obj.options = {};
                    tempobj[interactiontype].forEach(function (element) {
                        obj.options[Object.keys(element)[0]] = element[Object.keys(element)[0]];
                    })
                    __interactionIds.push(currinteractionid);
                    return obj
                })

                __content.stimuli = jsonContent.content.stimulus.map(function (element) {
                    var tagtype = element['tag'];
                     if(tagtype === "image") {
                        return  params.questionMediaBasePath + element[tagtype];
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
                "showfeedback": showfeedback
            };
        }
    });


