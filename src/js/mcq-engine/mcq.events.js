/* global $ */
import McqResponseProcessor from './mcq.responseProcessor';

class McqEvents {
constructor(mcqObj) {
    this.McqInstance = mcqObj;
    this.mcqResponseProcessor = new McqResponseProcessor(mcqObj);
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
  __handleCheckboxClick = (event) => {
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
         console.log(this.McqInstance.userAnswers, currentInteractionId, currentChoice);
    } else {
        __remove(this.McqInstance.userAnswers[currentInteractionId], currentChoice);
         $(currentTarget).closest('li').removeClass('highlight');
    }
     this.mcqResponseProcessor
     .savePartial(currentInteractionId, this.McqInstance);
   };

     /** Function to handle radio button click.*/
    __handleRadioButtonClick = (event) => {
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

export default McqEvents;
