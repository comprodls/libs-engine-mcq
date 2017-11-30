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
}
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
            showFeedback: this.model.feedbackState
        };

        /*Bind the data to template using rivets*/
        rivets.bind($('#mcq-engine'), data);
    }
}
export {McqModelAndView};
