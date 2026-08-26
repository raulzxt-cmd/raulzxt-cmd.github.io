// JavaScript Document
/*global jQuery:false */
$(function(){
	$("#js-rotating").Morphext({
		animation: "fadeIn", // Overrides default "bounceIn"
		separator: ",", // Overrides default ","
		speed: 3000, // Overrides default 2000
		complete: function () {
			// Overrides default empty function
		}
	});
});
