/**
 * Function to generate XAPI statements.
 */
export default function generateStatement(verb) {
        var statement = {
            'timestamp': new Date(),
            'verb': {
                'id': verb
            }
        };

    return statement;
}
