/*
 * -------------------
 * Engine Module Editor
 * -------------------
 * 
 * Item Type: MCQ Multiple Choice Quesion engine
 * Code: MCQ
 * Interface: Editor
 *  
 *  ENGINE EDITOR Interface public functions
 *  {
 *          init(),
 *          getStatus(),
 *          getConfig()
 *  }
 *
 * This engine-editor is designed to be loaded dynamical by other applications (or  platforms). 
 * At the start the function [ engine.init() ] will be called with necessary configuration paramters
 * and a reference to platform Adapter object which allows subsequent communuication with the platform.
 *
 *
 * The function [ engine-editor.getStatus() ] may be called to check if SUBMIT has been pressed or not - the 
 * response from the engine is used to enable / disable appropriate platform controls.
 *
 * The function [ engine-editor.getConfig() ] is called to request SIZE information - the response from the engine
 * is used to resize & display the container iframe.
 *
 * EXTERNAL JS DEPENDENCIES : ->
 * Following are shared/common dependencies and assumed to loaded via the platform. The engine code can use/reference
 * these as needed
 * 1. JQuery (2.1.1) 
 * 2. Boostrap  (TODO: version)
 * 3. Rivets (0.9.6)
 */

define(['text!../html/mcq-editor.html', //Layout of the Editor
    'css!../css/mcq-editor.css', //Custom CSS of the Editor
    'jquery-ui', //Jquery Sortable for reordering
    'css!../../bower_components/jquery-ui/themes/base/jquery-ui.css', //CSS for sortable
    'rivets',   // Rivets for two way data binding
    'sightglass' // Required by Rivets
], function (mcqTemplateRef) {

    mcqEditor = function () {
        "use strict";

        /*
         * Reference to platform's activity adaptor (initialized during init() ).
         */
        var activityAdaptor;

        /*
         * Internal Engine Config.
         */
        var __config = {
            RESIZE_MODE: "auto", /* Possible values - "manual"/"auto". Default value is "auto". */
            RESIZE_HEIGHT: "580" /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will override. */
            /* If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
        };

        /*
         * Internal Engine State.
         */
        var __state = {
            "hasUnsavedChanges": false
        };

        /*
         * Constants 
         */
        var __constants = {
            /* CONSTANT for HTML selectors - defined in the layout */
            DOM_SEL_ACTIVITY_BODY: ".activity-body",

            /* CONSTANT for identifier in which Adaptor Instance will be stored */
            ADAPTOR_INSTANCE_IDENTIFIER: "data-objectid",

            TEMPLATES: {
                /* Regular mcqmr Layout */
                MCQ_EDITOR: mcqTemplateRef
            }
        };

        var __editedJsonContent;
        var __parsedQuestionArray = [];
        // Array of all interactions Ids in question
        var __interactionIds = [];
        // Array of all interaction tags in question
        var __interactionTags = [];
        var __finalJSONContent = {};
        var uniqueId;
        var __quesEdited = {};
        __quesEdited.isEditing = false;
        var __feedbackEditing = {};
        __feedbackEditing = {
            correct: false,
            incorrect: false
        }

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

            uniqueId = activityAdaptor.getId();
            //Clone the JSON so that original is preserved.
            __editedJsonContent = jQuery.extend(true, {}, jsonContentObj);
            /* ------ VALIDATION BLOCK START -------- */
            if (__editedJsonContent.content === undefined) {
                /* Inform the shell that init is complete */
                if (callback) {
                    callback();
                }
                //TODO - In future more advanced schema validations could be done here    
                return; /* -- EXITING --*/
            }

            // Process JSON to remove interaction tags and initiate __interactionIds and __interactionTags Arrays
            //__parseAndUpdateJSONForInteractions();
            __parseAndUpdateJSONForInteractions();
            //Process JSON for easy iteration in template
            //__parseAndUpdateJSONForRivets();
            __parseAndUpdateJSONForRivets();
            /* ------ VALIDATION BLOCK END -------- */

            /* Apply the layout HTML to the dom */
            $(elRoot).html(__constants.TEMPLATES[htmlLayout]);

            /* Initialize RIVET. */
            __initRivets();

            /* ---------------------- SETUP EVENTHANDLER STARTS----------------------------*/
            //On CLICK of Radio buttons    
            $(document).on('change', '.editor .checkbox input:checkbox', __handleCheckboxButtonClick);
            $(document).on('change', '.editor .radio input:radio', __handleRadioButtonClick);
            //Drag of list items (re-ordering)
            __bindSortable();
            /* ---------------------- SETUP EVENTHANDLER ENDS------------------------------*/

            /* Inform the shell that init is complete */
            if (callback) {
                callback();
            }

        } /* init() Ends. */

        /* ---------------------- ENGINE-SHELL Interface ---------------------------------*/
        /**
         * Return configuration
         */
        function getConfig() {
            return __config;
        }

        /**
         * ENGINE-SHELL Interface
         *
         * Return the current state (Activity Submitted/ Partial Save State.) of activity.
         */
        function getStatus() {
            return __state.hasUnsavedChanges;
        }

        /**
         * ENGINE-SHELL Interface
         *
         * Return the current state (Activity Submitted/ Partial Save State.) of activity.
         */
        function saveItemInEditor() {
            activityAdaptor.submitEditChanges(__transformJSONtoOriginialForm(), uniqueId);
        }

        /* ---------------------- ENGINE-SHELL Interface ends ---------------------------------*/


        /* ---------------------- JSON PROCESSING FUNCTIONS START ---------------------------------*/

        /***
         * This function does following
         * 1. Creates two arrays required for rendering this editor
         *      1.1 __interactionIds (InteractionIds array) - This contains all the interaction ids (in questiondata)
         *           e.g. ["i1", "i2"]
         *      1.2 __interactionTags (Array of Original interaction texts in questiondata) - 
         *          This will be used for recreating JSON to original format when "saveItemInEditor" is called.  
         *          e.g. [
         *             "<a href='http://www.comprodls.com/m1.0/interaction/mcq'>i1</a>", 
         *             "<a href='http://www.comprodls.com/m1.0/interaction/mcq'>i2</a>"
         *              ]   
         * 2. Replace the interactionTags in questiondata (__editedJsonContent Object) with BLANKs 
         **/
        function __parseAndUpdateJSONForInteractions() {
            var newArray = [];
            var newObj = {};
            var interactionTag;
            for (var i = 0; i < __editedJsonContent.content.canvas.data.questiondata.length; i++) {
                __parsedQuestionArray = $.parseHTML(__editedJsonContent.content.canvas.data.questiondata[i].text);
                var interactionReferenceString = "http://www.comprodls.com/m1.0/interaction/mcq";
                $.each(__parsedQuestionArray, function (index, el) {
                    if (this.href === interactionReferenceString) {
                        __interactionIds.push(this.childNodes[0].nodeValue.trim())
                        interactionTag = this.outerHTML;
                        interactionTag = interactionTag.replace(/"/g, "'");
                        __interactionTags.push(interactionTag);
                        __editedJsonContent.content.canvas.data.questiondata[i].text = __editedJsonContent.content.canvas.data.questiondata[i].text.replace(interactionTag, '');
                    }
                });
            }

            for (var key in __editedJsonContent.content.interactions) {
                newObj = __editedJsonContent.content.interactions[key];
                newObj.key = key;
                newArray.push(newObj);
            }
            __editedJsonContent.content.interactions = newArray;
        }

        /***
         * Function to modify question JSON for easy iteration in template
         * 
         * Original JSON Object
         * ---------------------
         * 
         * "MCQSR": [
              {
                "choiceA": "She has the flu." 
              },
              {
                "choiceB": "She has the measles."
              }  
            ]
            Modified JSON Object
            ----------------------
            "MCQSR": [
              {
                  " " : {
                        "key" : "choiceA",
                        "value" : "She has the flu.",
                        "isEdited" : false,
                        "index" : 0
                        "isCorrect" : false
                  } 
              },
               {
                  "customAttribs" : {
                        "key" : "choiceB",
                        "value" : "She has the measles.",
                        "isEdited" : false,
                        "index" : 1
                        "isCorrect" : true
                  } 
              }  
            ]
         */
        function __parseAndUpdateJSONForRivets() {
            __editedJsonContent.MCQMR = false;
            __editedJsonContent.MCQSR = false;
            for (var i = 0; i < __interactionIds.length; i++) {
                var processedArray = [];
                var interaction = __editedJsonContent.content.interactions[i];
                var type = interaction.type;
                __editedJsonContent[type] = true;
                interaction[type].forEach(function (obj, index) {
                    var processedObj = {};
                    processedObj.customAttribs = {};
                    Object.keys(obj).forEach(function (key) {
                        var interactionid = __interactionIds[i];
                        processedObj.customAttribs.key = key;
                        processedObj.customAttribs.value = obj[key];
                        processedObj.customAttribs.isEdited = false;
                        processedObj.customAttribs.index = index;
                        processedObj.customAttribs.id = interactionid;

                        if (typeof __editedJsonContent.feedback[interactionid] != 'undefined') {
                            if (typeof __editedJsonContent.feedback[interactionid][key] != 'undefined') {
                                processedObj.customAttribs.feedback = __editedJsonContent.feedback[interactionid][key];
                            }
                        }
                    });

                    if (__editedJsonContent.responses[__interactionIds[i]].correct.indexOf(processedObj.customAttribs.key) > -1) {
                        processedObj.customAttribs.isCorrect = true;
                    }
                    else {
                        processedObj.customAttribs.isCorrect = false;
                    }
                    processedArray.push(processedObj);
                });
                __editedJsonContent.content.interactions[i][type] = processedArray;
            }
        }



        /*------------------------RIVET INITIALIZATION & BINDINGS -------------------------------*/
        function __initRivets() {
            /*
             * Formatters for rivets
             */

            /* Appends cutom arguments to function calls*/
            rivets.formatters.args = function (fn) {
                var args = Array.prototype.slice.call(arguments, 1);
                return function () {
                    return fn.apply(this, Array.prototype.concat.call(arguments, args))
                }
            }

            rivets.formatters.appendindex = function (obj, index) {
                var array = [];
                array.push(obj[index])
                return array;
            };


            // Rivets formatter function to set placeholder text
            rivets.formatters.placeholderText = function (obj) {
                var text = "Enter inline feedback for option ";
                text = text.concat(obj);
                return text;
            };

            // Rivets formatter function to dynamically generate Modal Window ids based on the option.
            rivets.formatters.modalId = function (obj) {
                var text = "modal";
                obj = obj.replace(/[\. ,:-]+/g, '');
                text = text.concat(obj);
                return text;
            };

            rivets.formatters.btnId = function (obj) {
                var text = "btn";
                obj = obj.replace(/[\. ,:-]+/g, '');
                text = text.concat(obj);
                return text;
            };


            /* 
              * Bind data to template using rivets
              */
            rivets.bind($('#mcq-editor'), {
                meta: __editedJsonContent.meta,
                content: __editedJsonContent.content,
                toggleQuestionTextEditing: __toggleQuestionTextEditing,
                quesEdited: __quesEdited,
                removeItem: __removeItem,
                addItem: __addItem,
                removeEditing: __removeEditing,
                interactionIds: __interactionIds,
                feedback: __editedJsonContent.feedback,
                setInlineFeedback: __setInlineFeedback,
                addInlineFeedback: __addInlineFeedback,
                editOptionText: __editOptionText,
                handleItemChanged: __handleItemChangedInEditor,
                mcqmr: __editedJsonContent.MCQMR,
                mcqsr: __editedJsonContent.MCQSR
            });
        }

        /* Toggle between editing and read-only mode for question text */
        function __toggleQuestionTextEditing(event, element) {
            element.isEditing = !element.isEditing;
            $(event[0].currentTarget).siblings('.question-text-editor').focus();
        }

        /* Remove option item */
        function __removeItem(event, element, interaction) {
            var interactionid = element.customAttribs.id;
            var type = __editedJsonContent.content.interactions[interaction].type;
            __editedJsonContent.content.interactions[interaction][type].splice(element.customAttribs.index, 1);
            for (var option = element.index; option < __editedJsonContent.content.interactions[interaction][type].length; option++) {
                obj.interactions[interaction][type][option].customAttribs.index--;
            }
            __state.hasUnsavedChanges = true;
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }

        /* Sets the edit mode on the option text. Allows the Author to edit the text  */
        function __editOptionText(event, element) {
            element.customAttribs.isEdited = !element.customAttribs.isEdited;
            $(event[0].currentTarget).parent().find('.option-value')[0].focus();
            event[0].preventDefault();
        }


        /* Remove edit mode on blur*/
        function __removeEditing(event, element) {
            if (element.customAttribs) {
                element.customAttribs.isEdited = false;
            } else {
                element.isEditing = false;
            }
            __state.hasUnsavedChanges = true;
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }

        /* Add new option for the question */
        function __addItem(event, content, interaction) {
            var type = content.interactions[interaction]['type'];
            var newObj = {};
            newObj.customAttribs = {};
            newObj.customAttribs.key = __guid();
            newObj.customAttribs.value = "";
            newObj.customAttribs.isEdited = true;
            newObj.customAttribs.index = content.interactions[interaction][type].length;
            content.interactions[interaction][type].push(newObj);
            __state.hasUnsavedChanges = true;
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }
        /*------------------------RIVETS END-------------------------------*/

        /* ---------------------- JQUERY BINDINGS ---------------------------------*/
        /* Handling when options are sorted.
         * When dargging is stopped, get the previous and new index for dragged element.
         * Now instead of sortable, use these indexes to restructure array.
         * when the array would be updated, the rivets will detect the change and re-render
         * updated data in the template.
         */
        function __bindSortable() {
            $(".sortable").sortable({
                handle: ".drag-icon",
                axis: 'y',
                containment: '.main-container',
                stop: function (event, ui) {
                    var prevIndex = $(ui.item[0]).attr('elementIndex');
                    var currentIndex;
                    var interaction;
                    var interactIndex;
                    var interactiontype;
                    /* Find the previous and current index of dragged element*/
                    $(ui.item[0]).parent('.sortable').children('li').each(function (index) {
                        if ($(this).attr('elementIndex') == prevIndex) {
                            currentIndex = index;
                            interactIndex = parseInt($(this).attr('interactIndex'));
                            return false;
                        }
                    });

                    prevIndex = parseInt(prevIndex);
                    /* Cancel sorting using library*/
                    $(".sortable").sortable("cancel");

                    var type = __editedJsonContent.content.interactions[interactIndex].type;
                    /* Instead do the sorting manually*/
                    var removedItem = __editedJsonContent.content.interactions[interactIndex][type].splice(prevIndex, 1);
                    __editedJsonContent.content.interactions[interactIndex][type].splice(currentIndex, 0, removedItem[0]);

                    /* Update index property of customAttribs for each element*/
                    $.each(__editedJsonContent.content.interactions[interactIndex][type], function (index, value) {
                        __editedJsonContent.content.interactions[interactIndex][type][index].customAttribs.index = index;
                    });

                    __state.hasUnsavedChanges = true;
                    activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
                }
            });
        }

        /** 
         * handles the click event of the checkbox and sets the isCorrect for the appropriate option
         */
        function __handleCheckboxButtonClick(event) {
            var currentTarget = event.currentTarget;
            var quesIndex = 0;
            var interactionIndex = parseInt($(currentTarget).parent().parent("li").attr('interactIndex'));
            var interactionType = __editedJsonContent.content.interactions[interactionIndex].type;
            var currentChoice = $(currentTarget).attr('key');
            var checked = $(currentTarget).prop("checked");

            if (checked) {
                $(currentTarget).prop('checked', checked);
                $(currentTarget).parent().parent("li").addClass("highlight");
                $(currentTarget).siblings('.correct-answer').show();
            }
            else {
                $(currentTarget).prop('checked', checked);
                $(currentTarget).parent().parent("li").removeClass("highlight");
                $(currentTarget).siblings('.correct-answer').hide();
            }
            __state.hasUnsavedChanges = true;

            /* Update the isCorrect property for each option*/
            __editedJsonContent.content.interactions[interactionIndex][interactionType].forEach(function (obj, index) {
                if (__editedJsonContent.content.interactions[interactionIndex][interactionType][index].customAttribs.key == currentChoice) {

                    if (checked) {
                        __editedJsonContent.content.interactions[interactionIndex][interactionType][index].customAttribs.isCorrect = true;
                        var idx = __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.indexOf(currentChoice);
                        if (idx < 0) {
                            __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.push(currentChoice);
                        }
                    }
                    else {
                        __editedJsonContent.content.interactions[interactionIndex][interactionType][index].customAttribs.isCorrect = false;
                        var idx = __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.indexOf(currentChoice);
                        __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.splice(idx, 1);
                    }
                }
            });
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }


        function __handleRadioButtonClick(event) {
            var currentTarget = event.currentTarget;
            var quesIndex = 0;
            var interactionIndex = parseInt($(currentTarget).parent().parent("li").attr('interactIndex'));
            $("label.radio").parent().removeClass("highlight");
            $(currentTarget).parent().parent("li").addClass("highlight");
            $('.correct-answer').hide();
            $(currentTarget).siblings('.correct-answer').show();
            __state.hasUnsavedChanges = true;
            /* Update the isCorrect property for each option*/
            __editedJsonContent.content.interactions[interactionIndex].MCQSR.forEach(function (obj, index) {
                if (__editedJsonContent.content.interactions[interactionIndex].MCQSR[index].customAttribs.key == $(currentTarget).attr('key')) {
                    __editedJsonContent.content.interactions[interactionIndex].MCQSR[index].customAttribs.isCorrect = true;
                } else {
                    __editedJsonContent.content.interactions[interactionIndex].MCQSR[index].customAttribs.isCorrect = false;
                }
            });
            __editedJsonContent.responses[__interactionIds[interactionIndex]].correct = $(currentTarget).attr('key');
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }



        function __handleItemChangedInEditor() {
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }

        /* Transform the processedJSON to originally received form so that the platform
         * can use it to repaint the updated json.
         */
        function __transformJSONtoOriginialForm() {
            __finalJSONContent = jQuery.extend(true, {}, __editedJsonContent);
            //var newObj = {};
            var optionsArr = [];
            var interactions = __finalJSONContent.content.interactions;

            interactions.forEach(function (interaction, inx) {
                var type = interaction.type;
                var optionsArray = interaction[type];
                var interactionid = interaction.key;
                optionsArray.forEach(function (each, idx) {
                    var newObj = {};
                    var key = each.customAttribs.key;
                    var val = each.customAttribs.value;
                    newObj[key] = val;
                    optionsArr.push(newObj);
                    delete optionsArray[idx];
                });
                __finalJSONContent.content.interactions = {};
                __finalJSONContent.content.interactions[interactionid] = {};
                __finalJSONContent.content.interactions[interactionid]['type'] = type;
                __finalJSONContent.content.interactions[interactionid][type] = optionsArr;
            })

            for (var i = 0; i < __finalJSONContent.content.canvas.data.questiondata.length; i++) {
                __finalJSONContent.content.canvas.data.questiondata[i].text += __interactionTags[i];
            }

            __finalJSONContent.content.instructions.forEach(function (each, idx) {
                if (each.text && each.tag === '') {
                    __finalJSONContent.content.instructions[idx]['tag'] = 'text';
                }
            })

            // console.log(JSON.stringify(__finalJSONContent, null, 4));
            return __finalJSONContent;
        }

        /* ---------------------- JQUERY BINDINGS END ----------------------------*/

        /* Generate unique ids for newly added options*/
        function __guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        /** Opens the window for the inline feedback */
        function __addInlineFeedback(option) {
            var event = option[0];
            var attribs = option[1].element.customAttribs;
            var option = attribs["key"];
            var optionValue = attribs["value"];
            option = option.replace(/[\. ,:-]+/g, '');
            var btn = "#btn" + option;
            var modal = "#modal" + option;
            $(modal).modal('show');
            // prevents the default action when the row is clicked.
            event.preventDefault();
        }

        /** Updated the entered inline feedback in the JSON  */
        function __setInlineFeedback(option) {
            var interactionid = option[1]['element']['customAttribs'].id;
            var choice = option[1]['element']['customAttribs'].key;
            var feedbacktxt = option[1]['element']['customAttribs'].feedback;

            var feedbackObj = {};
            feedbackObj[choice] = feedbacktxt;
            var interactionfeedback = __editedJsonContent.feedback[interactionid];
            // update feedback JSON
            if (typeof interactionfeedback == 'undefined') {
                __editedJsonContent.feedback[interactionid] = {};
                __editedJsonContent.feedback[interactionid] = feedbackObj;
            }
            else {
                __editedJsonContent.feedback[interactionid][choice] = feedbacktxt;
            }
            __handleItemChangedInEditor();
        }

        $(document).on('click', "a.drag-icon", function () {
            event.preventDefault();
        });

        $(document).ready(function () {
            //Handles menu drop down
            $('.dropdown-menu').click(function (e) {
                e.stopPropagation();
            });
            //$('[data-toggle="tooltip"]').tooltip();

            $('#qtypeinfoico').popover(qtypecontent);
            $('#instinfoico').popover(intructcontent);
            $('#qtextinfoico').popover(qtextcontent);
            $('#ansinfoico').popover(answercontent);
            $('#scoreinfoico').popover(scorecontent);
            $('#fbackinfoico').popover(fbackcontent);
            $('#mediainfoico').popover(mediacontent);

            /***** Dismiss all popovers by clicking outside, don't dismiss if clicking inside the popover content  **************/

            $('html').on('click', function (e) {
                if (typeof $(e.target).data('original-title') == 'undefined' &&
                    !$(e.target).parents().is('.popover.in')) {
                    $('[data-original-title]').popover('hide');
                }
            });

        });

        /**
         * This section contains the html content for the popovers
         * 
         */

        var qtypecontent = {
            content: '<div class="popmsg"><p>The MCQ Engine supports 2 types of questions:</p><div class="row"><ul><li><strong>MCQSR</strong> - Multiple Choice Question Single Response</li><li><strong>MCQMR</strong> - Multiple Choice Question Multiple Response</li></ul></div></div>',
            html: true,
            placement: 'right'
        }
        var intructcontent = {
            content: '<div class="popmsg"><p><strong>Use the textfield below to enter instructions for this question.</strong></p></div></div>',
            html: true,
            placement: 'right'
        }

        var qtextcontent = {
            content: '<div class="popmsg"><p><strong>Use the textfield below to enter instructions for this question.</strong></p></div></div>',
            html: true,
            placement: 'right'
        }

        var answercontent = {
            content: '<div class="popmsg"><p><strong>Use this section to Add / Edit / Re-order / Remove Choices.</strong></p><ul><li>Click on Answer text to edit/modify the answer.</li><li>Use the buttons on the right to Add inline feedback, reorder the answers or remove and option.</li><li>Use the <strong>Add Choice</strong> button to add a new option.</li><li>Click the Check box on the left to mark an answer correct.</li></ul></div></div>',
            html: true,
            placement: 'right'
        };

        var scorecontent = {
            content: '<div class="popmsg"><p>Use the text fields below to enter minimum and maximum score possible for this question. A number between 0 and 1 is permitted in this field.</p></div>',
            html: true,
            placement: 'right'
        }

        var fbackcontent = {
            content: '<div class="popmsg"><p>Use the text fields below to enter enter global feedback for user response.</p><ul><li><strong>Correct</strong>: The feedback to be given when user answers correctly</li><li><strong>InCorrect</strong>: The feedback to be given when user answer is incorrect</li><li><strong>Empty</strong>: The feedback to be given when user does not answer the question</li></ul></div>',
            html: true,
            placement: 'right'
        }

        var mediacontent = {
            content: '<div class="popmsg"><p>Allows the author to upload media elements like images, videos related to this question. <i>Note: This feature is currently not supported.</i></p></div>',
            html: true,
            placement: 'right'
        }
        /** End popover html section  */
        return {
            /*Engine-Shell Interface*/
            "init": init, /* Shell requests the engine intialized and render itself. */
            "getStatus": getStatus, /* Shell requests a gradebook status from engine, based on its current state. */
            "getConfig": getConfig, /* Shell requests a engines config settings.  */
            "saveItemInEditor": saveItemInEditor
        };
    };
});