import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const ViewGoogleMap = React.memo(
	({ lat, lng, zoom = 13, className = '' }) => {
		const mapRef = useRef(null);
		useEffect(() => {
			const { google } = window;
			if (!google) {
				return alert('google not define');
			}
			const initMap = () => {
				const mapDiv = mapRef.current;
				new google.maps.Map(mapDiv, {
					center: { lat, lng },
					zoom,
				});
			};
			initMap();
		}, [lat, lng, zoom]);
		return <div className={className} ref={mapRef} />;
	}
);

ViewGoogleMap.proptypes = {
	lat: PropTypes.any.isRequired,
	lng: PropTypes.any.isRequired,
	zoom: PropTypes.number,
	className: PropTypes.string,
};
