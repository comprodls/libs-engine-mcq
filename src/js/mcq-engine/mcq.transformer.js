/* global $ */

import { Constants } from './mcq.modelview';

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
            feedbackState: {
                'correct': false,
                'incorrect': false,
                'empty': false
            },
            type: '',
            theme: '',
            interactionIds: []
        };
    }

    transform() {
        this[buildModelandViewContent]();
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
        this.mcqModel.theme = Constants.THEMES[themeKey];
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
        //let params = this.params;

        this.mcqModel.stimuli = this.entity.content.stimulus.map(function (element) {
            let tagtype = element['tag'];
            let obj;

            if (tagtype) {
                obj = { 'src': element[tagtype] };
                obj[tagtype] = true;
            }
            if (!obj) {
                obj = element;
            }
            return obj;
        });
    }

    [setFeedback]() {
        this.mcqModel.feedback = this.entity.feedback;
    }
}

export default McqTransformer;
