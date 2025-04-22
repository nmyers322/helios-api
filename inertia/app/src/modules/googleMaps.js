export const convertGooglePlaceToAddress = (place) => {
    let address = {};
    const getValue = (type) => place?.address_components.find(component => component.types.includes(type));
    if (getValue('street_number') && getValue('route')) {
        address.address1 = getValue('street_number').long_name + ' ' + getValue('route').long_name;
    }
    address.city = getValue('locality')?.long_name;
    address.state = getValue('administrative_area_level_1')?.short_name;
    address.postcode = getValue('postal_code')?.long_name;
    address.country = getValue('country')?.short_name;
    return address;
}