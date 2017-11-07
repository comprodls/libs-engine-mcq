/* global $ */
/* global jQuery */

import * as utils from './mcq-utils.js';

/**
 *  Engine initialization Class. Provides public functions
 *  -getConfig()
 *  -getStatus()
 */

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
        console.log('==>Layout ', htmlLayout);
        /** 
          * @member {Object}
          * Clone the JSON so that original is preserved.
          */
        this.jsonContent = jQuery.extend(true, {}, jsonContentObj);

        /** 
          * Validation block.
          */
        if (this.jsonContent.content === undefined) {
            if (callback) {
                callback();
            }
            //TODO - In future more advanced schema validations could be done here.        
            return;
        }

        /**
          * Store the adaptor.
          */
        utils.setAdaptor(adaptor);

        /** 
          * @member {String}
          * Apply the content JSON to the htmllayout.
          */
        utils.buildModelandViewContent(jsonContentObj, params);

        $(elRoot).html(utils.__constants.TEMPLATES[htmlLayout]);

        /** 
          * Update the DOM and render the processed HTML - main body of the activity.
          */
        utils.initializeRivets();

        /** 
          * Register the click events
          */
        utils.initializeHandlers();

        /** Inform the shell that initialization is complete */
        if (callback) {
            callback();
        }
    }

    /**
     * ENGINE-SHELL Interface
     * @return {String} - Configuration
     */
    getConfig() {
        return utils.__config;
    }

    /**
     * ENGINE-SHELL Interface
     * @return {Boolean} - The current state (Activity Submitted/ Partial Save State.) of activity.
     */
    getStatus() {
        return utils.__state.activitySubmitted || utils.__state.activityPariallySubmitted;
    }

    handleSubmit() {
        return utils.handleSubmit();
    }

    showGrades() {
        return utils.__markAnswers();
    }

    showFeedback() {
        return utils.showfeedback();
    }
}

export default mcq;
