import { countryList } from "./countryList";

export const camelCaseToSnakeCase = (str) => {
    return str.replace(/[A-Z0-9]/g, letter => `_${letter.toLowerCase()}`);
};

export const camelCaseToSnakeCaseAllObjectKeys = (obj) => {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    return Object.keys(obj).reduce((acc, key) => {
        acc[camelCaseToSnakeCase(key)] = obj[key];
        return acc;
    }, {});
}

export const getCountryFromCode = (code) => {
    return countryList.find(country => country.value === code).label;
}

export const parseAddressIntoFullName = (address) => {
    let response = "";
    response += address.firstName ? address.firstName : "";
    response += address.lastName ? " " + address.lastName : "";
    return response;
}

export const parseAddressIntoStreetAddress = (address) => {
    let response = "";
    response += address.address1 ? address.address1 : "";
    response += address.address2 ? " " + address.address2 : "";
    return response;
}

export const parseAddressIntoCityStateZip = (address) => {
    let response = "";
    response += address.city ? address.city : "";
    response += address.state ? ", " + address.state : "";
    response += address.postcode ? " " + address.postcode : "";
    return response;
}

export const parseAddressToOneLine = (address) => {
    let response = "";
    response += address.address1 ? address.address1 : "";
    response += address.address2 ? " " + address.address2 : "";
    response += address.city ? ", " + address.city : "";
    response += address.state ? ", " + address.state : "";
    response += address.postcode ? " " + address.postcode : "";
    response += address.country ? ", " + address.country : "";
    return response;
}

export const sanitizeUserInput = (str) => {
    // mess with this later
    return str;
}

export const snakeCaseToCamelCase = (str) => {
    return str.replace(/(_\w)/g, match => match[1].toUpperCase());
};

export const snakeCaseToCamelCaseAllObjectKeys = (obj) => {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    return Object.keys(obj).reduce((acc, key) => {
        acc[snakeCaseToCamelCase(key)] = obj[key];
        return acc;
    }, {});
}
export const capitalizeWords = (str) => {
    return str.split(' ').reduce((acc, word) => acc + ' ' + word.charAt(0).toUpperCase() + word.slice(1), '').trim();
}

export const remToPx = (rem) => {
    document.documentElement.style.setProperty('--rem-value', `${rem}`);
    const pixels = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rem-value'));
    return pixels;
}