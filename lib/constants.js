"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var GoogleURl = exports.GoogleURl = function GoogleURl(apiKey) {
	return "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places&callback=initMap&v=weekly";
};