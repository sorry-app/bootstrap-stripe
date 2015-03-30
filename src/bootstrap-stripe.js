// Define the jQuery Plugin
+function ($) {
	'use strict';

	// BOOSTRAP STRIPE CLASS DEFINITION
	// ================================

	var StripeForm = function (element, options) {
		// Get a reference to the element and set the options.
	    this.$element  = $(element)
	    this.options   = $.extend({}, StripeForm.DEFAULTS, options)

	    // Get a reference to the input which will store the card token.
	    this.$target   = this.$element.find('input[name="stripe_card_token"]')

	    // Get a reference to the submit button.
	    this.$button   = this.$element.find('button[type="submit"]')

	    // Get the pubiic stripe key from the data attribute which was passed in.
	    this.pk 	   = this.$element.data('stripe-form')

		// Configure the stripe connection with the supplied key.
		Stripe.setPublishableKey(this.pk);

		// Configure the validator for the form.
		this.$element.formValidation({
		  framework: 'bootstrap',
		  fields: {
		    cc_number: {
		      selector: '[data-stripe="number"]',
		      validators: {
		        notEmpty: {
		            message: 'The credit card number is required'
		        },
		        creditCard: {
		            message: 'The credit card number is not valid'
		        }
		      }
		    },
		   expMonth: {
		        selector: '[data-stripe="exp-month"]',
		        validators: {
		            notEmpty: {
		                message: 'The expiration month is required'
		            },
		            digits: {
		                message: 'The expiration month can contain digits only'
		            },
		            callback: {
		                message: 'Expired',
		                callback: function(value, validator) {
		                    value = parseInt(value, 10);
		                    var year         = validator.getFieldElements('expYear').val(),
		                        currentMonth = new Date().getMonth() + 1,
		                        currentYear  = new Date().getFullYear();
		                    if (value < 0 || value > 12) {
		                        return false;
		                    }
		                    if (year == '') {
		                        return true;
		                    }
		                    year = parseInt(year, 10);
		                    if (year > currentYear || (year == currentYear && value > currentMonth)) {
		                        validator.updateStatus('expYear', 'VALID');
		                        return true;
		                    } else {
		                        return false;
		                    }
		                }
		            }
		        }
		    },
		    expYear: {
		        selector: '[data-stripe="exp-year"]',
		        validators: {
		            notEmpty: {
		                message: 'The expiration year is required'
		            },
		            digits: {
		                message: 'The expiration year can contain digits only'
		            },
		            callback: {
		                message: 'Expired',
		                callback: function(value, validator) {
		                    value = parseInt(value, 10);
		                    var month        = validator.getFieldElements('expMonth').val(),
		                        currentMonth = new Date().getMonth() + 1,
		                        currentYear  = new Date().getFullYear();
		                    if (value < currentYear || value > currentYear + 100) {
		                        return false;
		                    }
		                    if (month == '') {
		                        return false;
		                    }
		                    month = parseInt(month, 10);
		                    if (value > currentYear || (value == currentYear && month > currentMonth)) {
		                        validator.updateStatus('expMonth', 'VALID');
		                        return true;
		                    } else {
		                        return false;
		                    }
		                }
		            }
		        }
		    },
		    cvvNumber: {
		        selector: '[data-stripe="cvc"]',
		        validators: {
		            notEmpty: {
		                message: 'The CVV number is required'
		            }
		        }
		    }
		  },
		  live: 'disabled'
		});

		// Unbind the default validation submission.
        this.$element.unbind('submit.fv');
		// Bind the forms submit event to the handler.
		this.$element.on('submit.fv', $.proxy(this.pre_validate, this))
	}

	StripeForm.VERSION = '0.0.0'

	StripeForm.DEFAULTS = {}

	StripeForm.prototype.pre_validate = function() {
		// Submit the form through the stripe API library
		// binding the async request to a callback method on the form.
		Stripe.card.createToken(this.$element, $.proxy(this.pre_validate_callback, this));

		// Return false to prevent the form
		// from actually submitting to the server by itself.
		return false
	}

	StripeForm.prototype.pre_validate_callback = function(status, response) {
		// No errors ocurred, the request was a success.
		// response contains id and card, which contains additional card details
		var token = response.id;

		// Set the hidden card token field on the form with the value
		// passed back from the API request.
		this.$target.val(token)

		// Invoke the validation method on the form.
		this.$element.data('formValidation').validate();
	}

	// BOOSTRAP STRIPE PLUGIN DEFINITION
	// =================================

	function Plugin(option) {
		return this.each(function () {
			var $this = $(this)
			var data  = $this.data('bs.stripeForm')

			if (!data) $this.data('bs.stripeForm', (data = new StripeForm(this)))
			if (typeof option == 'string') data[option].call($this)
		})
	} 

	var old = $.fn.stripeForm

	$.fn.stripeForm             = Plugin
	$.fn.stripeForm.Constructor = StripeForm


	// BOOSTRAP STRIPE NO CONFLICT
	// ===========================

	$.fn.stripeForm.noConflict = function () {
		$.fn.stripeForm = old
		return this
	}

	// BOOSTRAP STRIPE DATA-API
	// ========================

	$(window).on('load', function () {
		$('form[data-stripe-form^="pk_"]').each(function () {
			var $form = $(this)
			var data = $form.data()

			Plugin.call($form, data)
		})
	})	

}(jQuery);