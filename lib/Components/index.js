'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ViewGoogleMap = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewGoogleMap = exports.ViewGoogleMap = _react2.default.memo(function (_ref) {
	var lat = _ref.lat,
	    lng = _ref.lng,
	    _ref$zoom = _ref.zoom,
	    zoom = _ref$zoom === undefined ? 13 : _ref$zoom,
	    _ref$className = _ref.className,
	    className = _ref$className === undefined ? '' : _ref$className;

	var mapRef = (0, _react.useRef)(null);
	(0, _react.useEffect)(function () {
		var _window = window,
		    google = _window.google;

		if (!google) {
			return alert('google not define');
		}
		var initMap = function initMap() {
			var mapDiv = mapRef.current;
			new google.maps.Map(mapDiv, {
				center: { lat: lat, lng: lng },
				zoom: zoom
			});
		};
		initMap();
	}, [lat, lng, zoom]);
	return _react2.default.createElement('div', { className: className, ref: mapRef });
});

viewMap.proptypes = {
	lat: _propTypes2.default.any.isRequired,
	lng: _propTypes2.default.any.isRequired,
	zoom: _propTypes2.default.number,
	className: _propTypes2.default.string
};