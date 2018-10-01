/* global $ */
var activityAdaptor;
var __state = {
    'hasUnsavedChanges': false
};
var sendItemChangeNotification = false;
var __enableFeedback = { hide: false };
let __editedJsonContent;
let mcqTemplateRef = require('../../html/mcqEditor.html');
let __mediaManager = null;
let __mediaConfig = [];
let __assets = {
                items: [ ]
                };
let __imageSelected = {
        stimulus: [],
        isImageSelected: false
    };
let __assetBasePath = null;

require('jquery');
require('jquery-ui-dist');
require('vendor');
require('../../scss/mcq-editor.scss');
/* let mediaConfiguration = null;

mediaConfiguration = {
'mediaConfig': {
      'upload': {
        'location': 's3',
        'S3': {
          'url': 's3.amazonaws.com',
          'bucket': 's3bucket name',
          'accessKey': 'S3 public access Key',
          'folder': '/some-folder',
          'fileuploader-signature-endpoint': 'URL for generating signature',
          'policy': '',
          'signature': ''
        }
      },
      'assetLibrary': {
        'enabled': true
      },
      'contentful': {
        'enabled': true
      }
    }
  };*/
import rivets from 'rivets';
import jQuery from 'jquery';

const interactionReferenceString = 'http://www.comprodls.com/m1.0/interaction/mcq';

export const __constants = {
    /* CONSTANT for HTML selectors - defined in the layout */
    DOM_SEL_ACTIVITY_BODY: '.activity-body',

    /* CONSTANT for identifier in which Adaptor Instance will be stored */
    ADAPTOR_INSTANCE_IDENTIFIER: 'data-objectid',

    TEMPLATES: {
        /* Regular mcqmr Layout */
        MCQ_EDITOR: mcqTemplateRef
    }
};

const __config = {
    RESIZE_MODE: 'auto', /* Possible values - "manual"/"auto". Default value is "auto". */
    RESIZE_HEIGHT: '580' /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will override. */
};

const __icon = {
    correct: 'thumbs-o-up',
    incorrect: 'thumbs-o-down',
    generic: 'hand-o-right'
};

let __parsedQuestionArray = [];
let __interactionIds = [];
let __interactionTags = [];
let __finalJSONContent = {};
let uniqueId;
let __feedbackPresets = [{ key: 'correct', value: 'Show when Correct', showDropdown: true, order: 1 },
{ key: 'incorrect', value: 'Show when Incorrect', showDropdown: true, order: 2 },
{ key: 'generic', value: 'Show Always', showDropdown: true, order: 100 }];

let __mediaPresets = [{ key: 'audio', value: 'Audio', showDropdown: true, active: 'disabled', order: 1 },
{ key: 'image', value: 'Image', showDropdown: true, active: 'enabled', order: 2 },
{ key: 'video', value: 'Video', showDropdown: true, active: 'disabled', order: 100 }];

export function setJsonContent(_jsonContent) {
    __editedJsonContent = _jsonContent;
}

/* Transform the processedJSON to originally received form so that the platform
* can use it to repaint the updated json.
*/
function __transformJSONtoOriginialForm() {
    __finalJSONContent = jQuery.extend(true, {}, __editedJsonContent);
    let optionsArr = [];
    let interactions = __finalJSONContent.content.interactions;

    interactions.forEach(function (interaction, inx) {
        let type = interaction.type;
        let optionsArray = interaction['answeroptions'];
        let interactionid = interaction.key;

        optionsArray.forEach(function (each, idx) {
            let newObj = {};
            let key = each.customAttribs.key;
            let val = each.customAttribs.value;

            newObj[key] = val;
            optionsArr.push(newObj);
            delete optionsArray[idx];
        });
        __finalJSONContent.content.interactions = {};
        __finalJSONContent.content.interactions[interactionid] = {};
        __finalJSONContent.content.interactions[interactionid]['type'] = type;
        __finalJSONContent.content.interactions[interactionid][type] = optionsArr;
    });

    let globalFeedback = __finalJSONContent.feedback.global;

    if (globalFeedback && globalFeedback.length > 0) {
        let tempObj = {};

        globalFeedback.forEach(function (obj) {
            if (obj.customAttribs.value && obj.customAttribs.value !== '') {
                tempObj[obj.customAttribs.key] = obj.customAttribs.value;
            }
        });
        __finalJSONContent.feedback.global = tempObj;
    }

    for (let i = 0; i < __finalJSONContent.content.canvas.data.questiondata.length; i++) {
        __finalJSONContent.content.canvas.data.questiondata[i].text += __interactionTags[i];
    }

    __finalJSONContent.content.instructions.forEach(function (each, idx) {
        if (each.text && each.tag === '') {
            __finalJSONContent.content.instructions[idx]['tag'] = 'text';
        }
    });
    return __finalJSONContent;
}

export function getConfig() {
    return __config;
}

export function getStatus() {
    return __state.hasUnsavedChanges;
}

export function saveItemInEditor() {
    activityAdaptor.submitEditChanges(__transformJSONtoOriginialForm(), uniqueId);
}

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

function __parseGlobalFeedbackJSONForRivets() {
    if (__editedJsonContent.feedback.global === undefined) {
        __editedJsonContent.feedback.global = [];
        return;
    }
    let tempObj = __editedJsonContent.feedback.global;
    let tempArr = [];

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
            if (key === 'correct') {
                processedObj.customAttribs.order = 1;
                __feedbackPresets[0].showDropdown = false;
            }
            if (key === 'incorrect') {
                processedObj.customAttribs.order = 2;
                __feedbackPresets[1].showDropdown = false;
            }
            processedObj.customAttribs.icon = __icon[key];
            tempArr.push(processedObj);
        });
        tempArr.sort(function (a, b) { return a.customAttribs.order - b.customAttribs.order; });
        __editedJsonContent.feedback.global = tempArr;
        __editedJsonContent.enableFeedBack = true;
    }
}

function __parseQuestionTextJSONForRivets() {
    __editedJsonContent.content.canvas.data.questiondata.forEach(function (element) {
        if (element.text === '') {
            element.text = 'Placeholder Question text. Update "Me" with a valid Question text';
        }
        element.customAttribs = {};
        element.customAttribs.isEdited = false;
    });
}

function __parseInstructionTextJSONForRivets() {
    __editedJsonContent.content.instructions.forEach(function (element) {
        if (element.text === '' || element.tag === '') {
            element.text = 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question';
        }
        element.customAttribs = {};
        element.customAttribs.isEdited = false;
    });

    if (__editedJsonContent.content.instructions.length > 0) {
        __editedJsonContent.isInstructionEmpty = false;
    } else {
        __editedJsonContent.isInstructionEmpty = true;
    }
}

function __parseMediaJSONForRivets() {
    __mediaManager.getMediaConfig().then((data) => {
        Object.entries(data.mediaConfig).forEach(([key, value]) => {
            __mediaConfig.push({[key]: value});
        });
    });
    __editedJsonContent.enableMedia = false;
    if (__editedJsonContent.content.stimulus && __editedJsonContent.content.stimulus.length > 0) {
        __editedJsonContent.enableMedia = true;
    }

    __editedJsonContent.editMedia = false;
}
/*
This function creates content for the editor from the base JSON data recieved
*/
export function __parseAndUpdateJSONForRivets() {
    __editedJsonContent.MCQMR = false;
    __editedJsonContent.MCQSR = false;
    __editedJsonContent.isInstructionEmpty = true;
    __editedJsonContent.enableFeedBack = false;

    for (let i = 0; i < __interactionIds.length; i++) {
        let processedArray = [];
        let interaction = __editedJsonContent.content.interactions[i];
        let type = interaction.type;

        __editedJsonContent[type] = true;
        interaction[type].forEach(function (obj, index) {
            let processedObj = {};

            processedObj.customAttribs = {};
            Object.keys(obj).forEach(function (key) {
                var interactionid = __interactionIds[i];

                processedObj.customAttribs.key = key;
                processedObj.customAttribs.value = obj[key];
                processedObj.customAttribs.isEdited = false;
                processedObj.customAttribs.index = index;
                processedObj.customAttribs.id = interactionid;

                if (typeof __editedJsonContent.feedback[interactionid] !== 'undefined') {
                    if (typeof __editedJsonContent.feedback[interactionid][key] !== 'undefined') {
                        processedObj.customAttribs.feedback = __editedJsonContent.feedback[interactionid][key];
                    }
                }
            });

            if (type === 'MCQSR') {
                let responseObj = __editedJsonContent.responses[__interactionIds[i]].correct;
                let len = Object.keys(responseObj).length;

                if (len > 0 && __editedJsonContent.responses[__interactionIds[i]].correct.indexOf(processedObj.customAttribs.key) > -1) {
                    processedObj.customAttribs.isCorrect = true;
                } else {
                    processedObj.customAttribs.isCorrect = false;
                }
            }

            if (type === 'MCQMR') {
                let responseObj = __editedJsonContent.responses[__interactionIds[i]].correct;

                if (responseObj.length > 0 && __editedJsonContent.responses[__interactionIds[i]].correct.indexOf(processedObj.customAttribs.key) > -1) {
                    processedObj.customAttribs.isCorrect = true;
                } else {
                    processedObj.customAttribs.isCorrect = false;
                }
            }
            processedArray.push(processedObj);
        });
        __editedJsonContent.content.interactions[i]['answeroptions'] = processedArray;
        __editedJsonContent.content.interactions[i].editlink = {
            'enabled': processedArray.length >= 2,
            'disabled': processedArray.length < 2
        };
    }
    __parseQuestionTextJSONForRivets();
    __parseInstructionTextJSONForRivets();
    __parseGlobalFeedbackJSONForRivets();
    __parseMediaJSONForRivets();
}

export function __parseAndUpdateJSONForInteractions() {
    let newArray = [];
    let newObj = {};
    let interactionTag;

    for (let i = 0; i < __editedJsonContent.content.canvas.data.questiondata.length; i++) {
        __parsedQuestionArray = $.parseHTML(__editedJsonContent.content.canvas.data.questiondata[i].text);

        $.each(__parsedQuestionArray, function (index, el) {
            if (this.href === interactionReferenceString) {
                __interactionIds.push(this.childNodes[0].nodeValue.trim());
                interactionTag = this.outerHTML;
                interactionTag = interactionTag.replace(/"/g, "'");
                __interactionTags.push(interactionTag);
                __editedJsonContent.content.canvas.data.questiondata[i].text = __editedJsonContent.content.canvas.data.questiondata[i].text.replace(interactionTag, '');
            }
        });
    }

    for (let key in __editedJsonContent.content.interactions) {
        newObj = __editedJsonContent.content.interactions[key];
        newObj.key = key;
        newArray.push(newObj);
    }
    __editedJsonContent.content.interactions = newArray;
}

export function buildModelandViewContent(jsonContent, params) {
    __editedJsonContent = jsonContent;
    __mediaManager = params.mediaManager;
    __assetBasePath = params.productAssetsBasePath;
    // Process JSON to remove interaction tags and initiate __interactionIds
    // and __interactionTags Arrays
    __parseAndUpdateJSONForInteractions();

    //Process JSON for easy iteration in template
    __parseAndUpdateJSONForRivets();
    /* ------ VALIDATION BLOCK END -------- */
}

export function __handleItemChangedInEditor() {
    activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
}

function __showFeedBack(event) {
    __editedJsonContent.feedback.global = [];
    __editedJsonContent.feedback.global.push(
        {
            'customAttribs': {
                'key': 'correct',
                'value': '',
                'index': 0,
                'icon': __icon['correct'],
                'order': 1
            }
        },
        {
            'customAttribs': {
                'key': 'incorrect',
                'value': '',
                'index': 1,
                'icon': __icon['incorrect'],
                'order': 2
            }
        });
    __editedJsonContent.enableFeedBack = true;
    __feedbackPresets[0].showDropdown = false;
    __feedbackPresets[1].showDropdown = false;
    __feedbackPresets[2].showDropdown = true;
}

function __showMedia(event) {
    __editedJsonContent.enableMedia = true;
    activityAdaptor.autoResizeActivityIframe();
}

/* Handling when options are sorted.
  * When dargging is stopped, get the previous and new index for dragged element.
  * Now instead of sortable, use these indexes to restructure array.
  * when the array would be updated, the rivets will detect the change and re-render
  * updated data in the template.
  */
function __bindSortable() {
    $('.sortable').sortable({
        handle: '.drag-icon',
        axis: 'y',
        containment: '.main-container',
        stop: function (event, ui) {
            let prevIndex = $(ui.item[0]).attr('elementIndex');
            let currentIndex;
            let interactIndex;

            /* Find the previous and current index of dragged element*/
            $(ui.item[0]).parent('.sortable').children('li').each(function (index) {
                let stat = true;

                if ($(this).attr('elementIndex') === prevIndex) {
                    currentIndex = index;
                    interactIndex = parseInt($(this).attr('interactIndex'), 10);
                    stat = false;
                }
                return stat;
            });

            prevIndex = parseInt(prevIndex, 10);
            /* Cancel sorting using library*/
            $('.sortable').sortable('cancel');

            //let type = __editedJsonContent.content.interactions[interactIndex].type;
            /* Instead do the sorting manually*/
            let removedItem = __editedJsonContent.content.interactions[interactIndex]['answeroptions'].splice(prevIndex, 1);

            __editedJsonContent.content.interactions[interactIndex]['answeroptions'].splice(currentIndex, 0, removedItem[0]);

            /* Update index property of customAttribs for each element*/
            $.each(__editedJsonContent.content.interactions[interactIndex]['answeroptions'], function (index, value) {
                __editedJsonContent.content.interactions[interactIndex]['answeroptions'][index].customAttribs.index = index;
            });

            __state.hasUnsavedChanges = true;
            activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
        }
    });
}

function __addFeedback(event, element, index) {
    //delete from preset

    __editedJsonContent.feedback.global.push({
        'customAttribs': {
            'key': element.key === 'generic' ? __guid() : element.key,
            'value': '',
            'index': element.order,
            'icon': __icon[element.key],
            'order': element.order
        }
    });

    __editedJsonContent.feedback.global.sort(function (a, b) { a.customAttribs.order - b.customAttribs.order; });

    __feedbackPresets[index].showDropdown = false;
    __enableFeedback.hide = !__feedbackPresets.some(function (element) {
        return element.showDropdown;
    });
    activityAdaptor.autoResizeActivityIframe();
    activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
}

function __removeFeedback(event, index) {

    if (__editedJsonContent.feedback.global[index].customAttribs.key === 'correct') {
        __feedbackPresets[0].showDropdown = true;
    } else if (__editedJsonContent.feedback.global[index].customAttribs.key === 'incorrect') {
        __feedbackPresets[1].showDropdown = true;
    } else {
        __feedbackPresets[2].showDropdown = true;
    }
    __editedJsonContent.feedback.global.splice(index, 1);

    __editedJsonContent.feedback.global.sort(function (a, b) { a.customAttribs.order - b.customAttribs.order; });
    if (__editedJsonContent.feedback.global.length === 0) {
        __editedJsonContent.enableFeedBack = false;
    }
    __enableFeedback.hide = false;
    __state.hasUnsavedChanges = true;
    activityAdaptor.autoResizeActivityIframe();
    activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
}

/* Handles the Question type drop down change event */
function __changeQuestionType(event, selectedType, interaction) {

    if (selectedType === interaction.type) {
        return;
    }
    let key = interaction.key;

    __editedJsonContent[interaction.type] = false;
    __editedJsonContent[selectedType] = true;

    if (selectedType === 'MCQMR') {
        __editedJsonContent.responses[key].correct = [];
    } else {
        __editedJsonContent.responses[key].correct = {};
    }
    __editedJsonContent.content.interactions.forEach(function (element) {
        if (element.key === key) {
            element.type = selectedType;
            element['answeroptions'].forEach(function (option) {
                option.customAttribs.isCorrect = false;
                option.customAttribs.isEdited = false;
            });
        }
    });

    //$('#answer-choice .dropdown .dropdown-toggle').dropdown('toggle');
    __bindSortable();
    activityAdaptor.autoResizeActivityIframe();
    __handleItemChangedInEditor();
}

/** Handles the add Instruction button click from the editor */
function __addInstruction() {
    __editedJsonContent.content.instructions.push({
        'tag': 'text',
        'text': 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question',
        'customAttribs': {
            'isEdited': false
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
    } else {
        __editedJsonContent.isInstructionEmpty = true;
        $('#instructionLabel').hide();
    }

    __state.hasUnsavedChanges = true;
    activityAdaptor.autoResizeActivityIframe();
    activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
}

/* Handles the Add new option button click */
function __addItem(event, interaction) {
    let newObj = {};

    newObj.customAttribs = {};
    newObj.customAttribs.key = __guid();
    newObj.customAttribs.value = '';
    newObj.customAttribs.isEdited = true;
    newObj.customAttribs.index = __editedJsonContent.content.interactions[interaction]['answeroptions'].length;
    __editedJsonContent.content.interactions[interaction]['answeroptions'].push(newObj);

    // This updates the editor model data to enable option delete and drag when
    // the options length is greater than 1
    if (__editedJsonContent.content.interactions[interaction]['answeroptions'].length > 1) {
        __editedJsonContent.content.interactions[interaction].editlink.enabled = true;
        __editedJsonContent.content.interactions[interaction].editlink.disabled = false;
    }
    __state.hasUnsavedChanges = true;
    activityAdaptor.autoResizeActivityIframe();
    activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
}

/* Handles the option remove event from the editor */
function __removeItem(event, element, interaction) {
    let inputAttribId = element.customAttribs.key;

    if (__editedJsonContent.content.interactions[interaction]['answeroptions'].length > 1) {
        // Delete the select option attribs based on the current position in the array
        __editedJsonContent.content.interactions[interaction]['answeroptions'].forEach(function (attrib, idx) {
            if (inputAttribId === attrib.customAttribs.key) {
                __editedJsonContent.content.interactions[interaction]['answeroptions'].splice(idx, 1);
            }
        });

        __editedJsonContent.content.interactions[interaction]['answeroptions'].forEach(function (el, idx) {
            __editedJsonContent.content.interactions[interaction]['answeroptions'][idx].customAttribs.index = idx;
        });

        __state.hasUnsavedChanges = true;
        activityAdaptor.autoResizeActivityIframe();
        activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
    }
    // This updates the editor data model to disable options delete and drag
    // when the answeroptions length is less than 2
    if (__editedJsonContent.content.interactions[interaction]['answeroptions'].length <= 1) {
        __editedJsonContent.content.interactions[interaction].editlink.enabled = false;
        __editedJsonContent.content.interactions[interaction].editlink.disabled = true;
    }
}

function __appendMedia(event, type) {
    if (type.toLowerCase() === 'image') {
        __editedJsonContent.editMedia = true;
    }

    __mediaManager.getAssetLibrary().getAssets(type.toLowerCase(),
    {'skip': 0,
    'limit': 4
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
        __assets.items = data.items;
    });

    activityAdaptor.autoResizeActivityIframe();
}

function __imageSelector(event, asset, key) {
    //requirements
    // tabkey, id, type, filename
    __imageSelected.stimulus = [];
    __imageSelected.key = key;
    __imageSelected.isImageSelected = true;
    __imageSelected.stimulus.push({
                    'tag': 'image',
                    'url': asset.sourcepath,
                    '_id': asset['_id'],
                    'filename': asset.filename
                });
}

function __hideMediaEditor() {
    __editedJsonContent.editMedia = false;
    __imageSelected.stimulus = [];
    __imageSelected.isImageSelected = false;
    activityAdaptor.autoResizeActivityIframe();
}

function __createAssetsObj(data, key) {
  let assetStruct = {
    'source': 'library',
    'assets': [
            {
                'type': data.tag,
                'id': data._id,
                'filename': data.filename,
                'url': data.url
            }
        ]
    };

  return assetStruct;
}

function __finalizeAssets(args) {
    function assetNotificationCb(err, processedAssets) {
        if (err) {
            console.log(err);
        }
        __imageSelected.processedAssets = processedAssets;
        processedAssets.forEach(function (element) {

            var imageData = {
                'image': element[0].path,
                'tag': element[0].type,
                'url': element[0].path
            };

            __editedJsonContent.content.stimulus.push(imageData);
        });
        __editedJsonContent.editMedia = false;
        __imageSelected.stimulus = [];
        __imageSelected.isImageSelected = false;
    };

    if (__imageSelected.isImageSelected) {
        let finalizedAssets = __createAssetsObj(__imageSelected.stimulus[0],
            __imageSelected.key);

        __mediaManager.finalizeAssets(finalizedAssets, assetNotificationCb);
    }
}

function __removeAssets(event, index) {
    __editedJsonContent.content.stimulus.splice(index, 1);
}
/*------------------------RIVET INITIALIZATION & BINDINGS -------------------------------*/
export function initializeRivets() {
    /*
     * Formatters for rivets
     */
    /* Appends cutom arguments to function calls*/
    rivets.formatters.args = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);

        return function () {
            return fn.apply(this, Array.prototype.concat.call(arguments, args));
        };
    };

    rivets.formatters.appendindex = function (obj, index) {
        var array = [];

        array.push(obj[index]);
        return array;
    };

    rivets.formatters.idcreator = function (key, idvalue) {
        return idvalue + key;
    };

    rivets.formatters.btnId = function (obj) {
        var text = 'btn';

        obj = obj.replace(/[\. ,:-]+/g, '');
        text = text.concat(obj);
        return text;
    };

    rivets.formatters.formatDate = function (timeInMilliSec) {
        let d = new Date(timeInMilliSec);

        return d ;
    };

    rivets.formatters.interactTypeVal = function (key) {
        var types = {
            'MCQMR': 'Multiple Choice Question',
            'MCQSR': 'Single Choice Question'
        };

        return types[key];
    };

    rivets.formatters.assets = function (url) {
        var basepath = __assetBasePath;
        var returnUrl = null;

        if (url && url.indexOf('http' === -1)) {
            returnUrl = basepath + url;
        } else {
            returnUrl = url;
        }

        return returnUrl;
    };

    rivets.formatters.assetname = function (url) {
        let name = '';

        if (url) {
            name = url.substring(url.lastIndexOf('/') + 1);
        }

        return name;
    };

    rivets.binders['content-editable'] = {
        bind: function (el) {
            var that = this;

            el.setAttribute('contenteditable', true);
            this.callback = function (e) {
                that.publish();
            };
            el.addEventListener('blur', this.callback);
        },
        unbind: function (el) {
            el.removeEventListener('blur', this.callback);
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
            $(el).removeClass(el.addedClass);
            delete el.addedClass;
        }

        if (value) {
            $(el).addClass(value);
            el.addedClass = value;
        }
    };

    rivets.binders['src-strict'] = function (el, value) {
        var img = new Image();

        img.onload = function () {
            $(el).attr('src', value);
        };

        img.src = value;
    };
    let data = {
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
        enableFeedback: __enableFeedback,
        mediaPresets: __mediaPresets,
        showMedia: __showMedia,
        appendMedia: __appendMedia,
        hideMediaEditor: __hideMediaEditor,
        mediaConfig: __mediaConfig,
        assets: __assets,
        imageSelector: __imageSelector,
        selectedStimulus: __imageSelected,
        finalizeAssets: __finalizeAssets,
        removeAssets: __removeAssets
    };

    rivets.bind($('#mcq-editor'), data);
}
/*------------------------RIVETS END-------------------------------*/

/* ---------------------- JQUERY BINDINGS ---------------------------------*/
/**
* handles the click event of the checkbox and sets the isCorrect for the appropriate option
*/
function __handleCheckboxButtonClick(event) {
    let currentTarget = event.currentTarget;
    let interactionIndex = parseInt($(currentTarget).closest('li').attr('interactIndex'), 10);
    let currentChoice = $(currentTarget).siblings('input').attr('key');
    let checked = $(currentTarget).siblings('input').prop('checked');

    __state.hasUnsavedChanges = true;

    /* Update the isCorrect property for each option*/
    __editedJsonContent.content.interactions[interactionIndex]['answeroptions'].forEach(function (obj, index) {
        if (__editedJsonContent.content.interactions[interactionIndex]['answeroptions'][index].customAttribs.key === currentChoice) {

            if (checked) {
                let idx = __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.indexOf(currentChoice);

                __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.splice(idx, 1);
            } else {
                let idx = __editedJsonContent.responses[__interactionIds[interactionIndex]].correct.indexOf(currentChoice);

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
    let currentTarget = event.currentTarget;
    //let quesIndex = 0;
    let interactionIndex = parseInt($(currentTarget).parent().parent('li').attr('interactIndex'), 10);

    $('label.radio').parent('li').removeClass('highlight');
    $(currentTarget).closest('li').addClass('highlight');
    __state.hasUnsavedChanges = true;
    /* Update the isCorrect property for each option*/
    __editedJsonContent.content.interactions[interactionIndex]['answeroptions'].forEach(function (obj, index) {
        if (__editedJsonContent.content.interactions[interactionIndex]['answeroptions'][index].customAttribs.key === $(currentTarget).siblings('input').attr('key')) {
            __editedJsonContent.content.interactions[interactionIndex]['answeroptions'][index].customAttribs.isCorrect = true;
        } else {
            __editedJsonContent.content.interactions[interactionIndex]['answeroptions'][index].customAttribs.isCorrect = false;
        }
    });
    __editedJsonContent.responses[__interactionIds[interactionIndex]].correct = $(currentTarget).siblings('input').attr('key');
    activityAdaptor.itemChangedInEditor(__transformJSONtoOriginialForm(), uniqueId);
}

$(document).ready(function () {
    sendItemChangeNotification = true;
});

export function setAdaptor(_adaptor) {
    activityAdaptor = _adaptor;
}

export function initializeHandlers() {
    //On CLICK of Check boxes
    $(document).on('click', '.editor label.checkbox', __handleCheckboxButtonClick);
    //On CLICK of Radio buttons
    $(document).on('click', '.editor label.radio', __handleRadioButtonClick);
    //Drag of list items (re-ordering)
    $(document).on('click', 'a.drag-icon', function () {
        // event.preventDefault();
    });
    $('#instructionmenu a.dropdown-toggle').click(function () {
        $('#menu1').dropdown('toggle');
    });

    $('#feedbackmenu a.dropdown-toggle').click(function () {
        $('#menu2').dropdown('toggle');
    });
    __bindSortable();
}

