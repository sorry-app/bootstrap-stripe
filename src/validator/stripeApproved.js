/**
 * blank validator
 *
 * @author      https://twitter.com/nghuuphuoc
 * @copyright   (c) 2013 - 2015 Nguyen Huu Phuoc
 * @license     http://formvalidation.io/license/
 */
(function($) {
    'use strict';
    
    FormValidation.Validator.stripe_approved = {
        /**
         * Placeholder validator that can be used to display a custom validation message
         * returned from the server
         * Example:
         *
         * (1) a "blank" validator is applied to an input field.
         * (2) data is entered via the UI that is unable to be validated client-side.
         * (3) server returns a 400 with JSON data that contains the field that failed
         *     validation and an associated message.
         * (4) ajax 400 call handler does the following:
         *
         *      bv.updateMessage(field, 'blank', errorMessage);
         *      bv.updateStatus(field, 'INVALID');
         *
         * @see https://github.com/formvalidation/formvalidation/issues/542
         * @see https://github.com/formvalidation/formvalidation/pull/666
         * @param {FormValidation.Base} validator The validator plugin instance
         * @param {jQuery} $field Field element
         * @param {Object} options Can consist of the following keys:
         * - message: The invalid message
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