(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export InteractionIds */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rivets__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rivets___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rivets__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__html_mcq_html__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__html_mcq_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__html_mcq_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scss_mcq_scss__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scss_mcq_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__scss_mcq_scss__);
/* global $ */



const initializeRivets = Symbol('initializeRivets');

/*
 * Constants.
 */
const Constants = {
    TEMPLATES: {
        /* Regular MCQ Layout */
        MCQ: __WEBPACK_IMPORTED_MODULE_1__html_mcq_html___default.a
    },
    THEMES: {
        MCQ: 'main',
        MCQ_LIGHT: 'main-light',
        MCQ_DARK: 'main-dark'
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = Constants;


let InteractionIds = [];

class McqModelAndView {
    constructor(model) {
        this.model = model;
    }
    get template() {
        return Constants.TEMPLATES.MCQ;
    }
    get themes() {
        return Constants.THEMES;
    }

    bindData() {
        this[initializeRivets]();
    }

    [initializeRivets]() {
        __WEBPACK_IMPORTED_MODULE_0_rivets___default.a.formatters.propertyList = function (obj) {
            return function () {
                let properties = [];

                for (let key in obj) {
                    properties.push({ key: key, value: obj[key] });
                };
                return properties;
            }();
        };

        __WEBPACK_IMPORTED_MODULE_0_rivets___default.a.formatters.idcreator = function (index, idvalue) {
            return idvalue + index;
        };

        __WEBPACK_IMPORTED_MODULE_0_rivets___default.a.binders.addclass = function (el, value) {
            if (el.addedClass) {
                $(el).removeClass(el.addedClass);
                delete el.addedClass;
            }
            if (value) {
                $(el).addClass(value);
                el.addedClass = value;
            }
        };
        console.log('feedback: ', this.model.feedback);
        let data = {
            content: this.model,
            feedback: this.model.feedback,
            showFeedback: this.model.feedbackState
        };

        /*Bind the data to template using rivets*/
        __WEBPACK_IMPORTED_MODULE_0_rivets___default.a.bind($('#mcq-engine'), data);
    }
}
/* harmony default export */ __webpack_exports__["b"] = (McqModelAndView);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {
  // Public sightglass interface.
  function sightglass(obj, keypath, callback, options) {
    return new Observer(obj, keypath, callback, options)
  }

  // Batteries not included.
  sightglass.adapters = {}

  // Constructs a new keypath observer and kicks things off.
  function Observer(obj, keypath, callback, options) {
    this.options = options || {}
    this.options.adapters = this.options.adapters || {}
    this.obj = obj
    this.keypath = keypath
    this.callback = callback
    this.objectPath = []
    this.update = this.update.bind(this)
    this.parse()

    if (isObject(this.target = this.realize())) {
      this.set(true, this.key, this.target, this.callback)
    }
  }

  // Tokenizes the provided keypath string into interface + path tokens for the
  // observer to work with.
  Observer.tokenize = function(keypath, interfaces, root) {
    var tokens = []
    var current = {i: root, path: ''}
    var index, chr

    for (index = 0; index < keypath.length; index++) {
      chr = keypath.charAt(index)

      if (!!~interfaces.indexOf(chr)) {
        tokens.push(current)
        current = {i: chr, path: ''}
      } else {
        current.path += chr
      }
    }

    tokens.push(current)
    return tokens
  }

  // Parses the keypath using the interfaces defined on the view. Sets variables
  // for the tokenized keypath as well as the end key.
  Observer.prototype.parse = function() {
    var interfaces = this.interfaces()
    var root, path

    if (!interfaces.length) {
      error('Must define at least one adapter interface.')
    }

    if (!!~interfaces.indexOf(this.keypath[0])) {
      root = this.keypath[0]
      path = this.keypath.substr(1)
    } else {
      if (typeof (root = this.options.root || sightglass.root) === 'undefined') {
        error('Must define a default root adapter.')
      }

      path = this.keypath
    }

    this.tokens = Observer.tokenize(path, interfaces, root)
    this.key = this.tokens.pop()
  }

  // Realizes the full keypath, attaching observers for every key and correcting
  // old observers to any changed objects in the keypath.
  Observer.prototype.realize = function() {
    var current = this.obj
    var unreached = false
    var prev

    this.tokens.forEach(function(token, index) {
      if (isObject(current)) {
        if (typeof this.objectPath[index] !== 'undefined') {
          if (current !== (prev = this.objectPath[index])) {
            this.set(false, token, prev, this.update)
            this.set(true, token, current, this.update)
            this.objectPath[index] = current
          }
        } else {
          this.set(true, token, current, this.update)
          this.objectPath[index] = current
        }

        current = this.get(token, current)
      } else {
        if (unreached === false) {
          unreached = index
        }

        if (prev = this.objectPath[index]) {
          this.set(false, token, prev, this.update)
        }
      }
    }, this)

    if (unreached !== false) {
      this.objectPath.splice(unreached)
    }

    return current
  }

  // Updates the keypath. This is called when any intermediary key is changed.
  Observer.prototype.update = function() {
    var next, oldValue

    if ((next = this.realize()) !== this.target) {
      if (isObject(this.target)) {
        this.set(false, this.key, this.target, this.callback)
      }

      if (isObject(next)) {
        this.set(true, this.key, next, this.callback)
      }

      oldValue = this.value()
      this.target = next

      // Always call callback if value is a function. If not a function, call callback only if value changed
      if (this.value() instanceof Function || this.value() !== oldValue) this.callback()
    }
  }

  // Reads the current end value of the observed keypath. Returns undefined if
  // the full keypath is unreachable.
  Observer.prototype.value = function() {
    if (isObject(this.target)) {
      return this.get(this.key, this.target)
    }
  }

  // Sets the current end value of the observed keypath. Calling setValue when
  // the full keypath is unreachable is a no-op.
  Observer.prototype.setValue = function(value) {
    if (isObject(this.target)) {
      this.adapter(this.key).set(this.target, this.key.path, value)
    }
  }

  // Gets the provided key on an object.
  Observer.prototype.get = function(key, obj) {
    return this.adapter(key).get(obj, key.path)
  }

  // Observes or unobserves a callback on the object using the provided key.
  Observer.prototype.set = function(active, key, obj, callback) {
    var action = active ? 'observe' : 'unobserve'
    this.adapter(key)[action](obj, key.path, callback)
  }

  // Returns an array of all unique adapter interfaces available.
  Observer.prototype.interfaces = function() {
    var interfaces = Object.keys(this.options.adapters)

    Object.keys(sightglass.adapters).forEach(function(i) {
      if (!~interfaces.indexOf(i)) {
        interfaces.push(i)
      }
    })

    return interfaces
  }

  // Convenience function to grab the adapter for a specific key.
  Observer.prototype.adapter = function(key) {
    return this.options.adapters[key.i] ||
      sightglass.adapters[key.i]
  }

  // Unobserves the entire keypath.
  Observer.prototype.unobserve = function() {
    var obj

    this.tokens.forEach(function(token, index) {
      if (obj = this.objectPath[index]) {
        this.set(false, token, obj, this.update)
      }
    }, this)

    if (isObject(this.target)) {
      this.set(false, this.key, this.target, this.callback)
    }
  }

  // Check if a value is an object than can be observed.
  function isObject(obj) {
    return typeof obj === 'object' && obj !== null
  }

  // Error thrower.
  function error(message) {
    throw new Error('[sightglass] ' + message)
  }

  // Export module for Node and the browser.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = sightglass
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return this.sightglass = sightglass
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else {
    this.sightglass = sightglass
  }
}).call(this);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

        function isCorrect(answerjson, useranswerjson) {
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

            for (let key in this.mcqObj.userAnswers) {
                if (this.mcqObj.userAnswers.hasOwnProperty(key)) {
                    if (this.mcqObj.userAnswers[key].length === __correctAnswers[key]['correct'].length) {
                        if (this.mcqObj.userAnswers[key].sort().join('') === __correctAnswers[key]['correct'].sort().join('')) {
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
        }

        if (type === 'MCQMR') {
            for (let prop in this.mcqObj.mcqModel.feedback) {
                this.mcqObj.mcqModel.feedbackState[prop] = false;
            }
            if (this.mcqObj.userAnswers.length <= 0) {
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

/* harmony default export */ __webpack_exports__["a"] = (McqUserResponse);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mcq_engine_mcq__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mcq", function() { return __WEBPACK_IMPORTED_MODULE_0__mcq_engine_mcq__["a"]; });




/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mcq_transformer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mcq_modelview__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mcq_events__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mcq_responseProcessor__ = __webpack_require__(2);
/* global $ */





const load = Symbol('loadMCQ');
const transform = Symbol('transformMCQ');
const renderView = Symbol('renderMCQ');
const bindEvents = Symbol('bindEvents');

class mcq {
    /**  ENGINE-SHELL CONSTRUCTOR FUNCTION
    *   @constructor
    *   @param {String} elRoot - DOM Element reference where the engine should paint itself.
    *   @param {Object} params - Startup params passed by platform. Include the following sets of parameters:
    *                   (a) State (Initial launch / Resume / Gradebook mode ).
    *                   (b) TOC parameters (contentFile, layout, etc.).
    *   @param {Object} adaptor - An adaptor interface for communication with platform (__saveResults, closeActivity, savePartialResults, getLastResults, etc.).
    *   @param {String} htmlLayout - Activity HTML layout (as defined in the TOC LINK paramter).
    *   @param {Object} jsonContent - Activity JSON content (as defined in the TOC LINK paramter).
    *   @param {Function} callback - To inform the shell that init is complete.
    */
    constructor(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
        this.elRoot = elRoot;
        this.params = params;
        this.adaptor = adaptor;
        this.theme = htmlLayout;
        this.content = jsonContentObj;
        this.userAnswers = [];
        this[load]();
        if (callback) {
            callback();
        }
    }

    [load]() {
        this[transform]();
        this[renderView]();
        this[bindEvents]();
    }

    [transform]() {
        let mcqTransformer = new __WEBPACK_IMPORTED_MODULE_0__mcq_transformer__["a" /* default */](this.content, this.params, this.theme);

        this.mcqModel = mcqTransformer.transform();
    }
    [renderView]() {
        let mcqModelAndView = new __WEBPACK_IMPORTED_MODULE_1__mcq_modelview__["b" /* default */](this.mcqModel);
        let htmltemplate = mcqModelAndView.template;

        $(this.elRoot).html(htmltemplate);
        mcqModelAndView.bindData();
    }
    [bindEvents]() {
        let mcqEvents = new __WEBPACK_IMPORTED_MODULE_2__mcq_events__["a" /* default */](this);

        mcqEvents.bindEvents();
    }

    /**
     * ENGINE-SHELL Interface
     * @return {String} - Configuration
     */
    getConfig() {}
    //return utils.__config;


    /**
     * ENGINE-SHELL Interface
     * @return {Boolean} - The current state (Activity Submitted/ Partial Save State.) of activity.
     */
    getStatus() {}
    //return utils.__state.activitySubmitted || utils.__state.activityPariallySubmitted;


    /**
    * Bound to click of Activity submit button.
    */
    handleSubmit() {
        let mcqResponseProcessor = new __WEBPACK_IMPORTED_MODULE_3__mcq_responseProcessor__["a" /* default */](this);

        /* Saving Answers. */
        mcqResponseProcessor.saveResults(true);
        $('input[id^=option]').attr('disabled', true);
        $('input[class^=mcqsroption]').attr('disabled', true);

        $('li[class^=line-item]').hover(function () {
            $(this).addClass('disable-li-hover');
        });
        $('label[class^=line-item-label]').hover(function () {
            $(this).addClass('disable-li-hover');
        });
    }

    showGrades() {
        let mcqResponseProcessor = new __WEBPACK_IMPORTED_MODULE_3__mcq_responseProcessor__["a" /* default */](this);

        /* Show last saved answers. */
        $('input[id^=option]').attr('disabled', true);
        mcqResponseProcessor.markAnswers();
    }

    showFeedback() {
        let mcqResponseProcessor = new __WEBPACK_IMPORTED_MODULE_3__mcq_responseProcessor__["a" /* default */](this);

        mcqResponseProcessor.feedbackProcessor();
    }

    resetAnswers() {
        console.log('reset called');
    }

    clearGrades() {
        console.log('clear grades called');
    }
}

/* harmony default export */ __webpack_exports__["a"] = (mcq);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mcq_modelview__ = __webpack_require__(0);
/* global $ */



const buildModelandViewContent = Symbol('ModelandViewContent');
const setTheme = Symbol('engine-theme');
const setinteractions = Symbol('setInteractions');
const setStimuli = Symbol('setStimuli');
const setInstructions = Symbol('setInstructions');
const setFeedback = Symbol('setFeedback');

const INTERACTION_REFERENCE_STR = 'http://www.comprodls.com/m1.0/interaction/mcq';

class McqTransformer {
    constructor(entity, params, themeObj) {
        this.entity = entity;
        this.params = params;
        this.themeObj = themeObj;
        this.mcqModel = {
            instructions: [],
            interactions: [],
            stimuli: [],
            scoring: {},
            feedback: {},
            feedbackState: { 'correct': false,
                'incorrect': false,
                'empty': false
            },
            type: '',
            theme: '',
            interactionIds: []
        };
    }

    transform() {
        console.log('transform data');
        this[buildModelandViewContent]();
        console.log('test data: ', JSON.stringify(this.mcqModel, null, 4));
        return this.mcqModel;
    }

    [buildModelandViewContent]() {
        this[setTheme](this.themeObj);
        this[setinteractions]();
        this[setStimuli]();
        this[setInstructions]();
        this[setFeedback]();
    }
    [setTheme](themeKey) {
        console.log(__WEBPACK_IMPORTED_MODULE_0__mcq_modelview__["a" /* Constants */].THEMES[themeKey], themeKey);
        this.mcqModel.theme = __WEBPACK_IMPORTED_MODULE_0__mcq_modelview__["a" /* Constants */].THEMES[themeKey];
    }

    [setInstructions]() {
        this.mcqModel.instructions = this.entity.content.instructions.map(function (element) {
            return element[element['tag']];
        });
    }
    [setinteractions]() {
        let entity = this.entity;
        let __self = this;

        this.mcqModel.interactions = entity.content.canvas.data.questiondata.map(function (element) {
            var obj = {};
            let tempobj = null;
            let interactiontype = null;
            let parsedQuestionArray = $('<div>' + element['text'] + '</div>');
            let currinteractionid = $(parsedQuestionArray).find("a[href='" + INTERACTION_REFERENCE_STR + "']").text().trim();

            $(parsedQuestionArray).find("a[href='" + INTERACTION_REFERENCE_STR + "']").remove();
            obj.id = currinteractionid;
            obj.questiontext = $(parsedQuestionArray).html();
            obj.prompt = '';
            tempobj = entity.content.interactions[currinteractionid];
            interactiontype = tempobj['type'];
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

            // InteractionIds.push(currinteractionid);
            __self.mcqModel.interactionIds.push(currinteractionid);
            return obj;
        });
    }

    [setStimuli]() {
        let params = this.params;

        this.mcqModel.stimuli = this.entity.content.stimulus.map(function (element) {
            let tagtype = element['tag'];

            if (tagtype === 'image') {
                return params.questionMediaBasePath + element[tagtype];
            }
            return element[tagtype];
        });
    }

    [setFeedback]() {
        this.mcqModel.feedback = this.entity.feedback;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (McqTransformer);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Rivets.js
// version: 0.9.6
// author: Michael Richards
// license: MIT
(function() {
  var Rivets, bindMethod, jQuery, unbindMethod, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Rivets = {
    options: ['prefix', 'templateDelimiters', 'rootInterface', 'preloadData', 'handler', 'executeFunctions'],
    extensions: ['binders', 'formatters', 'components', 'adapters'],
    "public": {
      binders: {},
      components: {},
      formatters: {},
      adapters: {},
      prefix: 'rv',
      templateDelimiters: ['{', '}'],
      rootInterface: '.',
      preloadData: true,
      executeFunctions: false,
      iterationAlias: function(modelName) {
        return '%' + modelName + '%';
      },
      handler: function(context, ev, binding) {
        return this.call(context, ev, binding.view.models);
      },
      configure: function(options) {
        var descriptor, key, option, value;
        if (options == null) {
          options = {};
        }
        for (option in options) {
          value = options[option];
          if (option === 'binders' || option === 'components' || option === 'formatters' || option === 'adapters') {
            for (key in value) {
              descriptor = value[key];
              Rivets[option][key] = descriptor;
            }
          } else {
            Rivets["public"][option] = value;
          }
        }
      },
      bind: function(el, models, options) {
        var view;
        if (models == null) {
          models = {};
        }
        if (options == null) {
          options = {};
        }
        view = new Rivets.View(el, models, options);
        view.bind();
        return view;
      },
      init: function(component, el, data) {
        var scope, template, view;
        if (data == null) {
          data = {};
        }
        if (el == null) {
          el = document.createElement('div');
        }
        component = Rivets["public"].components[component];
        template = component.template.call(this, el);
        if (template instanceof HTMLElement) {
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
          el.appendChild(template);
        } else {
          el.innerHTML = template;
        }
        scope = component.initialize.call(this, el, data);
        view = new Rivets.View(el, scope);
        view.bind();
        return view;
      }
    }
  };

  if (window['jQuery'] || window['$']) {
    jQuery = window['jQuery'] || window['$'];
    _ref = 'on' in jQuery.prototype ? ['on', 'off'] : ['bind', 'unbind'], bindMethod = _ref[0], unbindMethod = _ref[1];
    Rivets.Util = {
      bindEvent: function(el, event, handler) {
        return jQuery(el)[bindMethod](event, handler);
      },
      unbindEvent: function(el, event, handler) {
        return jQuery(el)[unbindMethod](event, handler);
      },
      getInputValue: function(el) {
        var $el;
        $el = jQuery(el);
        if ($el.attr('type') === 'checkbox') {
          return $el.is(':checked');
        } else {
          return $el.val();
        }
      }
    };
  } else {
    Rivets.Util = {
      bindEvent: (function() {
        if ('addEventListener' in window) {
          return function(el, event, handler) {
            return el.addEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.attachEvent('on' + event, handler);
        };
      })(),
      unbindEvent: (function() {
        if ('removeEventListener' in window) {
          return function(el, event, handler) {
            return el.removeEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.detachEvent('on' + event, handler);
        };
      })(),
      getInputValue: function(el) {
        var o, _i, _len, _results;
        if (el.type === 'checkbox') {
          return el.checked;
        } else if (el.type === 'select-multiple') {
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            if (o.selected) {
              _results.push(o.value);
            }
          }
          return _results;
        } else {
          return el.value;
        }
      }
    };
  }

  Rivets.TypeParser = (function() {
    function TypeParser() {}

    TypeParser.types = {
      primitive: 0,
      keypath: 1
    };

    TypeParser.parse = function(string) {
      if (/^'.*'$|^".*"$/.test(string)) {
        return {
          type: this.types.primitive,
          value: string.slice(1, -1)
        };
      } else if (string === 'true') {
        return {
          type: this.types.primitive,
          value: true
        };
      } else if (string === 'false') {
        return {
          type: this.types.primitive,
          value: false
        };
      } else if (string === 'null') {
        return {
          type: this.types.primitive,
          value: null
        };
      } else if (string === 'undefined') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (string === '') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (isNaN(Number(string)) === false) {
        return {
          type: this.types.primitive,
          value: Number(string)
        };
      } else {
        return {
          type: this.types.keypath,
          value: string
        };
      }
    };

    return TypeParser;

  })();

  Rivets.TextTemplateParser = (function() {
    function TextTemplateParser() {}

    TextTemplateParser.types = {
      text: 0,
      binding: 1
    };

    TextTemplateParser.parse = function(template, delimiters) {
      var index, lastIndex, lastToken, length, substring, tokens, value;
      tokens = [];
      length = template.length;
      index = 0;
      lastIndex = 0;
      while (lastIndex < length) {
        index = template.indexOf(delimiters[0], lastIndex);
        if (index < 0) {
          tokens.push({
            type: this.types.text,
            value: template.slice(lastIndex)
          });
          break;
        } else {
          if (index > 0 && lastIndex < index) {
            tokens.push({
              type: this.types.text,
              value: template.slice(lastIndex, index)
            });
          }
          lastIndex = index + delimiters[0].length;
          index = template.indexOf(delimiters[1], lastIndex);
          if (index < 0) {
            substring = template.slice(lastIndex - delimiters[1].length);
            lastToken = tokens[tokens.length - 1];
            if ((lastToken != null ? lastToken.type : void 0) === this.types.text) {
              lastToken.value += substring;
            } else {
              tokens.push({
                type: this.types.text,
                value: substring
              });
            }
            break;
          }
          value = template.slice(lastIndex, index).trim();
          tokens.push({
            type: this.types.binding,
            value: value
          });
          lastIndex = index + delimiters[1].length;
        }
      }
      return tokens;
    };

    return TextTemplateParser;

  })();

  Rivets.View = (function() {
    function View(els, models, options) {
      var k, option, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.els = els;
      this.models = models;
      if (options == null) {
        options = {};
      }
      this.update = __bind(this.update, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.select = __bind(this.select, this);
      this.traverse = __bind(this.traverse, this);
      this.build = __bind(this.build, this);
      this.buildBinding = __bind(this.buildBinding, this);
      this.bindingRegExp = __bind(this.bindingRegExp, this);
      this.options = __bind(this.options, this);
      if (!(this.els.jquery || this.els instanceof Array)) {
        this.els = [this.els];
      }
      _ref1 = Rivets.extensions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        this[option] = {};
        if (options[option]) {
          _ref2 = options[option];
          for (k in _ref2) {
            v = _ref2[k];
            this[option][k] = v;
          }
        }
        _ref3 = Rivets["public"][option];
        for (k in _ref3) {
          v = _ref3[k];
          if ((_base = this[option])[k] == null) {
            _base[k] = v;
          }
        }
      }
      _ref4 = Rivets.options;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        option = _ref4[_j];
        this[option] = (_ref5 = options[option]) != null ? _ref5 : Rivets["public"][option];
      }
      this.build();
    }

    View.prototype.options = function() {
      var option, options, _i, _len, _ref1;
      options = {};
      _ref1 = Rivets.extensions.concat(Rivets.options);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        options[option] = this[option];
      }
      return options;
    };

    View.prototype.bindingRegExp = function() {
      return new RegExp("^" + this.prefix + "-");
    };

    View.prototype.buildBinding = function(binding, node, type, declaration) {
      var context, ctx, dependencies, keypath, options, pipe, pipes;
      options = {};
      pipes = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = declaration.match(/((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          pipe = _ref1[_i];
          _results.push(pipe.trim());
        }
        return _results;
      })();
      context = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = pipes.shift().split('<');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ctx = _ref1[_i];
          _results.push(ctx.trim());
        }
        return _results;
      })();
      keypath = context.shift();
      options.formatters = pipes;
      if (dependencies = context.shift()) {
        options.dependencies = dependencies.split(/\s+/);
      }
      return this.bindings.push(new Rivets[binding](this, node, type, keypath, options));
    };

    View.prototype.build = function() {
      var el, parse, _i, _len, _ref1;
      this.bindings = [];
      parse = (function(_this) {
        return function(node) {
          var block, childNode, delimiters, n, parser, text, token, tokens, _i, _j, _len, _len1, _ref1;
          if (node.nodeType === 3) {
            parser = Rivets.TextTemplateParser;
            if (delimiters = _this.templateDelimiters) {
              if ((tokens = parser.parse(node.data, delimiters)).length) {
                if (!(tokens.length === 1 && tokens[0].type === parser.types.text)) {
                  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
                    token = tokens[_i];
                    text = document.createTextNode(token.value);
                    node.parentNode.insertBefore(text, node);
                    if (token.type === 1) {
                      _this.buildBinding('TextBinding', text, null, token.value);
                    }
                  }
                  node.parentNode.removeChild(node);
                }
              }
            }
          } else if (node.nodeType === 1) {
            block = _this.traverse(node);
          }
          if (!block) {
            _ref1 = (function() {
              var _k, _len1, _ref1, _results;
              _ref1 = node.childNodes;
              _results = [];
              for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
                n = _ref1[_k];
                _results.push(n);
              }
              return _results;
            })();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              childNode = _ref1[_j];
              parse(childNode);
            }
          }
        };
      })(this);
      _ref1 = this.els;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        el = _ref1[_i];
        parse(el);
      }
      this.bindings.sort(function(a, b) {
        var _ref2, _ref3;
        return (((_ref2 = b.binder) != null ? _ref2.priority : void 0) || 0) - (((_ref3 = a.binder) != null ? _ref3.priority : void 0) || 0);
      });
    };

    View.prototype.traverse = function(node) {
      var attribute, attributes, binder, bindingRegExp, block, identifier, regexp, type, value, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
      bindingRegExp = this.bindingRegExp();
      block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE';
      _ref1 = node.attributes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          if (!(binder = this.binders[type])) {
            _ref2 = this.binders;
            for (identifier in _ref2) {
              value = _ref2[identifier];
              if (identifier !== '*' && identifier.indexOf('*') !== -1) {
                regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
                if (regexp.test(type)) {
                  binder = value;
                }
              }
            }
          }
          binder || (binder = this.binders['*']);
          if (binder.block) {
            block = true;
            attributes = [attribute];
          }
        }
      }
      _ref3 = attributes || node.attributes;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        attribute = _ref3[_j];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          this.buildBinding('Binding', node, type, attribute.value);
        }
      }
      if (!block) {
        type = node.nodeName.toLowerCase();
        if (this.components[type] && !node._bound) {
          this.bindings.push(new Rivets.ComponentBinding(this, node, type));
          block = true;
        }
      }
      return block;
    };

    View.prototype.select = function(fn) {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (fn(binding)) {
          _results.push(binding);
        }
      }
      return _results;
    };

    View.prototype.bind = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.bind();
      }
    };

    View.prototype.unbind = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.unbind();
      }
    };

    View.prototype.sync = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (typeof binding.sync === "function") {
          binding.sync();
        }
      }
    };

    View.prototype.publish = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.select(function(b) {
        var _ref1;
        return (_ref1 = b.binder) != null ? _ref1.publishes : void 0;
      });
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.publish();
      }
    };

    View.prototype.update = function(models) {
      var binding, key, model, _i, _len, _ref1;
      if (models == null) {
        models = {};
      }
      for (key in models) {
        model = models[key];
        this.models[key] = model;
      }
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (typeof binding.update === "function") {
          binding.update(models);
        }
      }
    };

    return View;

  })();

  Rivets.Binding = (function() {
    function Binding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.getValue = __bind(this.getValue, this);
      this.update = __bind(this.update, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.set = __bind(this.set, this);
      this.eventHandler = __bind(this.eventHandler, this);
      this.formattedValue = __bind(this.formattedValue, this);
      this.parseFormatterArguments = __bind(this.parseFormatterArguments, this);
      this.parseTarget = __bind(this.parseTarget, this);
      this.observe = __bind(this.observe, this);
      this.setBinder = __bind(this.setBinder, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
      this.model = void 0;
      this.setBinder();
    }

    Binding.prototype.setBinder = function() {
      var identifier, regexp, value, _ref1;
      if (!(this.binder = this.view.binders[this.type])) {
        _ref1 = this.view.binders;
        for (identifier in _ref1) {
          value = _ref1[identifier];
          if (identifier !== '*' && identifier.indexOf('*') !== -1) {
            regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
            if (regexp.test(this.type)) {
              this.binder = value;
              this.args = new RegExp("^" + (identifier.replace(/\*/g, '(.+)')) + "$").exec(this.type);
              this.args.shift();
            }
          }
        }
      }
      this.binder || (this.binder = this.view.binders['*']);
      if (this.binder instanceof Function) {
        return this.binder = {
          routine: this.binder
        };
      }
    };

    Binding.prototype.observe = function(obj, keypath, callback) {
      return Rivets.sightglass(obj, keypath, callback, {
        root: this.view.rootInterface,
        adapters: this.view.adapters
      });
    };

    Binding.prototype.parseTarget = function() {
      var token;
      token = Rivets.TypeParser.parse(this.keypath);
      if (token.type === Rivets.TypeParser.types.primitive) {
        return this.value = token.value;
      } else {
        this.observer = this.observe(this.view.models, this.keypath, this.sync);
        return this.model = this.observer.target;
      }
    };

    Binding.prototype.parseFormatterArguments = function(args, formatterIndex) {
      var ai, arg, observer, processedArgs, _base, _i, _len;
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(Rivets.TypeParser.parse(arg));
        }
        return _results;
      })();
      processedArgs = [];
      for (ai = _i = 0, _len = args.length; _i < _len; ai = ++_i) {
        arg = args[ai];
        processedArgs.push(arg.type === Rivets.TypeParser.types.primitive ? arg.value : ((_base = this.formatterObservers)[formatterIndex] || (_base[formatterIndex] = {}), !(observer = this.formatterObservers[formatterIndex][ai]) ? (observer = this.observe(this.view.models, arg.value, this.sync), this.formatterObservers[formatterIndex][ai] = observer) : void 0, observer.value()));
      }
      return processedArgs;
    };

    Binding.prototype.formattedValue = function(value) {
      var args, fi, formatter, id, processedArgs, _i, _len, _ref1, _ref2;
      _ref1 = this.formatters;
      for (fi = _i = 0, _len = _ref1.length; _i < _len; fi = ++_i) {
        formatter = _ref1[fi];
        args = formatter.match(/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g);
        id = args.shift();
        formatter = this.view.formatters[id];
        processedArgs = this.parseFormatterArguments(args, fi);
        if ((formatter != null ? formatter.read : void 0) instanceof Function) {
          value = (_ref2 = formatter.read).call.apply(_ref2, [this.model, value].concat(__slice.call(processedArgs)));
        } else if (formatter instanceof Function) {
          value = formatter.call.apply(formatter, [this.model, value].concat(__slice.call(processedArgs)));
        }
      }
      return value;
    };

    Binding.prototype.eventHandler = function(fn) {
      var binding, handler;
      handler = (binding = this).view.handler;
      return function(ev) {
        return handler.call(fn, this, ev, binding);
      };
    };

    Binding.prototype.set = function(value) {
      var _ref1;
      value = value instanceof Function && !this.binder["function"] && Rivets["public"].executeFunctions ? this.formattedValue(value.call(this.model)) : this.formattedValue(value);
      return (_ref1 = this.binder.routine) != null ? _ref1.call(this, this.el, value) : void 0;
    };

    Binding.prototype.sync = function() {
      var dependency, observer;
      return this.set((function() {
        var _i, _j, _len, _len1, _ref1, _ref2, _ref3;
        if (this.observer) {
          if (this.model !== this.observer.target) {
            _ref1 = this.dependencies;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              observer = _ref1[_i];
              observer.unobserve();
            }
            this.dependencies = [];
            if (((this.model = this.observer.target) != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
              _ref3 = this.options.dependencies;
              for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                dependency = _ref3[_j];
                observer = this.observe(this.model, dependency, this.sync);
                this.dependencies.push(observer);
              }
            }
          }
          return this.observer.value();
        } else {
          return this.value;
        }
      }).call(this));
    };

    Binding.prototype.publish = function() {
      var args, fi, fiReversed, formatter, id, lastformatterIndex, processedArgs, value, _i, _len, _ref1, _ref2, _ref3;
      if (this.observer) {
        value = this.getValue(this.el);
        lastformatterIndex = this.formatters.length - 1;
        _ref1 = this.formatters.slice(0).reverse();
        for (fiReversed = _i = 0, _len = _ref1.length; _i < _len; fiReversed = ++_i) {
          formatter = _ref1[fiReversed];
          fi = lastformatterIndex - fiReversed;
          args = formatter.split(/\s+/);
          id = args.shift();
          processedArgs = this.parseFormatterArguments(args, fi);
          if ((_ref2 = this.view.formatters[id]) != null ? _ref2.publish : void 0) {
            value = (_ref3 = this.view.formatters[id]).publish.apply(_ref3, [value].concat(__slice.call(processedArgs)));
          }
        }
        return this.observer.setValue(value);
      }
    };

    Binding.prototype.bind = function() {
      var dependency, observer, _i, _len, _ref1, _ref2, _ref3;
      this.parseTarget();
      if ((_ref1 = this.binder.bind) != null) {
        _ref1.call(this, this.el);
      }
      if ((this.model != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
        _ref3 = this.options.dependencies;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          dependency = _ref3[_i];
          observer = this.observe(this.model, dependency, this.sync);
          this.dependencies.push(observer);
        }
      }
      if (this.view.preloadData) {
        return this.sync();
      }
    };

    Binding.prototype.unbind = function() {
      var ai, args, fi, observer, _i, _len, _ref1, _ref2, _ref3, _ref4;
      if ((_ref1 = this.binder.unbind) != null) {
        _ref1.call(this, this.el);
      }
      if ((_ref2 = this.observer) != null) {
        _ref2.unobserve();
      }
      _ref3 = this.dependencies;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        observer = _ref3[_i];
        observer.unobserve();
      }
      this.dependencies = [];
      _ref4 = this.formatterObservers;
      for (fi in _ref4) {
        args = _ref4[fi];
        for (ai in args) {
          observer = args[ai];
          observer.unobserve();
        }
      }
      return this.formatterObservers = {};
    };

    Binding.prototype.update = function(models) {
      var _ref1, _ref2;
      if (models == null) {
        models = {};
      }
      this.model = (_ref1 = this.observer) != null ? _ref1.target : void 0;
      return (_ref2 = this.binder.update) != null ? _ref2.call(this, models) : void 0;
    };

    Binding.prototype.getValue = function(el) {
      if (this.binder && (this.binder.getValue != null)) {
        return this.binder.getValue.call(this, el);
      } else {
        return Rivets.Util.getInputValue(el);
      }
    };

    return Binding;

  })();

  Rivets.ComponentBinding = (function(_super) {
    __extends(ComponentBinding, _super);

    function ComponentBinding(view, el, type) {
      var attribute, bindingRegExp, propertyName, token, _i, _len, _ref1, _ref2;
      this.view = view;
      this.el = el;
      this.type = type;
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.locals = __bind(this.locals, this);
      this.component = this.view.components[this.type];
      this["static"] = {};
      this.observers = {};
      this.upstreamObservers = {};
      bindingRegExp = view.bindingRegExp();
      _ref1 = this.el.attributes || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (!bindingRegExp.test(attribute.name)) {
          propertyName = this.camelCase(attribute.name);
          token = Rivets.TypeParser.parse(attribute.value);
          if (__indexOf.call((_ref2 = this.component["static"]) != null ? _ref2 : [], propertyName) >= 0) {
            this["static"][propertyName] = attribute.value;
          } else if (token.type === Rivets.TypeParser.types.primitive) {
            this["static"][propertyName] = token.value;
          } else {
            this.observers[propertyName] = attribute.value;
          }
        }
      }
    }

    ComponentBinding.prototype.sync = function() {};

    ComponentBinding.prototype.update = function() {};

    ComponentBinding.prototype.publish = function() {};

    ComponentBinding.prototype.locals = function() {
      var key, observer, result, value, _ref1, _ref2;
      result = {};
      _ref1 = this["static"];
      for (key in _ref1) {
        value = _ref1[key];
        result[key] = value;
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        result[key] = observer.value();
      }
      return result;
    };

    ComponentBinding.prototype.camelCase = function(string) {
      return string.replace(/-([a-z])/g, function(grouped) {
        return grouped[1].toUpperCase();
      });
    };

    ComponentBinding.prototype.bind = function() {
      var k, key, keypath, observer, option, options, scope, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (!this.bound) {
        _ref1 = this.observers;
        for (key in _ref1) {
          keypath = _ref1[key];
          this.observers[key] = this.observe(this.view.models, keypath, ((function(_this) {
            return function(key) {
              return function() {
                return _this.componentView.models[key] = _this.observers[key].value();
              };
            };
          })(this)).call(this, key));
        }
        this.bound = true;
      }
      if (this.componentView != null) {
        this.componentView.bind();
      } else {
        this.el.innerHTML = this.component.template.call(this);
        scope = this.component.initialize.call(this, this.el, this.locals());
        this.el._bound = true;
        options = {};
        _ref2 = Rivets.extensions;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          option = _ref2[_i];
          options[option] = {};
          if (this.component[option]) {
            _ref3 = this.component[option];
            for (k in _ref3) {
              v = _ref3[k];
              options[option][k] = v;
            }
          }
          _ref4 = this.view[option];
          for (k in _ref4) {
            v = _ref4[k];
            if ((_base = options[option])[k] == null) {
              _base[k] = v;
            }
          }
        }
        _ref5 = Rivets.options;
        for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
          option = _ref5[_j];
          options[option] = (_ref6 = this.component[option]) != null ? _ref6 : this.view[option];
        }
        this.componentView = new Rivets.View(Array.prototype.slice.call(this.el.childNodes), scope, options);
        this.componentView.bind();
        _ref7 = this.observers;
        for (key in _ref7) {
          observer = _ref7[key];
          this.upstreamObservers[key] = this.observe(this.componentView.models, key, ((function(_this) {
            return function(key, observer) {
              return function() {
                return observer.setValue(_this.componentView.models[key]);
              };
            };
          })(this)).call(this, key, observer));
        }
      }
    };

    ComponentBinding.prototype.unbind = function() {
      var key, observer, _ref1, _ref2, _ref3;
      _ref1 = this.upstreamObservers;
      for (key in _ref1) {
        observer = _ref1[key];
        observer.unobserve();
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        observer.unobserve();
      }
      return (_ref3 = this.componentView) != null ? _ref3.unbind.call(this) : void 0;
    };

    return ComponentBinding;

  })(Rivets.Binding);

  Rivets.TextBinding = (function(_super) {
    __extends(TextBinding, _super);

    function TextBinding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.sync = __bind(this.sync, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
    }

    TextBinding.prototype.binder = {
      routine: function(node, value) {
        return node.data = value != null ? value : '';
      }
    };

    TextBinding.prototype.sync = function() {
      return TextBinding.__super__.sync.apply(this, arguments);
    };

    return TextBinding;

  })(Rivets.Binding);

  Rivets["public"].binders.text = function(el, value) {
    if (el.textContent != null) {
      return el.textContent = value != null ? value : '';
    } else {
      return el.innerText = value != null ? value : '';
    }
  };

  Rivets["public"].binders.html = function(el, value) {
    return el.innerHTML = value != null ? value : '';
  };

  Rivets["public"].binders.show = function(el, value) {
    return el.style.display = value ? '' : 'none';
  };

  Rivets["public"].binders.hide = function(el, value) {
    return el.style.display = value ? 'none' : '';
  };

  Rivets["public"].binders.enabled = function(el, value) {
    return el.disabled = !value;
  };

  Rivets["public"].binders.disabled = function(el, value) {
    return el.disabled = !!value;
  };

  Rivets["public"].binders.checked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) === (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !!value;
      }
    }
  };

  Rivets["public"].binders.unchecked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) !== (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !value;
      }
    }
  };

  Rivets["public"].binders.value = {
    publishes: true,
    priority: 3000,
    bind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        this.event = el.tagName === 'SELECT' ? 'change' : 'input';
        return Rivets.Util.bindEvent(el, this.event, this.publish);
      }
    },
    unbind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        return Rivets.Util.unbindEvent(el, this.event, this.publish);
      }
    },
    routine: function(el, value) {
      var o, _i, _len, _ref1, _ref2, _ref3, _results;
      if (el.tagName === 'INPUT' && el.type === 'radio') {
        return el.setAttribute('value', value);
      } else if (window.jQuery != null) {
        el = jQuery(el);
        if ((value != null ? value.toString() : void 0) !== ((_ref1 = el.val()) != null ? _ref1.toString() : void 0)) {
          return el.val(value != null ? value : '');
        }
      } else {
        if (el.type === 'select-multiple') {
          if (value != null) {
            _results = [];
            for (_i = 0, _len = el.length; _i < _len; _i++) {
              o = el[_i];
              _results.push(o.selected = (_ref2 = o.value, __indexOf.call(value, _ref2) >= 0));
            }
            return _results;
          }
        } else if ((value != null ? value.toString() : void 0) !== ((_ref3 = el.value) != null ? _ref3.toString() : void 0)) {
          return el.value = value != null ? value : '';
        }
      }
    }
  };

  Rivets["public"].binders["if"] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, declaration;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        declaration = el.getAttribute(attr);
        this.marker = document.createComment(" rivets: " + this.type + " " + declaration + " ");
        this.bound = false;
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        return el.parentNode.removeChild(el);
      }
    },
    unbind: function() {
      if (this.nested) {
        this.nested.unbind();
        return this.bound = false;
      }
    },
    routine: function(el, value) {
      var key, model, models, _ref1;
      if (!!value === !this.bound) {
        if (value) {
          models = {};
          _ref1 = this.view.models;
          for (key in _ref1) {
            model = _ref1[key];
            models[key] = model;
          }
          (this.nested || (this.nested = new Rivets.View(el, models, this.view.options()))).bind();
          this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
          return this.bound = true;
        } else {
          el.parentNode.removeChild(el);
          this.nested.unbind();
          return this.bound = false;
        }
      }
    },
    update: function(models) {
      var _ref1;
      return (_ref1 = this.nested) != null ? _ref1.update(models) : void 0;
    }
  };

  Rivets["public"].binders.unless = {
    block: true,
    priority: 4000,
    bind: function(el) {
      return Rivets["public"].binders["if"].bind.call(this, el);
    },
    unbind: function() {
      return Rivets["public"].binders["if"].unbind.call(this);
    },
    routine: function(el, value) {
      return Rivets["public"].binders["if"].routine.call(this, el, !value);
    },
    update: function(models) {
      return Rivets["public"].binders["if"].update.call(this, models);
    }
  };

  Rivets["public"].binders['on-*'] = {
    "function": true,
    priority: 1000,
    unbind: function(el) {
      if (this.handler) {
        return Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
    },
    routine: function(el, value) {
      if (this.handler) {
        Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
      return Rivets.Util.bindEvent(el, this.args[0], this.handler = this.eventHandler(value));
    }
  };

  Rivets["public"].binders['each-*'] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, view, _i, _len, _ref1;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        this.marker = document.createComment(" rivets: " + this.type + " ");
        this.iterated = [];
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        el.parentNode.removeChild(el);
      } else {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.bind();
        }
      }
    },
    unbind: function(el) {
      var view, _i, _len, _ref1;
      if (this.iterated != null) {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.unbind();
        }
      }
    },
    routine: function(el, collection) {
      var binding, data, i, index, key, model, modelName, options, previous, template, view, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      modelName = this.args[0];
      collection = collection || [];
      if (this.iterated.length > collection.length) {
        _ref1 = Array(this.iterated.length - collection.length);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          view = this.iterated.pop();
          view.unbind();
          this.marker.parentNode.removeChild(view.els[0]);
        }
      }
      for (index = _j = 0, _len1 = collection.length; _j < _len1; index = ++_j) {
        model = collection[index];
        data = {
          index: index
        };
        data[Rivets["public"].iterationAlias(modelName)] = index;
        data[modelName] = model;
        if (this.iterated[index] == null) {
          _ref2 = this.view.models;
          for (key in _ref2) {
            model = _ref2[key];
            if (data[key] == null) {
              data[key] = model;
            }
          }
          previous = this.iterated.length ? this.iterated[this.iterated.length - 1].els[0] : this.marker;
          options = this.view.options();
          options.preloadData = true;
          template = el.cloneNode(true);
          view = new Rivets.View(template, data, options);
          view.bind();
          this.iterated.push(view);
          this.marker.parentNode.insertBefore(template, previous.nextSibling);
        } else if (this.iterated[index].models[modelName] !== model) {
          this.iterated[index].update(data);
        }
      }
      if (el.nodeName === 'OPTION') {
        _ref3 = this.view.bindings;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          binding = _ref3[_k];
          if (binding.el === this.marker.parentNode && binding.type === 'value') {
            binding.sync();
          }
        }
      }
    },
    update: function(models) {
      var data, key, model, view, _i, _len, _ref1;
      data = {};
      for (key in models) {
        model = models[key];
        if (key !== this.args[0]) {
          data[key] = model;
        }
      }
      _ref1 = this.iterated;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.update(data);
      }
    }
  };

  Rivets["public"].binders['class-*'] = function(el, value) {
    var elClass;
    elClass = " " + el.className + " ";
    if (!value === (elClass.indexOf(" " + this.args[0] + " ") !== -1)) {
      return el.className = value ? "" + el.className + " " + this.args[0] : elClass.replace(" " + this.args[0] + " ", ' ').trim();
    }
  };

  Rivets["public"].binders['*'] = function(el, value) {
    if (value != null) {
      return el.setAttribute(this.type, value);
    } else {
      return el.removeAttribute(this.type);
    }
  };

  Rivets["public"].formatters['call'] = function() {
    var args, value;
    value = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return value.call.apply(value, [this].concat(__slice.call(args)));
  };

  Rivets["public"].adapters['.'] = {
    id: '_rv',
    counter: 0,
    weakmap: {},
    weakReference: function(obj) {
      var id, _base, _name;
      if (!obj.hasOwnProperty(this.id)) {
        id = this.counter++;
        Object.defineProperty(obj, this.id, {
          value: id
        });
      }
      return (_base = this.weakmap)[_name = obj[this.id]] || (_base[_name] = {
        callbacks: {}
      });
    },
    cleanupWeakReference: function(ref, id) {
      if (!Object.keys(ref.callbacks).length) {
        if (!(ref.pointers && Object.keys(ref.pointers).length)) {
          return delete this.weakmap[id];
        }
      }
    },
    stubFunction: function(obj, fn) {
      var map, original, weakmap;
      original = obj[fn];
      map = this.weakReference(obj);
      weakmap = this.weakmap;
      return obj[fn] = function() {
        var callback, k, r, response, _i, _len, _ref1, _ref2, _ref3, _ref4;
        response = original.apply(obj, arguments);
        _ref1 = map.pointers;
        for (r in _ref1) {
          k = _ref1[r];
          _ref4 = (_ref2 = (_ref3 = weakmap[r]) != null ? _ref3.callbacks[k] : void 0) != null ? _ref2 : [];
          for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
            callback = _ref4[_i];
            callback();
          }
        }
        return response;
      };
    },
    observeMutations: function(obj, ref, keypath) {
      var fn, functions, map, _base, _i, _len;
      if (Array.isArray(obj)) {
        map = this.weakReference(obj);
        if (map.pointers == null) {
          map.pointers = {};
          functions = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
          for (_i = 0, _len = functions.length; _i < _len; _i++) {
            fn = functions[_i];
            this.stubFunction(obj, fn);
          }
        }
        if ((_base = map.pointers)[ref] == null) {
          _base[ref] = [];
        }
        if (__indexOf.call(map.pointers[ref], keypath) < 0) {
          return map.pointers[ref].push(keypath);
        }
      }
    },
    unobserveMutations: function(obj, ref, keypath) {
      var idx, map, pointers;
      if (Array.isArray(obj) && (obj[this.id] != null)) {
        if (map = this.weakmap[obj[this.id]]) {
          if (pointers = map.pointers[ref]) {
            if ((idx = pointers.indexOf(keypath)) >= 0) {
              pointers.splice(idx, 1);
            }
            if (!pointers.length) {
              delete map.pointers[ref];
            }
            return this.cleanupWeakReference(map, obj[this.id]);
          }
        }
      }
    },
    observe: function(obj, keypath, callback) {
      var callbacks, desc, value;
      callbacks = this.weakReference(obj).callbacks;
      if (callbacks[keypath] == null) {
        callbacks[keypath] = [];
        desc = Object.getOwnPropertyDescriptor(obj, keypath);
        if (!((desc != null ? desc.get : void 0) || (desc != null ? desc.set : void 0))) {
          value = obj[keypath];
          Object.defineProperty(obj, keypath, {
            enumerable: true,
            get: function() {
              return value;
            },
            set: (function(_this) {
              return function(newValue) {
                var cb, map, _i, _len, _ref1;
                if (newValue !== value) {
                  _this.unobserveMutations(value, obj[_this.id], keypath);
                  value = newValue;
                  if (map = _this.weakmap[obj[_this.id]]) {
                    callbacks = map.callbacks;
                    if (callbacks[keypath]) {
                      _ref1 = callbacks[keypath].slice();
                      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        cb = _ref1[_i];
                        if (__indexOf.call(callbacks[keypath], cb) >= 0) {
                          cb();
                        }
                      }
                    }
                    return _this.observeMutations(newValue, obj[_this.id], keypath);
                  }
                }
              };
            })(this)
          });
        }
      }
      if (__indexOf.call(callbacks[keypath], callback) < 0) {
        callbacks[keypath].push(callback);
      }
      return this.observeMutations(obj[keypath], obj[this.id], keypath);
    },
    unobserve: function(obj, keypath, callback) {
      var callbacks, idx, map;
      if (map = this.weakmap[obj[this.id]]) {
        if (callbacks = map.callbacks[keypath]) {
          if ((idx = callbacks.indexOf(callback)) >= 0) {
            callbacks.splice(idx, 1);
            if (!callbacks.length) {
              delete map.callbacks[keypath];
              this.unobserveMutations(obj[keypath], obj[this.id], keypath);
            }
          }
          return this.cleanupWeakReference(map, obj[this.id]);
        }
      }
    },
    get: function(obj, keypath) {
      return obj[keypath];
    },
    set: function(obj, keypath, value) {
      return obj[keypath] = value;
    }
  };

  Rivets.factory = function(sightglass) {
    Rivets.sightglass = sightglass;
    Rivets["public"]._ = Rivets;
    return Rivets["public"];
  };

  if (typeof (typeof module !== "undefined" && module !== null ? module.exports : void 0) === 'object') {
    module.exports = Rivets.factory(__webpack_require__(1));
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sightglass) {
      return this.rivets = Rivets.factory(sightglass);
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    this.rivets = Rivets.factory(sightglass);
  }

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)(module)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<!-- Engine Renderer Template -->\r\n<!-- Top level div handler to embed test engine into rendering app -->\r\n<div class=\"mcq-body\" id=\"mcq-engine\">\r\n  <main rv-addclass='content.theme'>\r\n    <section class=\"instructions\" rv-each-instruction=\"content.instructions\">\r\n      <p class=\"instruction\" rv-text=\"instruction\"></p>\r\n    </section>\r\n    <section class=\"stimuli\">\r\n      <figure class=\"stimuli\" rv-each-stimuli=\"content.stimuli\"></figure>\r\n    </section>\r\n    <section class=\"interactions mt-md\">\r\n      <section class=\"interaction\" rv-id=\"interaction.id\" rv-each-interaction=\"content.interactions\">\r\n        <p class=\"question-text\" rv-text=\"interaction.questiontext\"></p>\r\n        <!-- prompt Will be shown only if prompt text is available for interaction /-->\r\n        <p class=\"prompt\"></p>\r\n        <ul class=\"options list-unstyled nested-list\" id=\"mcq-mr\" rv-if=\"interaction.MCQMR\">\r\n          <li class=\"line-item option\" rv-each-optionitem=\"interaction.options | propertyList\">\r\n            <label class=\"line-item-label checkbox input-label align-2-item\" rv-for=\"%optionitem%   | idcreator 'option'\">\r\n              <span class=\"pull-left\">\r\n                <i></i>\r\n                </span>\r\n              <span class='option-content' rv-text=\"optionitem.value\">{optionitem.value}</span>\r\n            </label>\r\n            <input class=\"option option-value mcq-option option-input\" rv-id=\"%optionitem%   | idcreator 'option'\" type=\"checkbox\" rv-name=\"optionitem.key\"\r\n            rv-id=\"optionitem.key\" data-val=\"{optionitem.key}\" autocomplete=\"off\" />        \r\n          </li>\r\n        </ul>        \r\n        <ul class=\"options list-unstyled nested-list\" id=\"mcq-sr\"  rv-if=\"interaction.MCQSR\">\r\n          <li class=\"line-item enabled\" rv-each-element=\"interaction.options | propertyList\">\r\n            <label class=\"line-item-label radio radio-lg\" rv-for=\"element.key\">\r\n              <span>\r\n                <i></i>\r\n              </span>\r\n              <span class=\"content option-content\" rv-text=\"element.value\"></span>\r\n            </label>\r\n            <input type=\"radio\" name=\"optionsRadios\" class=\"mcq-option\" rv-id=\"element.key\" rv-value=\"element.value\">\r\n          </li>\r\n        </ul>\r\n      </section>\r\n    </section>\r\n    <section class=\"feedback\">\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-12 col-md-12\">\r\n          <div class=\"alert alert-success align-2-item\" role=\"alert\" rv-show=\"showFeedback.correct\">\r\n            <span>\r\n              <i class=\"fa fa-2x fa-smile-o\"></i>&nbsp;</span>\r\n            <span rv-text=\"feedback.global.correct\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-12 col-md-12\">\r\n          <div class=\"alert alert-danger align-2-item\" role=\"alert\" rv-show=\"showFeedback.incorrect\">\r\n            <span>\r\n              <i class=\"fa fa-2x fa-meh-o\"></i>\r\n            </span>&nbsp;\r\n            <span rv-text=\"feedback.global.incorrect\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-sm-6 col-md-6\">\r\n          <div class=\"alert alert-warning align-2-item\" role=\"alert\" rv-show=\"showFeedback.empty\">\r\n            <span>\r\n              <i class=\"fa fa-2x fa-meh-o\"></i>&nbsp;</span>\r\n            <span rv-text=\"feedback.global.empty\"></span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </main>\r\n</div>";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./mcq.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./mcq.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(undefined);
// imports


// module
exports.push([module.i, "/*******************************************************\r\n * \r\n * ----------------------\r\n * Engine Renderer Styles\r\n * ----------------------\r\n *\r\n * These styles do not include any product-specific branding\r\n * and/or layout / design. They represent minimal structural\r\n * SCSS which is necessary for a default rendering of an\r\n * DND2 activity\r\n *\r\n * The styles are linked/depending on the presence of\r\n * certain elements (classes / ids / tags) in the DOM (as would\r\n * be injected via a valid DND2 layout HTML and/or dynamically\r\n * created by the DND2 engine JS)\r\n *\r\n *\r\n *******************************************************/\nmain {\n  margin: 20px;\n  font-size: 1.3em; }\n\n.instructions {\n  color: #5c5c5c;\n  font-style: italic; }\n\n.color-lightgray {\n  color: #5c5c5c; }\n\n.mt-md {\n  margin-top: 20px; }\n\nul {\n  list-style: none; }\n\n.option-content {\n  color: #494949;\n  font-weight: 500;\n  margin: 0 0 0 10px; }\n\n.question-text {\n  color: #414040;\n  padding-bottom: 10px;\n  font-weight: 700; }\n\n.mcq-option {\n  position: absolute;\n  left: -999px; }\n\n#mcq-sr {\n  position: relative; }\n  #mcq-sr li {\n    background-color: #f7fbff;\n    padding-left: 10px;\n    position: static;\n    border: 1px solid #dddddd;\n    margin-top: 15px; }\n    #mcq-sr li:hover {\n      background: #fdf9e6;\n      cursor: pointer; }\n    #mcq-sr li.highlight {\n      background-color: #f7fbff;\n      border-radius: 6px;\n      border-bottom: 1px solid #dddddd; }\n      #mcq-sr li.highlight i {\n        border-color: #3276b1; }\n        #mcq-sr li.highlight i:after {\n          opacity: 1; }\n    #mcq-sr li i {\n      height: 2.6em;\n      width: 2.6em;\n      border-radius: 50%;\n      display: block;\n      outline: 0;\n      border: 1px solid #bdbdbd;\n      background: #ffffff;\n      padding: 10px;\n      position: relative; }\n      #mcq-sr li i:after {\n        background-color: #3276b1;\n        content: '';\n        border-radius: 50%;\n        height: 1.7em;\n        width: 1.7em;\n        top: .41em;\n        left: .40em;\n        position: absolute;\n        opacity: 0; }\n    #mcq-sr li .radio {\n      font-size: 1em;\n      color: #3b3b3b;\n      cursor: pointer;\n      text-align: left;\n      display: flex;\n      align-items: center; }\n      #mcq-sr li .radio input {\n        position: absolute;\n        left: -9999px; }\n      #mcq-sr li .radio .option-value {\n        position: static !important; }\n        #mcq-sr li .radio .option-value .input-option {\n          width: 80%; }\n      #mcq-sr li .radio .correct-answer {\n        font-weight: 700; }\n      #mcq-sr li .radio div.option-value {\n        display: inline-block; }\n    #mcq-sr li.wrong i {\n      border-color: red; }\n      #mcq-sr li.wrong i:after {\n        opacity: 0.7;\n        background-color: #ffffff;\n        content: \"\\F00D\";\n        color: red;\n        font-family: fontawesome;\n        font-size: 1.5em;\n        position: absolute;\n        left: 0.46em;\n        top: 0.10em;\n        font-weight: 400;\n        font-style: normal;\n        height: 1em;\n        width: 1em; }\n    #mcq-sr li.correct i {\n      border-color: green; }\n      #mcq-sr li.correct i:after {\n        opacity: 0.7;\n        content: \"\\F00C\";\n        color: green;\n        background-color: #ffffff;\n        font-family: fontawesome;\n        font-size: 1.4em;\n        position: absolute;\n        left: 0.41em;\n        top: 0.20em;\n        font-weight: 400;\n        font-style: normal;\n        height: 1.2em;\n        width: 1.2em; }\n  #mcq-sr ul li .optionlabel {\n    width: 100%; }\n\n#mcq-mr {\n  position: relative; }\n  #mcq-mr li {\n    min-height: 2.8em;\n    background-color: #f7fbff;\n    padding-left: 10px;\n    position: static;\n    border: 1px solid #dddddd;\n    margin-top: 15px; }\n    #mcq-mr li:hover {\n      background: #fdf9e6;\n      cursor: pointer; }\n    #mcq-mr li.highlight {\n      background-color: #f7fbff;\n      border-radius: 6px;\n      border-bottom: 1px solid #dddddd; }\n      #mcq-mr li.highlight i {\n        border-color: #3276b1; }\n        #mcq-mr li.highlight i:after {\n          opacity: 1; }\n    #mcq-mr li i {\n      height: 2.6em;\n      width: 2.6em;\n      border-radius: 0;\n      position: relative;\n      top: 0;\n      left: 0;\n      display: block;\n      outline: 0;\n      border: 1px solid #bdbdbd;\n      background: #ffffff; }\n      #mcq-mr li i:after {\n        background-color: #3276b1;\n        content: '';\n        border-radius: 0;\n        height: 1.6em;\n        width: 1.6em;\n        top: .45em;\n        left: .45em;\n        position: absolute;\n        opacity: 0; }\n    #mcq-mr li .checkbox {\n      font-size: 1em;\n      line-height: 2em;\n      color: #3b3b3b;\n      cursor: pointer; }\n      #mcq-mr li .checkbox input {\n        position: absolute;\n        left: -999px; }\n    #mcq-mr li.wrong i {\n      border-color: red; }\n      #mcq-mr li.wrong i:after {\n        opacity: 0.7;\n        background-color: #ffffff;\n        content: \"\\F00D\";\n        color: red;\n        font-family: fontawesome;\n        font-size: 1.8em;\n        position: absolute;\n        left: 0.31em;\n        top: 0.11em;\n        font-weight: 400;\n        font-style: normal;\n        height: 1em;\n        width: 1em; }\n    #mcq-mr li.correct i {\n      border-color: green; }\n      #mcq-mr li.correct i:after {\n        opacity: 0.7;\n        background-color: #ffffff;\n        content: \"\\F00C\";\n        color: green;\n        font-family: fontawesome;\n        font-size: 1.8em;\n        position: absolute;\n        left: 0.21em;\n        top: 0.11em;\n        font-weight: 400;\n        font-style: normal;\n        height: 1em;\n        width: 1em; }\n\n.feedback .alert-sucess {\n  background-color: #f2fdee; }\n\n.feedback .alert-danger {\n  background-color: #fdeeee; }\n\n.align-2-item {\n  display: flex;\n  align-items: center; }\n\n.disable-li-hover {\n  cursor: default; }\n  .disable-li-hover:hover {\n    background-color: #f7fbff !important;\n    cursor: default !important; }\n\nli:hover {\n  background: #fdf9e6; }\n\n.main-dark {\n  background-color: #222222; }\n  .main-dark .instructions {\n    color: #ffffff; }\n  .main-dark .question-text {\n    color: #ffffff; }\n  .main-dark .option-content {\n    color: #eae9e9; }\n  .main-dark .feedback .alert-success {\n    background-color: #363636;\n    color: #40fd21;\n    border: 1px solid #494949; }\n  .main-dark .feedback .alert-danger {\n    background-color: #363636;\n    color: #ff3b3b;\n    border: 1px solid #494949; }\n  .main-dark #mcq-sr li {\n    background-color: #363636;\n    border: 1px solid #494949; }\n    .main-dark #mcq-sr li:hover {\n      background: #1d1d1d;\n      cursor: pointer; }\n    .main-dark #mcq-sr li.highlight {\n      background-color: black;\n      border-bottom: 1px solid #494949;\n      color: #1d1d1d; }\n      .main-dark #mcq-sr li.highlight i {\n        border: 1px solid #44bafe; }\n      .main-dark #mcq-sr li.highlight:after span {\n        color: #eae9e9; }\n    .main-dark #mcq-sr li i {\n      border: 1px solid #5c5c5c;\n      background: #363636; }\n      .main-dark #mcq-sr li i:after {\n        background-color: #44bafe;\n        border: 1px solid #44bafe; }\n    .main-dark #mcq-sr li .radio {\n      color: #eae9e9; }\n    .main-dark #mcq-sr li.wrong i:after {\n      color: #ff3b3b;\n      background: #363636;\n      border: none; }\n    .main-dark #mcq-sr li.correct i:after {\n      color: #40fd21;\n      background: #363636;\n      border: none; }\n  .main-dark #mcq-mr li {\n    background-color: #363636;\n    border: 1px solid #5c5c5c; }\n    .main-dark #mcq-mr li:hover {\n      background: #1d1d1d; }\n    .main-dark #mcq-mr li.highlight {\n      background-color: black;\n      border-bottom: 1px solid #494949;\n      color: #1d1d1d; }\n      .main-dark #mcq-mr li.highlight i {\n        border: 1px solid #44bafe; }\n    .main-dark #mcq-mr li i {\n      border: 1px solid #5c5c5c;\n      background: #363636; }\n      .main-dark #mcq-mr li i:after {\n        background-color: #44bafe;\n        border: 1px solid #44bafe; }\n    .main-dark #mcq-mr li .checkbox {\n      color: #6e6c6c; }\n    .main-dark #mcq-mr li.wrong i:after {\n      background: #363636;\n      color: #ff3b3b;\n      border: none; }\n    .main-dark #mcq-mr li.correct i:after {\n      background: #363636;\n      color: #40fd21;\n      border: none; }\n  .main-dark li:hover {\n    background: #1d1d1d; }\n  .main-dark .disable-li-hover:hover {\n    background-color: #363636 !important; }\n\n.align-2-item {\n  display: flex;\n  align-items: center; }\n\n.disable-li-hover {\n  cursor: default; }\n\n.main-light {\n  background-color: #f6f6f6; }\n  .main-light .instructions {\n    color: #535353; }\n  .main-light .question-text {\n    color: #535353; }\n  .main-light .option-content {\n    color: #3b3b3b; }\n  .main-light .feedback .alert-success {\n    background-color: #f2fdee;\n    border: 1px solid #dbdbdb;\n    color: #188d2c; }\n  .main-light .feedback .alert-danger {\n    background-color: #fdeeee;\n    border: 1px solid #ffe0e0;\n    color: #e30e0e; }\n  .main-light #mcq-sr li {\n    background-color: #ffffff;\n    border: 1px solid #dbdbdb; }\n    .main-light #mcq-sr li:hover {\n      background: #f2fef4;\n      cursor: pointer; }\n    .main-light #mcq-sr li.highlight {\n      background-color: #f2fef4;\n      border-radius: 6px;\n      border-bottom: 1px solid #dbdbdb; }\n      .main-light #mcq-sr li.highlight i {\n        border-color: #2e9940; }\n    .main-light #mcq-sr li i {\n      border: 1px solid #dbdbdb;\n      background: #ffffff; }\n      .main-light #mcq-sr li i:after {\n        background-color: #44bafe; }\n    .main-light #mcq-sr li .radio {\n      color: #ffffff; }\n  .main-light #mcq-sr.wrong i {\n    border-color: #e30e0e; }\n    .main-light #mcq-sr.wrong i:after {\n      background-color: #ffffff;\n      color: #e30e0e; }\n  .main-light #mcq-sr.correct i {\n    border-color: #188d2c; }\n    .main-light #mcq-sr.correct i:after {\n      color: #188d2c;\n      background-color: #ffffff; }\n  .main-light #mcq-mr li {\n    background-color: #ffffff;\n    border: 1px solid #dbdbdb; }\n    .main-light #mcq-mr li:hover {\n      background: #f2fef4; }\n    .main-light #mcq-mr li.highlight {\n      background-color: #f2fef4;\n      border-radius: 6px;\n      border-bottom: 1px solid #dbdbdb; }\n      .main-light #mcq-mr li.highlight i {\n        border-color: #2e9940; }\n    .main-light #mcq-mr li i {\n      border: 1px solid #dbdbdb;\n      background: #ffffff; }\n      .main-light #mcq-mr li i:after {\n        background-color: #44bfae; }\n    .main-light #mcq-mr li .checkbox {\n      color: #3b3b3b; }\n    .main-light #mcq-mr li.wrong i {\n      border-color: #e30e01; }\n      .main-light #mcq-mr li.wrong i:after {\n        background-color: #ffffff;\n        color: #e30e01;\n        border: none; }\n    .main-light #mcq-mr li.correct i {\n      border-color: #188d2c; }\n      .main-light #mcq-mr li.correct i:after {\n        background-color: #ffffff;\n        color: #188d2c;\n        border: none; }\n  .main-light li:hover {\n    background: #f2fef4; }\n  .main-light .disable-li-hover:hover {\n    background-color: #dbdbdb !important;\n    cursor: default !important; }\n\n.align-2-item {\n  display: flex;\n  align-items: center; }\n\n.disable-li-hover {\n  cursor: default; }\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(13);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mcq_responseProcessor__ = __webpack_require__(2);
/* global $ */


class McqEvents {
    constructor(mcqObj) {
        this.McqInstance = mcqObj;
        this.mcqResponseProcessor = new __WEBPACK_IMPORTED_MODULE_0__mcq_responseProcessor__["a" /* default */](mcqObj);
    }

    bindEvents() {
        let __remove;
        let __handleCheckboxClick;
        let __handleRadioButtonClick;

        __remove = (arr, value) => {

            let found = arr.indexOf(value);

            if (found !== -1) {
                arr.splice(found, 1);
            }
        };
        /**
        * Function to handle checkbox click.
        */
        __handleCheckboxClick = event => {
            let currentTarget = event.currentTarget;
            let currentInteractionId = currentTarget.parentElement.parentElement.parentElement.getAttribute('id');
            let currentChoice = currentTarget.getAttribute('name');

            if (currentTarget.checked) {
                $(currentTarget).closest('li').addClass('highlight');
                console.log('not loading', this.McqInstance);
                if (!this.McqInstance.userAnswers[currentInteractionId]) {
                    this.McqInstance.userAnswers[currentInteractionId] = [];
                }
                this.McqInstance.userAnswers[currentInteractionId].push(currentChoice);
            } else {
                __remove(this.McqInstance.userAnswers[currentInteractionId], currentChoice);
                $(currentTarget).closest('li').removeClass('highlight');
            }
            //$(document).triggerHandler('userAnswered');
            this.mcqResponseProcessor.savePartial(currentInteractionId, this.McqInstance);
        };

        /** Function to handle radio button click.*/
        __handleRadioButtonClick = event => {
            console.log('event called');
            /* var currentTarget = event.currentTarget;
             var currentInteractionId = currentTarget.parentElement.parentElement.getAttribute('id');
             $('#mcq-sr li').removeClass('highlight');
             $(currentTarget).addClass('highlight');
            // currentTarget = currentTarget.value.replace(/^\s+|\s+$/g, '');
             // Save new Answer in memory. //
             __content.userAnswers[currentInteractionId] = $(event.currentTarget).children('input').attr('id');
            //not in use
             __state.radioButtonClicked = true;
             __content.feedbackJSON = __feedback;
             __savePartial(currentInteractionId); */
        };

        // Registering the checkbox click handler for MCQMR
        $('input[id^=option]').change(__handleCheckboxClick);

        // Registering the radio click handler for MCQSR
        // $('.options label.radio').change(__handleRadioButtonClick);
        $(document).on('click', '.options li.enabled', __handleRadioButtonClick);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (McqEvents);

/***/ })
/******/ ]);
});
//# sourceMappingURL=mcq.js.map