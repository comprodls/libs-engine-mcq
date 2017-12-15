/**
 * Function to generate XAPI statements.
 */
 export default function generateStatement(verb) {
    var statement = {
            'timestamp': new Date(),
            'verb': {
                'id': 'http://comprotechnologies.com/expapi/verbs/' + verb,
                'display': {
                    'und': verb
                }
            }
        };

    return statement;
}
