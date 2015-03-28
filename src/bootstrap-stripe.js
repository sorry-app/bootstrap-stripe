// Define the jQuery Plugin
+function ($) {
	'use strict';

	// BOOSTRAP STRIPE CLASS DEFINITION
	// ================================

	var Stripe = function (element, options) {}

	Stripe.VERSION = '0.0.0'

	// BOOSTRAP STRIPE PLUGIN DEFINITION
	// =================================

	function Plugin(option) {
		return this.each(function () {
			var $this = $(this)
			var data  = $this.data('bs.stripe')

			if (!data) $this.data('bs.stripe', (data = new Stripe(this)))
			if (typeof option == 'string') data[option].call($this)
		})
	} 

	var old = $.fn.stripe

	$.fn.stripe             = Plugin
	$.fn.stripe.Constructor = Stripe


	// BOOSTRAP STRIPE NO CONFLICT
	// ===========================

	$.fn.stripe.noConflict = function () {
		$.fn.stripe = old
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