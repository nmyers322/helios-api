import Address from "#models/address";
import countryList from '#constants/countryList';

export default class AddressService {
    public static async displayBillingAddress(billingAddress: Address) {
        return `
            <table cellpadding="0" cellspacing="0" style="font-family:'Trebuchet MS',sans-serif;font-size:14px;">
                <tr><td colspan="2" style="font-weight:bold;padding-bottom:4px;">Billing Address</td></tr>
                <tr><td colspan="2">${billingAddress.firstName} ${billingAddress.lastName}</td></tr>
                ${billingAddress.company ? `<tr><td colspan="2">${billingAddress.company}</td></tr>` : ''}
                <tr><td colspan="2">${billingAddress.address1}</td></tr>
                ${billingAddress.address2 ? `<tr><td colspan="2">${billingAddress.address2}</td></tr>` : ''}
                <tr><td colspan="2">${billingAddress.city}, ${billingAddress.state} ${billingAddress.postcode}</td></tr>
                <tr><td colspan="2">${countryList.find((c: any) => c.value === billingAddress.country)?.label}</td></tr>
                ${billingAddress.phone ? `<tr><td colspan="2">Phone: ${billingAddress.phone}</td></tr>` : ''}
            </table>
        `;
    }

    public static async displayShippingAddress(shippingAddress: Address) {
        return `
            <table cellpadding="0" cellspacing="0" style="font-family:'Trebuchet MS',sans-serif;font-size:14px;">
                <tr><td colspan="2" style="font-weight:bold;padding-bottom:4px;">Shipping Address</td></tr>
                <tr><td colspan="2">${shippingAddress.firstName} ${shippingAddress.lastName}</td></tr>
                <tr><td colspan="2">${shippingAddress.address1}</td></tr>
                ${shippingAddress.address2 ? `<tr><td colspan="2">${shippingAddress.address2}</td></tr>` : ''}
                <tr><td colspan="2">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postcode}</td></tr>
                <tr><td colspan="2">${countryList.find((c: any) => c.value === shippingAddress.country)?.label}</td></tr>
            </table>
        `;
    }
}