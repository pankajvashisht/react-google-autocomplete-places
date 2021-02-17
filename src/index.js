import React, { forwardRef, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { GoogleURl } from './constants.js';
let autocomplete;
let googleListner;

const GoogleAutoComplete = ({ onChange, onAddressSelected, value, ...props, }) => {
	const currentRef = useRef(null);

	const loadScript = () => {
		const { apiKey } = props;
        const googleMapsScriptUrl = GoogleURl(apiKey);
		if (
			document.querySelectorAll(`script[src="${googleMapsScriptUrl}"]`).length >
			0
		) {
			return Promise.resolve();
		}

		let googleMapsScript = document.createElement('script');
		googleMapsScript.src = googleMapsScriptUrl;
		document.body.appendChild(googleMapsScript);
		return new Promise((resolve) => {
			googleMapsScript.addEventListener('load', () => resolve());
		});
	};

	useEffect(() => {
		const {
			types = ['(cities)'],
			componentRestrictions,
			bounds,
            apiKey,
            filterAddress,
			fields = [
				'address_components',
				'geometry.location',
				'place_id',
				'formatted_address',
			],
			options = {},
		} = props;

		const googleConfig = {
			...options,
			types,
			bounds,
			fields,
		};

		if (componentRestrictions) {
			config.componentRestrictions = componentRestrictions;
		}

		const initGoogle = () => {
			const { google } = window;
			const autocompleteField = currentRef.current;
			autocomplete = new google.maps.places.Autocomplete(
				autocompleteField,
				googleConfig
			);
			googleListner = google.maps.event.addListener(
				autocomplete,
				'place_changed',
				fillInAddress
			);
		};
		const fillInAddress = () => {
			const gettingReasult = {};
			const populateAddressData = (address, addressObj) => {
				const addressType = address.types[0];
				if (addressObj.address === addressType) {
					const place = autocomplete.getPlace();
					const addressValues =
						addressObj.id === 'address_line_one'
							? place.name
							: address.long_name;
					if (addressValues) {
						gettingReasult[addressObj.id] = addressValues;
					}
				}
			};
			const addressDetails = [
				{ address: 'route', id: 'route' },
				{ address: 'street_number', id: 'street_number' },
				{ address: 'neighborhood', id: 'neighborhood' },
				{ address: 'premise', id: 'premise' },
				{ address: 'locality', id: 'locality' },
				{ address: 'administrative_area_level_1', id: 'address_line_two' },
				{ address: 'administrative_area_level_2', id: 'address_line_three' },
				{ address: 'postal_town', id: 'town' },
				{ address: 'postal_code', id: 'postcode' },
				{ address: 'country', id: 'country' },
			];
            const place = autocomplete.getPlace();
            if (!filterAddress) {
                return onAddressSelected(place);
            }
			addressDetails.forEach((item) => {
				const matchedPlace = place.address_components;
				const address = item;
				if (matchedPlace) {
					matchedPlace.forEach((el) => {
						populateAddressData(el, address, place);
					});
				}
			});
			const { town, postcode, country, address_line_three } = gettingReasult;
			const addressObject = {
				formatted_address: place.formatted_address,
				address_line_one: makeAddressOne(gettingReasult),
				address_line_two: '',
				address_line_three,
				town,
				postcode,
				country,
			};
			addressObject.latitude = place.geometry.location.lat();
			addressObject.longitude = place.geometry.location.lng();
			onAddressSelected(addressObject);
		};
		const makeAddressOne = (address) => {
			const {
				street_number,
				route,
				premise,
				locality,
				address_line_two,
			} = address;
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
			loadScript().then(() => initGoogle());
		} else {
			initGoogle();
		}
		return () => {
			const { google } = window;
			google.maps.event.removeListener(googleListner);
		};
	}, []);

	return (
		<input
			{...props}
			ref={currentRef}
			className={props.className}
			value={
				(currentRef && currentRef.current && currentRef.current.value) || value
			}
			onChange={onChange}
		/>
	);
};

GoogleAutoComplete.propTypes = {
	onSelectAddress: PropTypes.func.isRequired,
	value: PropTypes.string,
	onAddressSelected: PropTypes.func,
	types: PropTypes.arrayOf(PropTypes.string),
	componentRestrictions: PropTypes.object,
	bounds: PropTypes.object,
	fields: PropTypes.array,
	inputAutocompleteValue: PropTypes.string,
	options: PropTypes.shape({
		componentRestrictions: PropTypes.object,
		bounds: PropTypes.object,
		location: PropTypes.object,
		offset: PropTypes.number,
		origin: PropTypes.object,
		radius: PropTypes.number,
		sessionToken: PropTypes.object,
		types: PropTypes.arrayOf(PropTypes.string),
	}),
	apiKey: PropTypes.string,
};

GoogleAutoComplete.defaultProps = {
	value: '',
};

export default memo(
	forwardRef((props, ref) => <GoogleAutoComplete {...props} currentRef={ref} />)
);
