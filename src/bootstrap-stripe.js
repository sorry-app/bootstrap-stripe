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

	    // Get the pubiic stripe key from the data attribute which was passed in.
	    this.pk 	   = this.$element.data('stripe-form')

		// Configure the stripe connection with the supplied key.
		Stripe.setPublishableKey(this.pk);

		// Bind the forms submit event to the handler.
		this.$element.on('submit.bs.stripeForm', $.proxy(this.submit, this))
	}

	StripeForm.VERSION = '0.0.0'

	StripeForm.DEFAULTS = {}

	StripeForm.prototype.submit = function() {
		// TODO: Add Disabled/Loading state to the forms button.
		// TODO: Reset the forms validation state so it looks valid.

		// Submit the form through the stripe API library
		// binding the async request to a callback method on the form.
		Stripe.card.createToken(this.$element, $.proxy(this.callback, this));

		// Return false to prevent the form
		// from actually submitting to the server by itself.
		return false
	}

	StripeForm.prototype.callback = function(status, response) {
		// Check to see if any error ocurred during
		// the Stripe API request.
		if (response.error) {
			// An error has occurred.
			// Add an error class to the credit card field.
			// TODO: Should we use some 3rd party Bootstrap Validation lib?
			// Get a reference to the field container
			var container = this.$element.find('input[data-stripe="' + response.error.param.replace('_', '-') + '"]').parent()
			// Add a class to the container.
			container.addClass('has-error')
			// Inkect a validation error message.
			container.append('<span class="help-block">' + response.error.message + '</span>')

			// TODO: Reset the state of the submit/loading button.
		} else {
			// No errors ocurred, the request was a success.
			// response contains id and card, which contains additional card details
    		var token = response.id;

    		// Set the hidden card token field on the form with the value
    		// passed back from the API request.
    		this.$target.val(token)

    		// Submit the form.
    		// NOTE: We call submit direct on the DOM 
    		// element, to prevent us getting into a submit() handler loop.
    		this.$element.get(0).submit();
		}
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