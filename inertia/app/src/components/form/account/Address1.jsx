import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateBillingAddressFormField, updateBillingAddressFormFromGoogleMaps } from "../../../actions/billingAddressActions";
import { updateShippingAddressFormField, updateShippingAddressFormFromGoogleMaps } from "../../../actions/shippingAddressActions";
import { validateAddress1 } from "../../../modules/accountValidation";
import { heliosLogger } from "../../../modules/logging";

const address1Name = "address1";
const address1Label = "Address";

const Address1 = ({ 
  addressType = "billing",
  isDisabled = false 
}) => {
  const addressForm = useSelector((state) => state[`${addressType}AddressForm`]);
  const updateAddressForm = addressType === "shipping" ? updateShippingAddressFormFromGoogleMaps : updateBillingAddressFormFromGoogleMaps;
  const updateAddressFormField = addressType === "shipping" ? updateShippingAddressFormField : updateBillingAddressFormField;
  const dispatch = useDispatch();

  return (
    <LabeledInput
      isDisabled={isDisabled}
      validationResponse={validateAddress1(addressForm)}
      name={address1Name}
      onChange={(addressValue) => {
        if (addressValue?.value?.place_id) {
          const service = new window.google.maps.places.PlacesService(document.createElement('div'));
          service.getDetails({ placeId: addressValue.value.place_id }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              dispatch(updateAddressForm(place));
            } else {
              heliosLogger("Error fetching place details", status);
            }
          });
        } else {
          heliosLogger("Address value is not a valid place ID", addressValue);
          dispatch(updateAddressFormField(address1Name, addressValue));
        }
      }}
      text={address1Label}
      type="GooglePlacesAutocomplete"
      value={addressForm[address1Name]}
    />
  );
};

export default Address1;

export { address1Name, address1Label };