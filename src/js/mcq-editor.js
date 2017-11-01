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
    'css!../../bower_components/fine-uploader/dist/fine-uploader-gallery.min.css',
    'css!../css/mcq-editor.css', //Custom CSS of the Editor
    'jquery-ui', //Jquery Sortable for reordering
    'css!../../bower_components/jquery-ui/themes/base/jquery-ui.css', //CSS for sortable
    'rivets',   // Rivets for two way data binding
    'sightglass', // Required by Rivets   
    'fine-uploader',
   
], function (mcqTemplateRef,A,qqcss,C,D,E,F,qq) {
   
    //console.log(new qq.s3.FineUploader());
    //console.log("Test what to rtest");
    mcqEditor = function () {
        "use strict";
        /*
         * Reference to platform's activity adaptor (initialized during init() ).
         */
        var activityAdaptor;

        /** 
         * media manager
        */
        var mediaManager;
        /*
         * Internal Engine Config.
         */
        var __config = {
            RESIZE_MODE: "auto", /* Possible values - "manual"/"auto". Default value is "auto". */
            RESIZE_HEIGHT: "580" /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will override. */
            /* If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
        };

        var __icon = {
            correct: "thumbs-o-up",
            incorrect: "thumbs-o-down",
            generic: "hand-o-right"
        };
        /**
         * Internal Media values. 
         */
        var __media = {
           "url":  "comprodlscontentprocessor.s3.amazonaws.com",
           "bucket":"",
           "accessKey": "AKIAJ7M7GQKI4M3BL35Q",
           "folder":"testdata/mcq/",
           "key":"",
           "signature-endpoint":"http://sachin:3000/s3/signtureHandler"
        };
        var __finalizeMediaObj = [];



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
        var __feedbackEditing = {};
        __feedbackEditing = {
            correct: false,
            incorrect: false
        }

        var __enableFeedback = {hide : false};

        /** */
        var __feedbackPresets = [{key:"correct", value:"Show when Correct", showDropdown : true, order: 1 },
                                 {key:"incorrect", value:"Show when Incorrect", showDropdown : true, order: 2},
                                 {key:"generic", value:"Show Always", showDropdown : true, order : 100}];
                           

        var sendItemChangeNotification = false;
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
            console.log("params");
            console.log(JSON.stringify(params, null, 4));
            console.log("params.mediaManager");
            console.log(JSON.stringify(params.mediaManager, null, 4));
            mediaManager = params.mediaManager;
           /*
            console.log("params.mediaManager");
            params.mediaManager = {'getUploadsFolder' : function(){
                                                        return __media;
                                                      }
                                  };                    
           
            */
            
            // Process JSON to remove interaction tags and initiate __interactionIds and __interactionTags Arrays
            __parseAndUpdateJSONForInteractions();

            //Process JSON for easy iteration in template
            __parseAndUpdateJSONForRivets();
            /* ------ VALIDATION BLOCK END -------- */

            /* Apply the layout HTML to the dom */
            $(elRoot).html(__constants.TEMPLATES[htmlLayout]);

            /* Initialize RIVET. */
            __initRivets();

            /* ---------------------- SETUP EVENTHANDLER STARTS----------------------------*/
            //On CLICK of Check boxes    
            $(document).on('click', '.editor label.checkbox', __handleCheckboxButtonClick);
            //On CLICK of Radio buttons    
            $(document).on('click', '.editor label.radio', __handleRadioButtonClick);
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

        /*
        This function creates content for the editor from the base JSON data recieved
        */
        function __parseAndUpdateJSONForRivets() {
            __editedJsonContent.MCQMR = false;
            __editedJsonContent.MCQSR = false;
            __editedJsonContent.isInstructionEmpty = true;
            __editedJsonContent.enableFeedBack = false;

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

                    if (type === 'MCQSR') {
                        var responseObj = __editedJsonContent.responses[__interactionIds[i]].correct;
                        var len = Object.keys(responseObj).length

                        if (len > 0 && __editedJsonContent.responses[__interactionIds[i]].correct.indexOf(processedObj.customAttribs.key) > -1) {
                            processedObj.customAttribs.isCorrect = true;
                        }
                        else {
                            processedObj.customAttribs.isCorrect = false;
                        }
                    }

                    if (type === 'MCQMR') {
                        var responseObj = __editedJsonContent.responses[__interactionIds[i]].correct;
                        if (responseObj.length > 0 && __editedJsonContent.responses[__interactionIds[i]].correct.indexOf(processedObj.customAttribs.key) > -1) {
                            processedObj.customAttribs.isCorrect = true;
                        }
                        else {
                            processedObj.customAttribs.isCorrect = false;
                        }
                    }
                    processedArray.push(processedObj);
                });
                __editedJsonContent.content.interactions[i]['answeroptions'] = processedArray;
                __editedJsonContent.content.interactions[i].editlink = {
                    "enabled": processedArray.length >= 2,
                    "disabled": processedArray.length < 2
                };
            }
            __parseQuestionTextJSONForRivets();
            __parseInstructionTextJSONForRivets();
            __parseGlobalFeedbackJSONForRivets();
            __parseMediaJSONForRivets();
        }

        function __parseGlobalFeedbackJSONForRivets() {
            if (__editedJsonContent.feedback.global == undefined) {
                __editedJsonContent.feedback.global = [];
                return;
            }
            var tempObj = __editedJsonContent.feedback.global;
            var tempArr = [];
            if (tempObj && Object.keys(tempObj).length > 0) {
                Object.keys(tempObj).forEach(function (key, index) {
                    var processedObj = {};
                    processedObj.customAttribs = {};
                    processedObj.customAttribs.key = key;
                    processedObj.customAttribs.value = tempObj[key];
                    processedObj.customAttribs.index = index;
                    if (key !== 'correct' || key !== 'incorrect') {
                        processedObj.customAttribs.order = 100;
                        processedObj.customAttribs.icon = __icon['generic'];
                    }
                    if(key == 'correct'){
                        processedObj.customAttribs.order = 1;
                        __feedbackPresets[0].showDropdown = false;
                    }
                    if(key == 'incorrect'){
                        processedObj.customAttribs.order = 2;
                        __feedbackPresets[1].showDropdown = false;
                    }
                    processedObj.customAttribs.icon = __icon[key];
                    tempArr.push(processedObj);                
                });
                   tempArr.sort(function(a, b){ return a.customAttribs.order - b.customAttribs.order});
                __editedJsonContent.feedback.global = tempArr;
                __editedJsonContent.enableFeedBack = true;
            }
        }

        function __parseQuestionTextJSONForRivets() {
            __editedJsonContent.content.canvas.data.questiondata.forEach(function (element) {
                if (element.text == '') {
                    element.text = 'Placeholder Question text. Update "Me" with a valid Question text';
                }
                element.customAttribs = {};
                element.customAttribs.isEdited = false;
            })
        }

        function __parseInstructionTextJSONForRivets() {
            __editedJsonContent.content.instructions.forEach(function (element) {
                if (element.text == '' || element.tag == '') {
                    element.text = 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question'
                }
                element.customAttribs = {};
                element.customAttribs.isEdited = false;
            })

            if (__editedJsonContent.content.instructions.length > 0) {
                __editedJsonContent.isInstructionEmpty = false;
            } else {
                __editedJsonContent.isInstructionEmpty = true;
            }
        }

        function __parseMediaJSONForRivets() {
            if(__editedJsonContent.content.stimulus.length === 0) {
                __editedJsonContent.enableMedia = true; 
            } else {
                __editedJsonContent.enableMedia = false; 
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

            rivets.formatters.idcreator = function (key, idvalue) {
                return idvalue + key;
            }

            rivets.formatters.btnId = function (obj) {
                var text = "btn";
                obj = obj.replace(/[\. ,:-]+/g, '');
                text = text.concat(obj);
                return text;
            };

            rivets.formatters.interactTypeVal = function (key) {
                var types = {
                    'MCQMR': "Multiple Choice Question",
                    'MCQSR': "Single Choice Question"
                };
                return types[key];
            };

            rivets.binders['content-editable'] = {
                bind: function (el) {
                    var that = this;
                    el.setAttribute("contenteditable", true);
                    this.callback = function (e) {
                        that.publish();
                    };
                    el.addEventListener("blur", this.callback);
                },
                unbind: function (el) {
                    el.removeEventListener("blur", this.callback);
                },
                getValue: function (el) {
                    return el.innerText;
                },
                routine: function (el, value) {
                    if (sendItemChangeNotification) {
                        activityAdaptor.autoResizeActivityIframe();
                        __handleItemChangedInEditor();
                    }
                    el.innerHTML = value;
                }
            };

            rivets.binders.addclass = function (el, value) {
                if (el.addedClass) {
                    $(el).removeClass(el.addedClass)
                    delete el.addedClass
                }

                if (value) {
                    $(el).addClass(value)
                    el.addedClass = value
                }
            }

            /* 
              * Bind data to template using rivets
              */
            rivets.bind($('#mcq-editor'), {
                editorContent: __editedJsonContent,
                removeItem: __removeItem,
                addItem: __addItem,
                interactionIds: __interactionIds,
                feedback: __editedJsonContent.feedback,
                removeInstruction: __removeInstruction,
                addInstruction: __addInstruction,
                handleItemChanged: __handleItemChangedInEditor,
                isInstructionEmpty: __editedJsonContent.isInstructionEmpty,
                changeQuestionType: __changeQuestionType,
                showFeedBack: __showFeedBack,
                removeFeedback: __removeFeedback,
                addFeedback: __addFeedback,
                feedbackPresets: __feedbackPresets,
                enableFeedback: __enableFeedback
            });
        }


        /* Handles the Question type drop down change event */
        function __changeQuestionType(event, selectedType, interaction) {
            if (selectedType === interaction.type) {
                return;
            } else {
                var key = interaction.key;
                __editedJsonContent[interaction.type] = false;
                __editedJsonContent[selectedType] = true;

                if (selectedType == 'MCQMR') {
                    __editedJsonContent.responses[key].correct = [];
                } else {
                    __editedJsonContent.responses[key].correct = {};
                }
                __editedJsonContent.content.interactions.forEach(function (element) {
                    if (element.key === key) {
                        element.type = selectedType;
                        element["answeroptions"].forEach(function (option) {
                            option.customAttribs.isCorrect = false;
                            option.customAttribs.isEdited = false;
                        })
                    }
                })
            }
            $('#answer-choice .dropdown .dropdown-toggle').dropdown('toggle');
            __bindSortable();
            activityAdaptor.autoResizeActivityIframe();
            __handleItemChangedInEditor();
        }

        /* Handles the Add new option button click */
        function __addItem(event, interaction) {
            var newObj = {};
            newObj.customAttribs = {};
            newObj.customAttribs.key = __guid();
            newObj.customAttribs.value = "";
            newObj.customAttribs.isEdited = true;
            newObj.customAttribs.index = __editedJsonContent.content.interactions[interaction]["answeroptions"].length;
            __editedJsonContent.content.interactions[interaction]["answeroptions"].push(newObj);

            // This updates the editor model data to enable option delete and drag when
            // the options length is greater than 1
            if (__editedJsonContent.content.interactions[interaction]["answeroptions"].length > 1) {
                __editedJsonContent.content.interactions[interaction].editlink.enabled = true;
                __editedJsonContent.content.interactions[interaction].editlink.disabled = false;
            }
            __state.hasUnsavedChanges = true;
            activityAdaptor.autoResizeActivityIframe();
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }

        /* Handles the option remove event from the editor */
        function __removeItem(event, element, interaction) {
            var interactionid = element.customAttribs.id;
            var type = __editedJsonContent.content.interactions[interaction].type;
            var inputAttribId = element.customAttribs.key;

            if (__editedJsonContent.content.interactions[interaction]["answeroptions"].length > 1) {
                // Delete the select option attribs based on the current position in the array
                __editedJsonContent.content.interactions[interaction]["answeroptions"].forEach(function (attrib, idx) {
                    if (inputAttribId === attrib.customAttribs.key) {
                        __editedJsonContent.content.interactions[interaction]["answeroptions"].splice(idx, 1);
                    }
                });

                __editedJsonContent.content.interactions[interaction]["answeroptions"].forEach(function (el, idx) {
                    __editedJsonContent.content.interactions[interaction]["answeroptions"][idx].customAttribs.index = idx;
                })

                __state.hasUnsavedChanges = true;
                activityAdaptor.autoResizeActivityIframe();
                activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
            }
            // This updates the editor data model to disable options delete and drag
            // when the answeroptions length is less than 2
            if (__editedJsonContent.content.interactions[interaction]["answeroptions"].length <= 1) {
                __editedJsonContent.content.interactions[interaction].editlink.enabled = false;
                __editedJsonContent.content.interactions[interaction].editlink.disabled = true;
            }
        }

        /** Handles the add Instruction button click from the editor */
        function __addInstruction() {
            __editedJsonContent.content.instructions.push({
                "tag": "text",
                "text": 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question',
                "customAttribs": {
                    "isEdited": false
                }
            });
            __editedJsonContent.isInstructionEmpty = false;
            $('#instructionLabel').show();
            activityAdaptor.autoResizeActivityIframe();
        }

        /* Handles the remove Instruction item text from the editor */
        function __removeInstruction(event, instruction, index) {
            __editedJsonContent.content.instructions.splice(index, 1);

            if (__editedJsonContent.content.instructions.length > 0) {
                __editedJsonContent.isInstructionEmpty = false;
                $('#instructionLabel').show();
            }
            else {
                __editedJsonContent.isInstructionEmpty = true;
                $('#instructionLabel').hide();
            }

            __state.hasUnsavedChanges = true;
            activityAdaptor.autoResizeActivityIframe();
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
                    var removedItem = __editedJsonContent.content.interactions[interactIndex]["answeroptions"].splice(prevIndex, 1);
                    __editedJsonContent.content.interactions[interactIndex]["answeroptions"].splice(currentIndex, 0, removedItem[0]);

                    /* Update index property of customAttribs for each element*/
                    $.each(__editedJsonContent.content.interactions[interactIndex]["answeroptions"], function (index, value) {
                        __editedJsonContent.content.interactions[interactIndex]["answeroptions"][index].customAttribs.index = index;
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
            var interactionIndex = parseInt($(currentTarget).closest("li").attr('interactIndex'));
            var interactionType = __editedJsonContent.content.interactions[interactionIndex].type;
            var currentChoice = $(currentTarget).attr('key');
            var checkedLabel = $(currentTarget).attr("checked");
            var currentChoice = $(currentTarget).siblings('input').attr('key');
            var checked = $(currentTarget).siblings('input').prop('checked');
            // var checked = $("input[type=checkbox][key=" + currentChoice + "]").prop("checked");

            __state.hasUnsavedChanges = true;

            /* Update the isCorrect property for each option*/
            __editedJsonContent.content.interactions[interactionIndex]["answeroptions"].forEach(function (obj, index) {
                if (__editedJsonContent.content.interactions[interactionIndex]["answeroptions"][index].customAttribs.key == currentChoice) {

                    if (checked) {
                        var idx = __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.indexOf(currentChoice);
                        __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.splice(idx, 1);
                    }
                    else {
                        var idx = __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.indexOf(currentChoice);
                        if (idx < 0) {
                            __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.push(currentChoice);
                        }
                    }
                }
            });
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }

        /** 
        * handles the click event of the radio button and sets the isCorrect for the appropriate option
        */
        function __handleRadioButtonClick(event) {
            var currentTarget = event.currentTarget;
            var quesIndex = 0;
            var interactionIndex = parseInt($(currentTarget).parent().parent("li").attr('interactIndex'));
            $("label.radio").parent('li').removeClass("highlight");
            $(currentTarget).closest("li").addClass("highlight");
            __state.hasUnsavedChanges = true;
            /* Update the isCorrect property for each option*/
            __editedJsonContent.content.interactions[interactionIndex]["answeroptions"].forEach(function (obj, index) {
                if (__editedJsonContent.content.interactions[interactionIndex]["answeroptions"][index].customAttribs.key == $(currentTarget).siblings('input').attr('key')) {
                    __editedJsonContent.content.interactions[interactionIndex]["answeroptions"][index].customAttribs.isCorrect = true;
                } else {
                    __editedJsonContent.content.interactions[interactionIndex]["answeroptions"][index].customAttribs.isCorrect = false;
                }
            });
            __editedJsonContent.responses[__interactionIds[interactionIndex]].correct = $(currentTarget).siblings('input').attr('key');
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
                var optionsArray = interaction["answeroptions"];
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

            /** Added for global feedback transformation */
            var globalFeedback = __finalJSONContent.feedback.global;
            if (globalFeedback && globalFeedback.length > 0) {
                var tempObj = {};
                globalFeedback.forEach(function (obj) {
                    if (obj.customAttribs.value && obj.customAttribs.value != '') {
                        tempObj[obj.customAttribs.key] = obj.customAttribs.value;
                    }
                })
                __finalJSONContent.feedback.global = tempObj;
            }

            for (var i = 0; i < __finalJSONContent.content.canvas.data.questiondata.length; i++) {
                __finalJSONContent.content.canvas.data.questiondata[i].text += __interactionTags[i];
            }

            __finalJSONContent.content.instructions.forEach(function (each, idx) {
                if (each.text && each.tag === '') {
                    __finalJSONContent.content.instructions[idx]['tag'] = 'text';
                }
            })
            return __finalJSONContent;
        }

        function __showFeedBack(event) {
            __editedJsonContent.feedback.global = [];
            __editedJsonContent.feedback.global.push(
                {
                    "customAttribs": {
                        "key": "correct",
                        "value": "",
                        "index": 0,
                        "icon": __icon["correct"],
                        "order" : 1
                    }
                },
                {
                    "customAttribs": {
                        "key": "incorrect",
                        "value": "",
                        "index": 1,
                        "icon": __icon["incorrect"],
                        "order": 2
                    }
                });
            __editedJsonContent.enableFeedBack = true;
            __feedbackPresets[0].showDropdown = false;
            __feedbackPresets[1].showDropdown = false;
            __feedbackPresets[2].showDropdown = true;
        }


        function __removeFeedback(event, index) {
            
            if(__editedJsonContent.feedback.global[index].customAttribs.key == 'correct'){
                __feedbackPresets[0].showDropdown = true;
            } else if(__editedJsonContent.feedback.global[index].customAttribs.key == 'incorrect'){
                __feedbackPresets[1].showDropdown = true;
            } else {
                __feedbackPresets[2].showDropdown = true;
            }
            __editedJsonContent.feedback.global.splice(index, 1);

            __editedJsonContent.feedback.global.sort(function(a, b){a.customAttribs.order - b.customAttribs.order});
            if (__editedJsonContent.feedback.global.length == 0) {
                __editedJsonContent.enableFeedBack = false;
            }
            __enableFeedback.hide = false;
            __state.hasUnsavedChanges = true;
            activityAdaptor.autoResizeActivityIframe();
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }

        function __addFeedback(event, element, index){
            //delete from preset
          
            __editedJsonContent.feedback.global.push({
                                                        "customAttribs":{ 
                                                            "key": element.key== 'generic'? __guid() : element.key ,
                                                            "value": "",
                                                            "index": element.order,
                                                            "icon": __icon[element.key],
                                                            "order" : element.order
                                                    }
                                                });
            __editedJsonContent.feedback.global.sort(function(a, b){a.customAttribs.order - b.customAttribs.order});
                    
            __feedbackPresets[index].showDropdown = false;
           __enableFeedback.hide = !__feedbackPresets.some(function(element){
                return element.showDropdown;                    
           })
          activityAdaptor.autoResizeActivityIframe();
          activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
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

        $(document).on('click', "a.drag-icon", function () {
            event.preventDefault();
        });
           
        function intializeUpload(){
            console.log("upload function called");
            var uploader = new qq.s3.FineUploader({
                element: document.getElementById("uploader"),
                request: {
                       endpoint: __media.url,
                       accessKey: __media.accessKey
                },
                signature: {
                      endpoint: __media["signature-endpoint"]
                },
                objectProperties: {
                    key: function (fileId) { 
                        var filename = this.getName(fileId);
                        var uuid = this.getUuid(fileId);
                        var ext = filename.substr(filename.lastIndexOf('.') + 1);                                 
                       return  __media.folder + uuid + '.' + ext;
                    },
                },
                callbacks: {
                    onComplete: function(id, name, response) {                        
                        console.log(id);
                        console.log(name);
                        var serverPathToFile = response.filePath,
                            fileItem = this.getItemByFileId(id);
                            console.log(fileItem);
                            console.log(JSON.stringify(response, null, 4));
                        /*if (response.success) {
                            var viewBtn = qq(fileItem).getByClass("view-btn")[0];
            
                            viewBtn.setAttribute("href", serverPathToFile);
                            qq(viewBtn).removeClass("hide");
                        }
                        */
                    }
                }
            });
        }

        $(document).ready(function () {
            //Handles menu drop down
            if(mediaManager.getUploadsFolder) {
                for (var key in mediaManager){
                   if(mediaManager.hasOwnProperty(key) 
                      && key === 'getUploadsFolder' 
                      && typeof mediaManager[key] == 'function'){
                       console.log("setting media dynamically"); 
                     //  console.log("key: ", key," ", typeof params.mediaManager[key]);  
                    //   console.log("key: ", params.mediaManager.key); 
                       __media = mediaManager[key]().then(function(data) {
                           __media = data;
                           intializeUpload();
                       });
                       console.log("starts: ", JSON.stringify(__media, null, 4) , " ends");
                       console.log("setting media dynamically ends");
                   }
               }
           } else {
               intializeUpload();
           }
            console.log("Test media object");
            console.log(JSON.stringify(__media, null, 4));
            $("#instructionmenu a.dropdown-toggle").click(function () {
                $("#menu1").dropdown("toggle");
            });

            $("a.dropdown-toggle").click(function () {
                $("#menu2").dropdown("toggle");
            });

            $(window).on('resize', function () {
                activityAdaptor.autoResizeActivityIframe();
            });
            sendItemChangeNotification = true;
        });

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