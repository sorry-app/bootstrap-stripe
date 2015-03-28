// Define the jQuery Plugin
+function ($) {
	'use strict';

	// BOOSTRAP STRIPE CLASS DEFINITION
	// ================================

	var StripeForm = function (element, options) {
	    this.$element  = $(element)
	    this.options   = $.extend({}, StripeForm.DEFAULTS, options)

	    // Get the pubiic stripe key from the data attribute which was passed in.
	    this.pk 	   = this.$element.data('stripe-form')

		// Configure the stripe connection with the supplied key.
		Stripe.setPublishableKey(this.pk);
	}

	StripeForm.VERSION = '0.0.0'

	StripeForm.DEFAULTS = {}

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