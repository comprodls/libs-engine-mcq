/* global $ */
import rivets from 'rivets';
import mcqTemplateRef from '../../html/mcq.html';
import '../../scss/mcq.scss';
const initializeRivets = Symbol('initializeRivets');

/*
 * Constants.
 */
export const Constants = {
    TEMPLATES: {
        /* Regular MCQ Layout */
        MCQ: mcqTemplateRef
    },
    THEMES: {
        MCQ: 'main',
        MCQ_LIGHT: 'main-light',
        MCQ_DARK: 'main-dark'
    },
    LAYOUT_COLOR: {
        'BG': {
            'MCQ': '#FFFFFF',
            'MCQ_LIGHT': '#f6f6f6',
            'MCQ_DARK': '#222222'
        }
    },
    STATEMENT_STARTED: 'started',
    STATEMENT_ANSWERED: 'answered',
    STATEMENT_INTERACTED: 'interacted'
};

export let InteractionIds = [];

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

    resetView() {
        $('.interactions ul li').removeClass('highlight');
        $('.interactions ul li').addClass('enabled');
    }

    clearGrades() {
        this.model.feedbackState = {
                'correct': false,
                'incorrect': false,
                'empty': false
        };
    }

    bindData() {
        this[initializeRivets]();
    }

    [initializeRivets]() {
        rivets.formatters.propertyList = function (obj) {
            return (function () {
                let properties = [];

                for (let key in obj) {
                    properties.push({ key: key, value: obj[key] });
                };
                return properties;
            })();
        };

        rivets.formatters.idcreator = function (index, idvalue) {
            return idvalue + index;
        };

        rivets.binders['src-strict'] = function (el, value) {
            var img = new Image();

            img.onload = function () {
                $(el).attr('src', value);
            };

            img.src = value;
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
        let data = {
            content: this.model,
            feedback: this.model.feedback,
            showFeedback: this.model
        };

        /*Bind the data to template using rivets*/
        rivets.bind($('#mcq-engine'), data);
    }
}
export { McqModelAndView };
