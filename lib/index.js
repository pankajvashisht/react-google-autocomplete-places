'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.configKey = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Components = require('./Components');

Object.keys(_Components).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _Components[key];
		}
	});
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = require('./constants.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var autocomplete = void 0;
var googleListner = void 0;
var configKey = exports.configKey = function configKey(apiKey) {
	var googleMapsScriptUrl = (0, _constants.GoogleURl)(apiKey);
	if (document.querySelectorAll('script[src="' + googleMapsScriptUrl + '"]').length > 0) {
		return Promise.resolve();
	}

	var googleMapsScript = document.createElement('script');
	googleMapsScript.src = googleMapsScriptUrl;
	document.body.appendChild(googleMapsScript);
	return new Promise(function (resolve) {
		googleMapsScript.addEventListener('load', function () {
			return resolve();
		});
	});
};
var GoogleAutoComplete = function GoogleAutoComplete(_ref) {
	var onChange = _ref.onChange,
	    onAddressSelected = _ref.onAddressSelected,
	    value = _ref.value,
	    _ref$showMap = _ref.showMap,
	    showMap = _ref$showMap === undefined ? false : _ref$showMap,
	    props = _objectWithoutProperties(_ref, ['onChange', 'onAddressSelected', 'value', 'showMap']);

	var currentRef = (0, _react.useRef)(null);

	var _useState = (0, _react.useState)({ lat: '31.4685', lng: '76.2708' }),
	    _useState2 = _slicedToArray(_useState, 2),
	    geolocation = _useState2[0],
	    setGeoLoaction = _useState2[1];

	var loadScript = function loadScript() {
		var apiKey = props.apiKey;

		return configKey(apiKey);
	};

	(0, _react.useEffect)(function () {
		var _props$types = props.types,
		    types = _props$types === undefined ? ['(cities)'] : _props$types,
		    componentRestrictions = props.componentRestrictions,
		    bounds = props.bounds,
		    apiKey = props.apiKey,
		    filterAddress = props.filterAddress,
		    _props$fields = props.fields,
		    fields = _props$fields === undefined ? ['address_components', 'geometry.location', 'place_id', 'formatted_address'] : _props$fields,
		    _props$options = props.options,
		    options = _props$options === undefined ? {} : _props$options;


		var googleConfig = _extends({}, options, {
			types: types,
			bounds: bounds,
			fields: fields
		});

		if (componentRestrictions) {
			config.componentRestrictions = componentRestrictions;
		}

		var initGoogle = function initGoogle() {
			var _window = window,
			    google = _window.google;

			var autocompleteField = currentRef.current;
			autocomplete = new google.maps.places.Autocomplete(autocompleteField, googleConfig);
			googleListner = google.maps.event.addListener(autocomplete, 'place_changed', fillInAddress);
		};
		var fillInAddress = function fillInAddress() {
			var gettingReasult = {};
			var populateAddressData = function populateAddressData(address, addressObj) {
				var addressType = address.types[0];
				if (addressObj.address === addressType) {
					var _place = autocomplete.getPlace();
					var addressValues = addressObj.id === 'address_line_one' ? _place.name : address.long_name;
					if (addressValues) {
						gettingReasult[addressObj.id] = addressValues;
					}
				}
			};
			var addressDetails = [{ address: 'route', id: 'route' }, { address: 'street_number', id: 'street_number' }, { address: 'neighborhood', id: 'neighborhood' }, { address: 'premise', id: 'premise' }, { address: 'locality', id: 'locality' }, { address: 'administrative_area_level_1', id: 'address_line_two' }, { address: 'administrative_area_level_2', id: 'address_line_three' }, { address: 'postal_town', id: 'town' }, { address: 'postal_code', id: 'postcode' }, { address: 'country', id: 'country' }];
			var place = autocomplete.getPlace();
			setGeoLoaction({
				lat: place.geometry.location.lat() || 0,
				lng: place.geometry.location.lng() || 0
			});
			if (!filterAddress) {
				return onAddressSelected(place);
			}
			addressDetails.forEach(function (item) {
				var matchedPlace = place.address_components;
				var address = item;
				if (matchedPlace) {
					matchedPlace.forEach(function (el) {
						populateAddressData(el, address, place);
					});
				}
			});
			var town = gettingReasult.town,
			    postcode = gettingReasult.postcode,
			    country = gettingReasult.country,
			    address_line_three = gettingReasult.address_line_three;

			var addressObject = {
				formatted_address: place.formatted_address,
				address_line_one: makeAddressOne(gettingReasult),
				address_line_two: '',
				address_line_three: address_line_three,
				town: town,
				postcode: postcode,
				country: country
			};
			addressObject.latitude = place.geometry.location.lat();
			addressObject.longitude = place.geometry.location.lng();
			onAddressSelected(addressObject);
		};
		var makeAddressOne = function makeAddressOne(address) {
			var street_number = address.street_number,
			    route = address.route,
			    premise = address.premise,
			    locality = address.locality,
			    address_line_two = address.address_line_two;

			switch (true) {
				case !!(street_number && route):
					return street_number + ' ' + route;
				case !!route:
					return route;
				case !!premise:
					return premise;
				case !!locality:
					return locality;
				default:
					return address_line_two;
			}
		};
		if (apiKey) {
			loadScript().then(function () {
				return initGoogle();
			});
		} else {
			initGoogle();
		}
		return function () {
			var _window2 = window,
			    google = _window2.google;

			google.maps.event.removeListener(googleListner);
		};
	}, []);

	return _react2.default.createElement(
		_react2.default.Fragment,
		null,
		_react2.default.createElement('input', _extends({}, props, {
			ref: currentRef,
			className: props.className,
			value: currentRef && currentRef.current && currentRef.current.value || value,
			onChange: onChange
		})),
		showMap && _react2.default.createElement(_Components.ViewGoogleMap, {
			zoom: '14',
			lat: geolocation.lat,
			lng: geolocation.lng
		})
	);
};

GoogleAutoComplete.propTypes = {
	onSelectAddress: _propTypes2.default.func.isRequired,
	value: _propTypes2.default.string,
	onAddressSelected: _propTypes2.default.func,
	types: _propTypes2.default.arrayOf(_propTypes2.default.string),
	componentRestrictions: _propTypes2.default.object,
	bounds: _propTypes2.default.object,
	fields: _propTypes2.default.array,
	showMap: _propTypes2.default.bool,
	inputAutocompleteValue: _propTypes2.default.string,
	options: _propTypes2.default.shape({
		componentRestrictions: _propTypes2.default.object,
		bounds: _propTypes2.default.object,
		location: _propTypes2.default.object,
		offset: _propTypes2.default.number,
		origin: _propTypes2.default.object,
		radius: _propTypes2.default.number,
		sessionToken: _propTypes2.default.object,
		types: _propTypes2.default.arrayOf(_propTypes2.default.string)
	}),
	apiKey: _propTypes2.default.string
};

GoogleAutoComplete.defaultProps = {
	value: ''
};

exports.default = (0, _react.memo)((0, _react.forwardRef)(function (props, ref) {
	return _react2.default.createElement(GoogleAutoComplete, _extends({}, props, { currentRef: ref }));
}));