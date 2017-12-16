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
         let currentTarget = event.currentTarget;
         let currentInteractionId = currentTarget.parentElement.parentElement.getAttribute('id');

         console.log('Called handleButton');
         $('#mcq-sr li').removeClass('highlight');
         $(currentTarget).addClass('highlight');
         this.McqInstance.userAnswers[currentInteractionId] = $(event.currentTarget).children('input').attr('id');
         console.log(JSON.stringify(this.McqInstance.userAnswers, null, 4));
         this.mcqResponseProcessor
         .savePartial(currentInteractionId, this.McqInstance);
     };

   // Registering the checkbox click handler for MCQMR
   $('input[id^=option]').change(__handleCheckboxClick);

       // Registering the radio click handler for MCQSR
       // $('.options label.radio').change(__handleRadioButtonClick);
    $(document).on('click', '.options li.enabled', __handleRadioButtonClick);
 }
}

export default McqEvents;
