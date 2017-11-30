/* global $ */
import MCQTransformer from './mcq.transformer';
import {McqModelAndView, Constants} from './mcq.modelview';
import McqEvents from './mcq.events';
import McqResponseProcessor from './mcq.responseProcessor';

const load = Symbol('loadMCQ');
const transform = Symbol('transformMCQ');
const renderView = Symbol('renderMCQ');
const bindEvents = Symbol('bindEvents');

class mcq6 {
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
          callback({backgroundColor: Constants.LAYOUT_COLOR.BG[htmlLayout]});
      }
    }

    [load]() {
        this[transform]();
        this[renderView]();
        this[bindEvents]();
     }

     [transform]() {
        let mcqTransformer = new MCQTransformer(this.content, this.params, this.theme);

        this.mcqModel = mcqTransformer.transform();
    }
    [renderView]() {
        let mcqModelAndView = new McqModelAndView(this.mcqModel);
        let htmltemplate = mcqModelAndView.template;

        $(this.elRoot).html(htmltemplate);
        mcqModelAndView.bindData();
    }
    [bindEvents]() {
        let mcqEvents = new McqEvents(this);

        mcqEvents.bindEvents();
    }

    /**
     * ENGINE-SHELL Interface
     * @return {String} - Configuration
     */
    getConfig() {
        //return utils.__config;
    }

    /**
     * ENGINE-SHELL Interface
     * @return {Boolean} - The current state (Activity Submitted/ Partial Save State.) of activity.
     */
    getStatus() {
        //return utils.__state.activitySubmitted || utils.__state.activityPariallySubmitted;
    }

    /**
    * Bound to click of Activity submit button.
    */
    handleSubmit() {
        let mcqResponseProcessor = new McqResponseProcessor(this);

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
        let mcqResponseProcessor = new McqResponseProcessor(this);

        /* Show last saved answers. */
        $('input[id^=option]').attr('disabled', true);
        mcqResponseProcessor.markAnswers();
    }

    showFeedback() {
        let mcqResponseProcessor = new McqResponseProcessor(this);

        mcqResponseProcessor.feedbackProcessor();
    }

    resetAnswers() {
        console.log('reset called');
    }

    clearGrades() {
        console.log('clear grades called');
    }
}

export default mcq6;
