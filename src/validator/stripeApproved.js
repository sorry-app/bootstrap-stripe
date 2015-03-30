(function($) {
    'use strict';
    
    FormValidation.Validator.stripe_approved = {
        /**
         * A validator which checks that a field doesn't have any Stripe.js
         * errors attached to it. If it does then it returns invalid along
         * with the error message which was handed back by the API.
         *
         * @param {FormValidation.Base} validator The validator plugin instance
         * @param {jQuery} $field Field element
         * @param {Object} options Can consist of the following keys:
         * - response_key: The name of the response key 'param' which is returned by Stripe.
         * @returns {Boolean}
         */
        validate: function(validator, $field, options) {
            // See if we can match the key in the response error.
            if ("error" in validator.$form.data('bs.stripeForm').response && validator.$form.data('bs.stripeForm').response.error.param == options.response_key) {
                // The key matched, return the validation error message from the API reponse.
                return {
                    valid: false,
                    message: validator.$form.data('bs.stripeForm').response.error.message
                }
            } else {
                // No validation error found in the api response
                // for this given key so we can return true.
                return true
            }
        }
    };
}(jQuery));