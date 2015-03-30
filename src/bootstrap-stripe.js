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

	    // Create a place to store the stripe response.
	    this.response = {}

		// Configure the stripe connection with the supplied key.
		Stripe.setPublishableKey(this.pk);

		// Configure the validator for the form.
		this.$element.formValidation({
		  framework: 'bootstrap',
		  fields: {
		    number: {
		      selector: '[data-stripe="number"]',
		      validators: {
		        notEmpty: {
		            message: 'The credit card number is required'
		        },
		        creditCard: {
		            message: 'The credit card number is not valid'
		        },
		        stripe_approved: {
		        	response_key: 'number'
		        }
		      }
		    },
		   exp_month: {
		        selector: '[data-stripe="exp-month"]',
		        validators: {
		            notEmpty: {
		                message: 'The expiration month is required'
		            },
		            digits: {
		                message: 'The expiration month can contain digits only'
		            },
				    stripe_approved: {
				      response_key: 'exp_month'
				    }
		        }
		    },
		    exp_year: {
		        selector: '[data-stripe="exp-year"]',
		        validators: {
		            notEmpty: {
		                message: 'The expiration year is required'
		            },
		            digits: {
		                message: 'The expiration year can contain digits only'
		            },
				    stripe_approved: {
				      response_key: 'exp_year'
				    }		            
		        }
		    },
		    cvv: {
		        selector: '[data-stripe="cvc"]',
		        validators: {
		            notEmpty: {
		                message: 'The CVV number is required'
		            },
					cvv: {
                        message: 'The CVV number is not valid'
                    },	            
		          	stripe_approved: {
		        	   response_key: 'cvc'
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

		// Attach a local copy of any errors to the corresponding field data.
		this.response = response

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